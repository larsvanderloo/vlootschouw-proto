import { TrendChip } from "@heroui-pro/react";
import { GridTile } from "./GridTile";
import { MemberAvatars } from "./MemberAvatars";
import {
  BENCHMARK, BENCHMARK_LOW_POTENTIAL, CATEGORIES, X_LABELS, Y_ROWS,
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
      {/* mobiel: compacte 3x3 met assen */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {X_LABELS.map((l) => (
            <div key={l} className="text-muted text-center text-[11px] font-medium leading-4">{l}</div>
          ))}
        </div>
        {rows.map((y, i) => (
          <div key={y} className="flex flex-col gap-1.5">
            <div className="text-muted text-xs font-medium">
              {Y_ROWS[i].label} <span className="opacity-60">· potentieel {Y_ROWS[i].level}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((x) => {
                const cat = CATEGORIES.find((c) => c.x === x && c.y === y)!;
                return (
                  <GridTile
                    key={cat.key}
                    dense
                    category={cat}
                    members={shares.byCategory[cat.key]}
                    pct={shares.pct[cat.key]}
                    benchmark={BENCHMARK[cat.key]}
                    showBenchmark={showBenchmark}
                    onOpen={onOpen}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* desktop: 3x3 met aslabels */}
      <div className="grid grid-cols-[6rem_repeat(3,minmax(0,1fr))] gap-x-4 gap-y-4 max-md:hidden">
        {rows.map((y, i) => (
          <div key={y} className="contents">
            <div className="text-muted flex flex-col justify-center text-sm font-medium leading-tight">
              <span>{Y_ROWS[i].label}</span>
              <span className="text-xs font-normal opacity-70">potentieel {Y_ROWS[i].level}</span>
            </div>
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
        <div />
        {X_LABELS.map((l) => (
          <div key={l} className="text-muted text-center text-sm font-medium">
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
            Potentieel 1, buiten het grid · {shares.lowPotential.length}{" "}
            {shares.lowPotential.length === 1 ? "medewerker" : "medewerkers"}
          </span>
        </div>
        {showBenchmark && (
          <TrendChip size="sm" trend={trendOf(lowPct, BENCHMARK_LOW_POTENTIAL)}>
            {fmtDelta(lowPct, BENCHMARK_LOW_POTENTIAL)}
            <TrendChip.Suffix className="max-md:hidden">bm {fmtPct(BENCHMARK_LOW_POTENTIAL, 1)}</TrendChip.Suffix>
          </TrendChip>
        )}
        <span className="max-md:hidden"><MemberAvatars members={shares.lowPotential} size="sm" /></span>
      </button>
    </div>
  );
}
