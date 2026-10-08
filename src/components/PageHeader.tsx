import { ArrowDownToLine } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { Segment } from "@heroui-pro/react";

export type View = "grid" | "table";

interface Props {
  title: string;
  subtitle: string;
  view: View;
  onViewChange: (v: View) => void;
  onExport?: () => void;
}

export function PageHeader({ title, subtitle, view, onViewChange, onExport }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted mt-1 text-base">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <Segment selectedKey={view} onSelectionChange={(k) => onViewChange(k as View)} aria-label="Weergave">
          <Segment.Item id="grid">Grid</Segment.Item>
          <Segment.Item id="table">Tabel</Segment.Item>
        </Segment>
        {onExport && (
          <Button variant="secondary" onPress={onExport}>
            <ArrowDownToLine />
            Exporteren (xlsx)
          </Button>
        )}
      </div>
    </header>
  );
}
