import { Tooltip } from "@heroui/react";
import { TrendChip } from "@heroui-pro/react";
import { MemberAvatars } from "./MemberAvatars";
import { fmtDelta, fmtPct, trendOf, type Category, type Employee } from "../data/vlootschouw";

interface Props {
  category: Category;
  members: Employee[];
  pct: number;
  benchmark: number;
  showBenchmark: boolean;
  compact?: boolean;
  onOpen: (category: Category) => void;
}

const TINT: Record<Category["tint"], string> = {
  none: "bg-surface border-border",
  success: "bg-success-soft border-success/40",
  danger: "bg-danger-soft border-danger/40",
};

export function GridTile({ category, members, pct, benchmark, showBenchmark, compact, onOpen }: Props) {
  const empty = members.length === 0;
  return (
    <button
      type="button"
      onClick={() => onOpen(category)}
      aria-label={`${category.label}: ${members.length} medewerkers, open lijst`}
      className={[
        "flex w-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        "hover:ring-2 hover:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        empty ? "bg-surface-secondary border-border opacity-70" : TINT[category.tint],
        compact ? "p-3 gap-2" : "",
      ].join(" ")}
    >
      <span className="text-foreground text-base font-medium leading-6">{category.label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-foreground font-semibold tabular-nums ${empty ? "text-muted" : ""} ${compact ? "text-xl" : "text-2xl"}`}>{fmtPct(pct)}</span>
        {showBenchmark && (
          <Tooltip delay={200}>
            <Tooltip.Trigger>
              <span>
                <TrendChip size="sm" trend={trendOf(pct, benchmark)}>
                  {fmtDelta(pct, benchmark)}
                  <TrendChip.Suffix>bm {fmtPct(benchmark, 1)}</TrendChip.Suffix>
                </TrendChip>
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content showArrow>
              Ten opzichte van de benchmark ({fmtPct(benchmark, 1)})
            </Tooltip.Content>
          </Tooltip>
        )}
      </div>
      <MemberAvatars members={members} size="sm" />
    </button>
  );
}
