import { Persons } from "@gravity-ui/icons";
import { MemberAvatars } from "./MemberAvatars";
import { fmtPct, type Category, type Employee } from "../data/vlootschouw";

interface Props {
  category: Category;
  members: Employee[];
  pct: number;
  /** Mobiele 3x3: kleine tegel zonder avatars. */
  dense?: boolean;
  onOpen: (category: Category) => void;
}

/** Tegelkleur per vak: success/danger gevuld met witte tekst, overige neutraal. */
const SURFACE: Record<
  Category["tint"],
  { tile: string; title: string; count: string; pct: string }
> = {
  none: {
    tile: "bg-surface shadow-surface",
    title: "text-foreground",
    count: "text-muted",
    pct: "text-foreground",
  },
  success: {
    tile: "bg-success-soft border border-success/40",
    title: "text-success-soft-foreground",
    count: "text-success-soft-foreground/70",
    pct: "text-success-soft-foreground",
  },
  danger: {
    tile: "bg-danger-soft border border-danger/40",
    title: "text-danger-soft-foreground",
    count: "text-danger-soft-foreground/70",
    pct: "text-danger-soft-foreground",
  },
};

export function GridTile({ category, members, pct, dense, onOpen }: Props) {
  const empty = members.length === 0;
  const c = SURFACE[category.tint];
  const label = `${category.label}: ${members.length} medewerkers, open lijst`;

  if (dense) {
    return (
      <button
        type="button"
        onClick={() => onOpen(category)}
        aria-label={label}
        className={[
          "flex min-h-[7rem] w-full flex-col items-start gap-2 rounded-2xl p-3 text-left",
          "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2",
          c.tile,
          empty ? "opacity-60" : "",
        ].join(" ")}
      >
        <span
          className={`line-clamp-2 text-xs font-medium leading-4 break-words hyphens-auto ${c.title}`}
          lang="nl"
        >
          {category.label}
        </span>
        <span
          className={`flex items-center gap-1 text-xs tabular-nums ${c.count}`}
          aria-hidden="true"
        >
          <Persons className="size-3" /> {members.length}
        </span>
        <span
          className={`mt-auto text-xl font-semibold leading-6 tabular-nums ${c.pct}`}
        >
          {fmtPct(pct)}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(category)}
      aria-label={label}
      className={[
        "flex w-full flex-col items-start gap-4 rounded-2xl p-5 text-left transition-colors",
        "hover:ring-2 hover:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        c.tile,
        empty ? "opacity-60" : "",
      ].join(" ")}
    >
      <span className="flex items-center gap-2 text-base leading-6">
        <span className={`font-medium ${c.title}`}>{category.label}</span>
        <span className={`tabular-nums ${c.count}`}>{members.length}</span>
      </span>
      <span className={`text-2xl font-semibold tabular-nums ${c.pct}`}>
        {fmtPct(pct)}
      </span>
      <MemberAvatars members={members} size="sm" compact />
    </button>
  );
}
