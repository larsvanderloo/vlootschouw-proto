import { Avatar, AvatarGroup, Chip } from "@heroui/react";
import { HoverCard } from "@heroui-pro/react";
import { fmtDate, fmtScore, initials, type Employee } from "../data/vlootschouw";

interface Props {
  members: Employee[];
  max?: number;
  size?: "sm" | "md";
}

/** Avatar-rij met HoverCard per medewerker (naam, functie, beoordeling). */
export function MemberAvatars({ members, max = 6, size = "md" }: Props) {
  if (members.length === 0) return null;
  const visible = members.slice(0, max);
  const rest = members.length - visible.length;
  return (
    <AvatarGroup size={size} role="group" aria-label={`${members.length} medewerkers`}>
      {visible.map((m) => (
        <HoverCard key={m.id} openDelay={150} closeDelay={100}>
          <HoverCard.Trigger>
            <Avatar size={size} className="cursor-default ring-2 ring-surface">
              <Avatar.Image alt={m.name} src={m.avatar} />
              <Avatar.Fallback>{initials(m.name)}</Avatar.Fallback>
            </Avatar>
          </HoverCard.Trigger>
          <HoverCard.Content placement="top" className="w-72">
            <HoverCard.Arrow />
            <div className="flex items-center gap-3">
              <Avatar size="md">
                <Avatar.Image alt={m.name} src={m.avatar} />
                <Avatar.Fallback>{initials(m.name)}</Avatar.Fallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">{m.name}</span>
                <span className="text-muted truncate text-sm">{m.position} · {m.department}</span>
              </div>
            </div>
            <p className="text-muted mt-3 text-xs">Beoordeeld {fmtDate(m.date)} · {m.cycle}</p>
            <div className="mt-2 flex gap-2">
              <Chip size="sm" variant="soft">Prestatie {fmtScore(m.performance)}</Chip>
              <Chip size="sm" variant="soft" color="accent">Potentieel {m.potential}</Chip>
            </div>
          </HoverCard.Content>
        </HoverCard>
      ))}
      {rest > 0 && <AvatarGroup.Count size={size}>+{rest}</AvatarGroup.Count>}
    </AvatarGroup>
  );
}
