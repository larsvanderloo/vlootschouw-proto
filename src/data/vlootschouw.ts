export type CategoryKey =
  | "starter" | "talent" | "ster"
  | "instabiele_presteerder" | "professional" | "topper"
  | "onderpresteerder" | "generieke_medewerker" | "specialist";

export type Tint = "none" | "success" | "danger";

export interface Category { key: CategoryKey; label: string; description: string; x: 0 | 1 | 2; y: 0 | 1 | 2; tint: Tint; lowerIsBetter?: boolean }

/** x = prestatieband (0 laag, 1 middel, 2 hoog), y = potentieel - 2 (0..2) */
export const CATEGORIES: Category[] = [
  { key: "starter", label: "Starter", description: "Hoog potentieel, nog lage prestatie. Vaak nieuw in de rol: investeer in begeleiding en geef tijd om te groeien.", x: 0, y: 2, tint: "none" },
  { key: "talent", label: "Talent", description: "Hoog potentieel met een goede prestatie. Klaar voor meer verantwoordelijkheid of een volgende stap.", x: 1, y: 2, tint: "success" },
  { key: "ster", label: "Ster", description: "Hoog potentieel én topprestatie. Koester deze medewerkers: uitdagende opdrachten en zicht op doorgroei.", x: 2, y: 2, tint: "success" },
  { key: "instabiele_presteerder", label: "Instabiele presteerder", description: "Potentieel aanwezig, prestatie blijft achter. Zoek de oorzaak: rol, motivatie of omstandigheden.", x: 0, y: 1, tint: "none" },
  { key: "professional", label: "Professional", description: "Solide prestatie met groeipotentieel. De ruggengraat van het team; houd ze betrokken en in ontwikkeling.", x: 1, y: 1, tint: "none" },
  { key: "topper", label: "Topper", description: "Topprestatie met potentieel om verder te groeien. Geef verdieping of een bredere rol.", x: 2, y: 1, tint: "success" },
  { key: "onderpresteerder", label: "Onderpresteerder", description: "Lage prestatie en weinig groeiruimte in deze rol. Bespreek verwachtingen en zoek een passende plek.", x: 0, y: 0, tint: "danger", lowerIsBetter: true },
  { key: "generieke_medewerker", label: "Generieke medewerker", description: "Goed geplaatst met een stabiele prestatie. Weinig behoefte aan verandering; waardeer de constante bijdrage.", x: 1, y: 0, tint: "none" },
  { key: "specialist", label: "Specialist", description: "Topprestatie in de huidige rol, vooral waardevol als expert. Niet per se gericht op doorgroei.", x: 2, y: 0, tint: "none" },
];

export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<CategoryKey, Category>;
export const X_LABELS = ["Prestatie laag", "Prestatie middel", "Prestatie hoog"];
/** Officiële Welder-teksten POTENTIAL_LABEL_1..4 */
export const POTENTIAL_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Plaatsing heroverwegen",
  2: "Goed geplaatst",
  3: "Potentieel",
  4: "Top-potentieel",
};
/** Rijen van boven naar beneden: potentieel 4, 3, 2 */
export const Y_ROWS: { level: 2 | 3 | 4; label: string }[] = [
  { level: 4, label: POTENTIAL_LABELS[4] },
  { level: 3, label: POTENTIAL_LABELS[3] },
  { level: 2, label: POTENTIAL_LABELS[2] },
];

/** Welder benchmark, % per vak (potentieel 1 valt buiten de benchmark) */
export const BENCHMARK: Record<CategoryKey, number> = {
  starter: 6.1, talent: 9.8, ster: 7.4,
  instabiele_presteerder: 8.9, professional: 31.2, topper: 14.0,
  onderpresteerder: 4.3, generieke_medewerker: 12.7, specialist: 5.6,
};
export const BENCHMARK_LOW_POTENTIAL = 3.1; // aandeel "plaatsing heroverwegen" (demo)
export const BENCHMARK_META = {
  title: "Hoe goed doen we het?",
  description: "Benchmark op basis van 300.000+ gesprekken bij 800+ organisaties",
  updated: "1 oktober 2026",
};

export const SCALE = { min: 5, max: 10 };

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  department: string;
  position: string;
  cycle: string;
  date: string; // ISO
  performance: number; // 5.0 - 10.0
  potential: 1 | 2 | 3 | 4;
  managerId: string;
}

export function categorize(e: Pick<Employee, "performance" | "potential">): CategoryKey | null {
  if (e.potential < 2) return null;
  const third = (SCALE.max - SCALE.min) / 3;
  let x: 0 | 1 | 2 = 2;
  if (e.performance <= SCALE.min + third) x = 0;
  else if (e.performance <= SCALE.min + 2 * third) x = 1;
  const y = (e.potential - 2) as 0 | 1 | 2;
  return CATEGORIES.find((c) => c.x === x && c.y === y)!.key;
}

export const BAND_RANGES = ["5,0 – 6,7", "6,7 – 8,3", "8,3 – 10"];

