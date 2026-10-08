import { Switch } from "@heroui/react";
import { TrendChip } from "@heroui-pro/react";
import { BENCHMARK, BENCHMARK_LOW_POTENTIAL, BENCHMARK_META, fmtDelta, fmtPct, trendOf, type Shares } from "../data/vlootschouw";

interface Props {
  shares: Shares;
  showBenchmark: boolean;
  onToggle: (v: boolean) => void;
  title?: string;
}

const GROUPS = [
  { label: "Sterren, talenten en toppers", keys: ["ster", "talent", "topper"] as const },
  { label: "Professionals", keys: ["professional"] as const },
  { label: "Onderpresteerders", keys: ["onderpresteerder"] as const },
];

export function BenchmarkCard({ shares, showBenchmark, onToggle, title = BENCHMARK_META.title }: Props) {
  const all = shares.total + shares.lowPotential.length;
  const rows = GROUPS.map((g) => ({
    label: g.label,
    own: g.keys.reduce((s, k) => s + shares.pct[k], 0),
    bm: g.keys.reduce((s, k) => s + BENCHMARK[k], 0),
  }));
  rows.push({
    label: "Plaatsing heroverwegen",
    own: all ? (shares.lowPotential.length / all) * 100 : 0,
    bm: BENCHMARK_LOW_POTENTIAL,
  });

  return (
    <aside className="bg-accent text-accent-foreground flex w-full flex-col gap-4 rounded-2xl p-6 lg:w-[360px] lg:shrink-0">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm opacity-90">{BENCHMARK_META.description}</p>
      </div>
      <div className="bg-surface text-foreground flex flex-col gap-3 rounded-xl p-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-medium">{r.label}</span>
              <span className="text-muted text-xs">Benchmark {fmtPct(r.bm, 1)}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-base font-semibold">{fmtPct(r.own)}</span>
              <TrendChip size="sm" trend={trendOf(r.own, r.bm)}>
                {fmtDelta(r.own, r.bm)}
                <TrendChip.Suffix>vs bm</TrendChip.Suffix>
              </TrendChip>
            </div>
          </div>
        ))}
      </div>
      <Switch isSelected={showBenchmark} onChange={onToggle}>
        <Switch.Content className="text-accent-foreground text-sm">
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          Benchmark tonen in het grid
        </Switch.Content>
      </Switch>
      <p className="text-xs opacity-80">
        Groen = hoger aandeel dan de benchmark, rood = lager. Bijgewerkt {BENCHMARK_META.updated}.
      </p>
    </aside>
  );
}
