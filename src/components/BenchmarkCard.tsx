import { BarChart } from "@heroui-pro/react/bar-chart";
import {
  BENCHMARK,
  BENCHMARK_LOW_POTENTIAL,
  BENCHMARK_META,
  fmtPct,
  type Shares,
} from "../data/vlootschouw";

interface Props {
  shares: Shares;
  title?: string;
  /** Zonder eigen kaart-surface, voor gebruik in een sheet. */
  bare?: boolean;
}

const GROUPS = [
  {
    label: "Sterren, talenten, toppers",
    keys: ["ster", "talent", "topper"] as const,
  },
  { label: "Professionals", keys: ["professional"] as const },
  { label: "Onderpresteerders", keys: ["onderpresteerder"] as const },
];

/** Links uitgelijnde, zelf afgebroken as-labels (recharts lijnt standaard rechts uit). */
function wrapWords(text: string, max = 16): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? cur + " " + w : w;
  }
  if (cur) lines.push(cur);
  return lines;
}
function LeftTick({
  y = 0,
  payload,
}: {
  y?: number;
  payload?: { value: string };
}) {
  const lines = wrapWords(String(payload?.value ?? ""));
  const lh = 13;
  const first = y - ((lines.length - 1) * lh) / 2 + 4;
  return (
    <text x={0} textAnchor="start" fontSize={11} fill="var(--muted)">
      {lines.map((l, i) => (
        <tspan key={i} x={0} y={first + i * lh}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

const SERIES = [
  { key: "wij", name: "Wij", color: "var(--chart-3)" },
  { key: "benchmark", name: "Benchmark", color: "var(--chart-5)" },
];

/** Compacte benchmark-kaart voor de zijbalk: wij versus benchmark per groep. */
export function BenchmarkCard({
  shares,
  title = BENCHMARK_META.title,
  bare = false,
}: Props) {
  const all = shares.total + shares.lowPotential.length;
  const data = GROUPS.map((g) => ({
    group: g.label,
    wij: Math.round(g.keys.reduce((s, k) => s + shares.pct[k], 0) * 10) / 10,
    benchmark:
      Math.round(g.keys.reduce((s, k) => s + BENCHMARK[k], 0) * 10) / 10,
  }));
  data.push({
    group: "Plaatsing heroverwegen",
    wij: all ? Math.round((shares.lowPotential.length / all) * 1000) / 10 : 0,
    benchmark: BENCHMARK_LOW_POTENTIAL,
  });
  const max = Math.max(...data.flatMap((d) => [d.wij, d.benchmark]));

  const body = (
    <div className="flex flex-col gap-4">
      <div>
        <h2
          className={`text-xl font-semibold ${bare ? "text-foreground" : "text-accent-foreground"}`}
        >
          {title}
        </h2>
        <p
          className={`mt-1 text-sm ${bare ? "text-muted" : "text-accent-foreground/80"}`}
        >
          {BENCHMARK_META.description} · bijgewerkt {BENCHMARK_META.updated}
        </p>
      </div>
      <div
        className={`flex flex-col gap-3 ${bare ? "" : "bg-surface rounded-xl p-4"}`}
      >
        <div className="flex items-center gap-3">
          {SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-muted text-xs">{s.name}</span>
            </span>
          ))}
        </div>
        <BarChart
          data={data}
          height={4 * 48}
          layout="vertical"
          margin={{ top: 0, right: 36, bottom: 0, left: 0 }}
        >
          <BarChart.XAxis
            hide
            type="number"
            domain={[0, Math.ceil(max / 10) * 10]}
          />
          <BarChart.YAxis
            dataKey="group"
            type="category"
            width={110}
            interval={0}
            tick={<LeftTick />}
          />
          <BarChart.Bar
            dataKey="wij"
            name="Wij"
            fill={SERIES[0].color}
            barSize={8}
            radius={[0, 24, 24, 0]}
            label={{
              position: "right",
              fontSize: 11,
              fill: "var(--foreground)",
              formatter: (v) => fmtPct(Number(v)),
            }}
          />
          <BarChart.Bar
            dataKey="benchmark"
            name="Benchmark"
            fill={SERIES[1].color}
            barSize={8}
            radius={[0, 24, 24, 0]}
            label={{
              position: "right",
              fontSize: 11,
              fill: "var(--muted)",
              formatter: (v) => fmtPct(Number(v), 1),
            }}
          />
          <BarChart.Tooltip
            content={
              <BarChart.TooltipContent
                valueFormatter={(v) => fmtPct(Number(v), 1)}
              />
            }
          />
        </BarChart>
      </div>
    </div>
  );
  if (bare) return body;
  return <aside className="bg-accent rounded-2xl p-6">{body}</aside>;
}