// ---------- demo data ----------
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];

const FIRST = ["Sanne", "Tom", "Lisa", "Mark", "Noor", "Daan", "Eva", "Bram", "Fleur", "Jesse", "Anne", "Lars", "Iris", "Ruben", "Sofie", "Milan", "Julia", "Thijs", "Lotte", "Sem", "Femke", "Koen", "Roos", "Bas", "Nina", "Joris", "Maud", "Tim", "Esmee", "Luuk", "Yara", "Niels", "Tess", "Stijn", "Isa", "Gijs", "Lieke", "Finn", "Mila", "Jens", "Zoë", "Sven"];
const LAST = ["de Vries", "Bakker", "Jansen", "de Boer", "Visser", "Smit", "Mulder", "Kok", "Meijer", "Vos", "Dijkstra", "Hendriks", "van Dijk", "Peters", "Willems", "Brouwer", "Bos", "de Jong", "Kuipers", "Schouten", "van Leeuwen"];
const DEPTS: Record<string, string[]> = {
  Sales: ["Accountmanager", "Teamlead Sales", "Inside sales"],
  IT: ["Developer", "DevOps engineer", "Product owner"],
  HR: ["HR-adviseur", "Recruiter"],
  Service: ["Monteur", "Servicecoördinator"],
  Operations: ["Planner", "Teamlead Operations"],
  Marketing: ["Marketeer", "Trainee"],
  Advies: ["Consultant", "Senior consultant"],
};
const CYCLES = ["Jaargesprek 2025", "Jaargesprek 2025", "Jaargesprek 2025", "Voorjaarsgesprek 2026"];
const MANAGERS = ["m1", "m2", "m3", "m4", "m5"];

export const TEAM_MANAGER_ID = "m1";
export const TEAM_MANAGER_NAME = "Lars van der Loo";

function makeEmployees(n: number): Employee[] {
  const out: Employee[] = [];
  const used = new Set<string>();
  while (out.length < n) {
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    if (used.has(name)) continue;
    used.add(name);
    const department = pick(Object.keys(DEPTS));
    const r = rnd();
    const potential = (r < 0.07 ? 1 : r < 0.35 ? 2 : r < 0.72 ? 3 : 4) as 1 | 2 | 3 | 4;
    // prestatie: licht gecorreleerd met potentieel
    const base = 5.5 + rnd() * 4.2 + (potential - 2) * 0.25;
    const performance = Math.round(Math.min(10, Math.max(5, base)) * 10) / 10;
    const month = 1 + Math.floor(rnd() * 12);
    const day = 1 + Math.floor(rnd() * 27);
    const id = `u${out.length + 1}`;
    out.push({
      id, name,
      avatar: `https://img.heroui.chat/image/avatar?w=96&h=96&u=${out.length + 11}`,
      department, position: pick(DEPTS[department]),
      cycle: pick(CYCLES),
      date: `${month <= 9 ? 2026 : 2025}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      performance, potential,
      managerId: out.length < 8 ? TEAM_MANAGER_ID : pick(MANAGERS.slice(1)),
    });
  }
  return out;
}

export const EMPLOYEES: Employee[] = makeEmployees(42);
export const DEPARTMENTS = Object.keys(DEPTS);
export const CYCLE_OPTIONS = Array.from(new Set(CYCLES));

// ---------- aggregation ----------
export interface Shares {
  total: number; // classifiable (potentieel >= 2)
  lowPotential: Employee[];
  byCategory: Record<CategoryKey, Employee[]>;
  pct: Record<CategoryKey, number>;
}

export function computeShares(list: Employee[]): Shares {
  const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c.key, [] as Employee[]])) as Record<CategoryKey, Employee[]>;
  const lowPotential: Employee[] = [];
  for (const e of list) {
    const k = categorize(e);
    if (k) byCategory[k].push(e); else lowPotential.push(e);
  }
  const total = list.length - lowPotential.length;
  const pct = Object.fromEntries(CATEGORIES.map((c) => [c.key, total ? (byCategory[c.key].length / total) * 100 : 0])) as Record<CategoryKey, number>;
  return { total, lowPotential, byCategory, pct };
}

export const fmtPct = (v: number, digits = 0) => v.toFixed(digits).replace(".", ",") + "%";
export const fmtScore = (v: number) => v.toFixed(1).replace(".", ",");
export const fmtDelta = (own: number, bm: number) => {
  const d = own - bm;
  return (d > 0 ? "+" : d < 0 ? "−" : "") + Math.abs(d).toFixed(1).replace(".", ",") + "%";
};
export const trendOf = (own: number, bm: number): "up" | "down" | "neutral" => Math.abs(own - bm) < 0.05 ? "neutral" : own > bm ? "up" : "down";
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
export const initials = (name: string) => name.split(" ").filter((p) => p[0] === p[0].toUpperCase()).map((p) => p[0]).join("").slice(0, 2);
