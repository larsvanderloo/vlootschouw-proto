import { useMemo, useState } from "react";
import { Avatar, Chip, Pagination } from "@heroui/react";
import { DataGrid, type DataGridColumn } from "@heroui-pro/react";
import { CATEGORY_BY_KEY, POTENTIAL_LABELS, categorize, fmtDate, fmtScore, initials, type Employee } from "../data/vlootschouw";

interface Props {
  rows: Employee[];
  onRowAction: (e: Employee) => void;
  pageSize?: number;
}

type Row = Employee & { categoryLabel: string; tint: "none" | "success" | "danger" | "low" };

const CHIP_COLOR = { none: "default", success: "success", danger: "danger", low: "warning" } as const;

export function VlootschouwTable({ rows, onRowAction, pageSize = 15 }: Props) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ column: string | number; direction: "ascending" | "descending" }>({ column: "name", direction: "ascending" });

  const data: Row[] = useMemo(
    () =>
      rows.map((e) => {
        const k = categorize(e);
        return { ...e, categoryLabel: k ? CATEGORY_BY_KEY[k].label : "Plaatsing heroverwegen", tint: k ? CATEGORY_BY_KEY[k].tint : "low" };
      }),
    [rows],
  );

  const sorted = useMemo(() => {
    const col = String(sort.column) as keyof Row;
    const dir = sort.direction === "ascending" ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = a[col], bv = b[col];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv), "nl") * dir;
    });
  }, [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const slice = sorted.slice((current - 1) * pageSize, current * pageSize);

  const columns: DataGridColumn<Row>[] = [
    {
      id: "name", header: "Medewerker", accessorKey: "name", isRowHeader: true, allowsSorting: true,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <Avatar.Image alt={r.name} src={r.avatar} />
            <Avatar.Fallback>{initials(r.name)}</Avatar.Fallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-medium">{r.name}</span>
            <span className="text-muted text-xs">{r.position}</span>
            <span className="flex flex-wrap gap-1 md:hidden">
              <Chip size="sm" variant="soft" color={CHIP_COLOR[r.tint]} className="whitespace-nowrap">{r.categoryLabel}</Chip>
              <Chip size="sm" variant="soft" color="accent" className="whitespace-nowrap">{POTENTIAL_LABELS[r.potential]}</Chip>
            </span>
          </div>
        </div>
      ),
    },
    { id: "department", header: "Afdeling", accessorKey: "department", allowsSorting: true, width: 120, headerClassName: "w-32 max-md:hidden", cellClassName: "max-md:hidden" },
    { id: "date", header: "Datum", accessorKey: "date", allowsSorting: true, width: 120, cell: (r) => fmtDate(r.date), headerClassName: "w-32 max-md:hidden", cellClassName: "max-md:hidden" },
    { id: "performance", header: <><span className="md:hidden">Prest.</span><span className="max-md:hidden">Prestatie</span></>, accessorKey: "performance", allowsSorting: true, align: "end", width: 72, headerClassName: "w-24", cell: (r) => fmtScore(r.performance) },
    { id: "potential", header: "Potentieel", accessorKey: "potential", allowsSorting: true, width: 176, headerClassName: "w-44 max-md:hidden", sortFn: (a, b) => a.potential - b.potential, cell: (r) => <span className="whitespace-nowrap">{POTENTIAL_LABELS[r.potential]}</span>, cellClassName: "max-md:hidden" },
    {
      id: "categoryLabel", header: "Vak", accessorKey: "categoryLabel", allowsSorting: true, width: 300, headerClassName: "w-60 max-md:hidden", cellClassName: "max-md:hidden",
      cell: (r) => <Chip size="sm" variant="soft" color={CHIP_COLOR[r.tint]} className="whitespace-nowrap">{r.categoryLabel}</Chip>,
    },
  ];

  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, sorted.length);

  return (
    <DataGrid
      aria-label="Vlootschouw tabel"
      contentClassName="table-fixed"
      className="[&_td]:h-16 [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap"
      columns={columns}
      data={slice}
      getRowId={(r) => r.id}
      sortDescriptor={sort}
      onSortChange={(d) => { setSort(d as typeof sort); setPage(1); }}
      onRowAction={(key) => { const e = rows.find((r) => r.id === key); if (e) onRowAction(e); }}
      footerClassName="justify-between"
      footer={
        <Pagination className="w-full justify-between">
          <Pagination.Summary>Toon {from}–{to} van {sorted.length} medewerkers</Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous isDisabled={current === 1} onPress={() => setPage((p) => p - 1)}>
                <Pagination.PreviousIcon />
                <span>Vorige</span>
              </Pagination.Previous>
            </Pagination.Item>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Pagination.Item key={p}>
                <Pagination.Link isActive={p === current} onPress={() => setPage(p)}>{p}</Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next isDisabled={current === totalPages} onPress={() => setPage((p) => p + 1)}>
                <span>Volgende</span>
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      }
    />
  );
}
