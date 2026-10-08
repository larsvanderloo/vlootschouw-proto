// Screenshot a URL with real device emulation via the Chrome DevTools protocol.
// usage: node scripts/shot.mjs <url> <out.png> [width] [height] [mobile=1]
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [url, out, w = "390", h = "844", mobile = "1"] = process.argv.slice(2);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9333;
const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, "--remote-allow-origins=*", "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--user-data-dir=/tmp/shot-profile", "about:blank"], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let version;
for (let i = 0; i < 50; i++) {
  try { version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); break; } catch { await sleep(200); }
}
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}, sessionId) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });

const { result: { targetId } } = await send("Target.createTarget", { url: "about:blank" });
const { result: { sessionId } } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 2, mobile: mobile === "1" }, sessionId);
if (mobile === "1") await send("Emulation.setTouchEmulationEnabled", { enabled: true }, sessionId);
await send("Page.enable", {}, sessionId);
await send("Page.navigate", { url }, sessionId);
await sleep(3500);
const { result: { data } } = await send("Page.captureScreenshot", { format: "png" }, sessionId);
writeFileSync(out, Buffer.from(data, "base64"));
ws.close(); chrome.kill();
console.log("saved", out);
