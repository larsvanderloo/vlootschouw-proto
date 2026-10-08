import { useMemo, useState } from "react";
import { Avatar, Button, Chip, Label, SearchField } from "@heroui/react";
import { ListView, Sheet } from "@heroui-pro/react";
import { fmtDate, fmtScore, initials, type Employee } from "../data/vlootschouw";
import { useIsDesktop } from "../hooks/useMediaQuery";

export interface SheetTarget { title: string; subtitle: string }

interface Props {
  target: SheetTarget | null;
  members: Employee[];
  onClose: () => void;
}

/** Rechter sheet met de medewerkers van één vak. */
export function MemberSheet({ target, members, onClose }: Props) {
  const [query, setQuery] = useState("");
  const isDesktop = useIsDesktop();
  const title = target?.title ?? "";
  const list = useMemo(
    () => members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase())),
    [members, query],
  );

  return (
    <Sheet isOpen={target !== null} placement={isDesktop ? "right" : "bottom"} onOpenChange={(open) => { if (!open) { onClose(); setQuery(""); } }}>
      <Sheet.Backdrop>
        <Sheet.Content className={isDesktop ? "w-[440px]" : "max-h-[88vh]"}>
          <Sheet.Dialog>
            {!isDesktop && <Sheet.Handle />}
            <Sheet.CloseTrigger aria-label="Sluiten" />
            <Sheet.Header>
              <Sheet.Heading>{title}</Sheet.Heading>
              <p className="text-muted text-sm">{target?.subtitle}</p>
            </Sheet.Header>
            <Sheet.Body className="flex flex-col gap-4">
              <SearchField aria-label="Zoek in dit vak" value={query} onChange={setQuery}>
                <Label className="sr-only">Zoeken</Label>
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Zoek op naam" />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
              <ListView
                aria-label={`Medewerkers in ${title}`}
                items={list}
                selectionMode="none"
                renderEmptyState={() => <p className="text-muted p-4 text-sm">Geen medewerkers gevonden.</p>}
              >
                {(m) => (
                  <ListView.Item id={m.id} textValue={m.name}>
                    <ListView.ItemContent>
                      <Avatar size="sm">
                        <Avatar.Image alt={m.name} src={m.avatar} />
                        <Avatar.Fallback>{initials(m.name)}</Avatar.Fallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <ListView.Title>{m.name}</ListView.Title>
                        <ListView.Description>
                          {m.position} · {m.department} · {fmtDate(m.date)}
                        </ListView.Description>
                      </div>
                    </ListView.ItemContent>
                    <ListView.ItemAction>
                      <Chip size="sm" variant="soft">{fmtScore(m.performance)}</Chip>
                      <Chip size="sm" variant="soft" color="accent">P{m.potential}</Chip>
                    </ListView.ItemAction>
                  </ListView.Item>
                )}
              </ListView>
            </Sheet.Body>
            <Sheet.Footer>
              <Sheet.Close>
                <Button variant="secondary">Sluiten</Button>
              </Sheet.Close>
              <Button onPress={() => alert(`Export van ${list.length} medewerkers (demo)`)}>Exporteer selectie</Button>
            </Sheet.Footer>
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  );
}
