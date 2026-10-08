import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { Sheet } from "@heroui-pro/react";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { PageHeader, type View } from "../components/PageHeader";
import {
  Filters,
  DEFAULT_FILTERS,
  activeFilterCount,
  type FilterState,
} from "../components/Filters";
import { VlootschouwGrid } from "../components/VlootschouwGrid";
import { BenchmarkCard } from "../components/BenchmarkCard";
import { MemberSheet, type SheetTarget } from "../components/MemberSheet";
import { VlootschouwTable } from "../components/VlootschouwTable";
import {
  BENCHMARK_META,
  CATEGORY_BY_KEY,
  EMPLOYEES,
  TEAM_MANAGER_ID,
  computeShares,
  type Category,
  type CategoryKey,
  type Employee,
} from "../data/vlootschouw";

const PARAMS = new URLSearchParams(location.search);

interface Props {
  role: "admin" | "manager";
}

/** Eén pagina voor beide rollen: HR ziet alles met filters, de leidinggevende alleen het eigen team. */
export function VlootschouwPage({ role }: Props) {
  const [view, setView] = useState<View>(
    PARAMS.get("view") === "table" ? "table" : "grid",
  );
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [open, setOpen] = useState<SheetTarget | null>(null);
  const [sheetMembers, setSheetMembers] = useState<Employee[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(
    PARAMS.get("filters") !== "0" &&
      window.matchMedia("(min-width: 1024px)").matches,
  );
  const isDesktop = useIsDesktop();

  const rows = useMemo(() => {
    let list =
      role === "manager"
        ? EMPLOYEES.filter((e) => e.managerId === TEAM_MANAGER_ID)
        : EMPLOYEES;
    if (role === "admin") {
      if (filters.departments.length)
        list = list.filter((e) => filters.departments.includes(e.department));
      if (filters.cycle) list = list.filter((e) => e.cycle === filters.cycle);
      if (filters.range) {
        const s = filters.range.start.toString(),
          en = filters.range.end.toString();
        list = list.filter((e) => e.date >= s && e.date <= en);
      }
    }
    return list;
  }, [role, filters]);

  const shares = useMemo(() => computeShares(rows), [rows]);

  const openCategory = (c: Category | "low") => {
    const members =
      c === "low" ? shares.lowPotential : shares.byCategory[c.key];
    setSheetMembers(members);
    setOpen({
      title: `${c === "low" ? "Plaatsing heroverwegen" : c.label} · ${members.length} ${members.length === 1 ? "medewerker" : "medewerkers"}`,
      subtitle:
        c === "low"
          ? "Potentieel 1. Deze medewerkers vallen buiten het 3×3 grid."
          : "Laatste afgeronde beoordeling per medewerker.",
    });
  };

  const openEmployee = (e: Employee) => {
    setSheetMembers([e]);
    setOpen({ title: e.name, subtitle: `${e.position} · ${e.department}` });
  };

  // deep link voor demo/screenshots: ?open=ster
  const [booted, setBooted] = useState(false);
  if (!booted) {
    setBooted(true);
    const k = PARAMS.get("open");
    if (k === "low") openCategory("low");
    else if (k && k in CATEGORY_BY_KEY)
      openCategory(CATEGORY_BY_KEY[k as CategoryKey]);
  }

  const isManager = role === "manager";
  const subtitle = isManager
    ? `Mijn team · ${rows.length} directe medewerkers, op basis van de laatste afgeronde beoordeling`
    : `Prestatie en potentieel van ${rows.length} medewerkers, op basis van de laatste afgeronde beoordeling`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vlootschouw"
        subtitle={subtitle}
        view={view}
        onViewChange={setView}
        onExport={() => alert("Export naar xlsx (demo)")}
        sidebar={
          isManager
            ? undefined
            : {
                open: filtersOpen,
                count: activeFilterCount(filters),
                onToggle: () => setFiltersOpen((o) => !o),
              }
        }
      />

      <div
        className={
          !isManager && isDesktop
            ? "grid grid-cols-[minmax(0,1fr)_300px] items-start gap-8"
            : ""
        }
      >
        <div className="flex flex-col gap-6">
          {view === "grid" ? (
            <section className="flex flex-col gap-4">
              <VlootschouwGrid
                shares={shares}
                showBenchmark={showBenchmark}
                onOpen={openCategory}
              />
              {showBenchmark && (
                <p className="text-muted text-xs">
                  Verschil ten opzichte van de Welder-benchmark (
                  {BENCHMARK_META.description.toLowerCase()}), bijgewerkt{" "}
                  {BENCHMARK_META.updated}. Groen is gunstig, rood ongunstig.
                </p>
              )}
            </section>
          ) : (
            <VlootschouwTable rows={rows} onRowAction={openEmployee} />
          )}
          {!isManager && !isDesktop && view === "grid" && <BenchmarkCard shares={shares} />}
        </div>
        {!isManager && isDesktop && (
          <div className="sticky top-6 flex flex-col gap-4">
            {filtersOpen && (
              <Filters
                value={filters}
                onChange={setFilters}
                showBenchmark={showBenchmark}
                onToggleBenchmark={setShowBenchmark}
              />
            )}
            {view === "grid" && <BenchmarkCard shares={shares} />}
          </div>
        )}
      </div>

      {!isManager && !isDesktop && (
        <Sheet
          isOpen={filtersOpen}
          placement="bottom"
          onOpenChange={setFiltersOpen}
        >
          <Sheet.Backdrop>
            <Sheet.Content className="max-h-[90vh]">
              <Sheet.Dialog>
                <Sheet.Handle />
                <Sheet.Body className="p-6">
                  <Filters
                    bare
                    value={filters}
                    onChange={setFilters}
                    showBenchmark={showBenchmark}
                    onToggleBenchmark={setShowBenchmark}
                  />
                </Sheet.Body>
                <Sheet.Footer>
                  <Sheet.Close>
                    <Button>Toepassen</Button>
                  </Sheet.Close>
                </Sheet.Footer>
              </Sheet.Dialog>
            </Sheet.Content>
          </Sheet.Backdrop>
        </Sheet>
      )}

      {isManager && (
        <p className="text-muted text-xs">
          Alleen je eigen directe medewerkers. Benchmarkpercentages komen van
          Welder en worden maandelijks ververst.
        </p>
      )}

      <MemberSheet
        target={open}
        members={sheetMembers}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}
