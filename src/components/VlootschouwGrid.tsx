import { TrendChip } from "@heroui-pro/react";
import { GridTile } from "./GridTile";
import { MemberAvatars } from "./MemberAvatars";
import {
  BENCHMARK, BENCHMARK_LOW_POTENTIAL, CATEGORIES, X_LABELS, Y_LABELS,
  fmtDelta, fmtPct, trendOf, type Category, type Shares,
} from "../data/vlootschouw";

interface Props {
  shares: Shares;
  showBenchmark: boolean;
  compact?: boolean;
  onOpen: (category: Category | "low") => void;
}

export function VlootschouwGrid({ shares, showBenchmark, compact, onOpen }: Props) {
  const rows = [2, 1, 0] as const; // potentieel 4, 3, 2
  const lowPct = shares.total + shares.lowPotential.length
    ? (shares.lowPotential.length / (shares.total + shares.lowPotential.length)) * 100
    : 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[6rem_repeat(3,minmax(0,1fr))] gap-x-4 gap-y-4 max-md:grid-cols-1">
        {rows.map((y, i) => (
          <div key={y} className="contents">
            <div className="text-muted flex items-center text-sm font-medium max-md:hidden">{Y_LABELS[i]}</div>
            {[0, 1, 2].map((x) => {
              const cat = CATEGORIES.find((c) => c.x === x && c.y === y)!;
              return (
                <GridTile
                  key={cat.key}
                  category={cat}
                  members={shares.byCategory[cat.key]}
                  pct={shares.pct[cat.key]}
                  benchmark={BENCHMARK[cat.key]}
                  showBenchmark={showBenchmark}
                  compact={compact}
                  onOpen={onOpen}
                />
              );
            })}
          </div>
        ))}
        <div className="max-md:hidden" />
        {X_LABELS.map((l) => (
          <div key={l} className="text-muted text-center text-sm font-medium max-md:hidden">
            {l}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpen("low")}
        className="bg-surface-secondary border-border hover:ring-accent/40 focus-visible:ring-accent flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors hover:ring-2 focus-visible:outline-none focus-visible:ring-2"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-foreground text-sm font-medium">Plaatsing heroverwegen</span>
          <span className="text-muted text-xs">
            Potentieel 1, valt buiten het grid · {shares.lowPotential.length}{" "}
            {shares.lowPotential.length === 1 ? "medewerker" : "medewerkers"}
          </span>
        </div>
        {showBenchmark && (
          <TrendChip size="sm" trend={trendOf(lowPct, BENCHMARK_LOW_POTENTIAL)}>
            {fmtDelta(lowPct, BENCHMARK_LOW_POTENTIAL)}
            <TrendChip.Suffix>bm {fmtPct(BENCHMARK_LOW_POTENTIAL, 1)}</TrendChip.Suffix>
          </TrendChip>
        )}
        <MemberAvatars members={shares.lowPotential} size="sm" />
      </button>
    </div>
  );
}
