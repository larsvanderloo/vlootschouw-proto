import { Persons } from "@gravity-ui/icons";
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
  /** Mobiele 3x3: kleine tegel zonder avatars, alleen naam, %, delta en aantal. */
  dense?: boolean;
  onOpen: (category: Category) => void;
}

const DOT: Record<Category["tint"], string> = {
  none: "bg-default",
  success: "bg-success",
  danger: "bg-danger",
};

function TileTitle({ category, count, dense }: { category: Category; count: number; dense?: boolean }) {
  if (dense) {
    return (
      <span className="flex flex-col gap-0.5 text-xs leading-4">
        <span className="flex items-start gap-1.5">
          <span className={`mt-1 size-2 shrink-0 rounded-full ${DOT[category.tint]}`} aria-hidden="true" />
          <span className="text-foreground line-clamp-2 font-medium break-words hyphens-auto" lang="nl">{category.label}</span>
        </span>
        <span className="text-muted flex items-center gap-1 pl-3.5 tabular-nums" aria-label={`${count} medewerkers`}>
          <Persons className="size-3" /> {count}
        </span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 text-base leading-6">
      <span className={`size-2 shrink-0 rounded-full ${DOT[category.tint]}`} aria-hidden="true" />
      <span className="text-foreground font-medium">{category.label}</span>
      <span className="text-muted tabular-nums">{count}</span>
    </span>
  );
}

export function GridTile({ category, members, pct, benchmark, showBenchmark, compact, dense, onOpen }: Props) {
  const empty = members.length === 0;
  if (dense) {
    return (
      <button
        type="button"
        onClick={() => onOpen(category)}
        aria-label={`${category.label}: ${members.length} medewerkers, open lijst`}
        className={[
          "bg-surface border-border flex min-h-[7.5rem] w-full flex-col items-start gap-2 rounded-xl border p-2.5 text-left",
          "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2",
          empty ? "opacity-60" : "",
        ].join(" ")}
      >
        <TileTitle category={category} count={members.length} dense />
        <span className={`text-xl font-semibold leading-6 tabular-nums ${empty ? "text-muted" : "text-foreground"}`}>{fmtPct(pct)}</span>
        {showBenchmark && (
          <TrendChip size="sm" trend={trendOf(pct, benchmark)}>{fmtDelta(pct, benchmark)}</TrendChip>
        )}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onOpen(category)}
      aria-label={`${category.label}: ${members.length} medewerkers, open lijst`}
      className={[
        "bg-surface border-border flex w-full flex-col items-start gap-4 rounded-xl border p-5 text-left transition-colors",
        "hover:ring-2 hover:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        empty ? "opacity-60" : "",
        compact ? "p-3 gap-2" : "",
      ].join(" ")}
    >
      <TileTitle category={category} count={members.length} />
      <div className="flex items-center gap-2">
        <span className={`text-foreground font-semibold tabular-nums ${empty ? "text-muted" : ""} ${compact ? "text-xl" : "text-2xl"}`}>{fmtPct(pct)}</span>
        {showBenchmark && (
          <Tooltip delay={200}>
            <Tooltip.Trigger>
              <span className="inline-flex">
                <TrendChip size="sm" trend={trendOf(pct, benchmark)}>
                  {fmtDelta(pct, benchmark)}
                  <TrendChip.Suffix className="text-current! opacity-75">bm {fmtPct(benchmark, 1)}</TrendChip.Suffix>
                </TrendChip>
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content showArrow>
              Ten opzichte van de benchmark ({fmtPct(benchmark, 1)})
            </Tooltip.Content>
          </Tooltip>
        )}
      </div>
      <MemberAvatars members={members} size="sm" compact />
    </button>
  );
}
