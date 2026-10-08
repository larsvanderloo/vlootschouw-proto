import {
  Button,
  Checkbox,
  CheckboxGroup,
  DateField,
  DateRangePicker,
  Radio,
  RadioGroup,
  RangeCalendar,
} from "@heroui/react";
import { parseDate, type DateValue } from "@internationalized/date";
import { CYCLE_OPTIONS, DEPARTMENTS } from "../data/vlootschouw";

export interface FilterState {
  departments: string[];
  cycle: string | null;
  range: { start: DateValue; end: DateValue } | null;
}

export const DEFAULT_FILTERS: FilterState = {
  departments: [],
  cycle: null,
  range: { start: parseDate("2025-01-01"), end: parseDate("2026-10-08") },
};

export function activeFilterCount(f: FilterState): number {
  return (f.departments.length ? 1 : 0) + (f.cycle ? 1 : 0);
}

interface Props {
  value: FilterState;
  onChange: (v: FilterState) => void;
  /** Zonder eigen kaart-surface, voor gebruik in een sheet. */
  bare?: boolean;
  showBenchmark: boolean;
  onToggleBenchmark: (v: boolean) => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted text-sm">{title}</span>
      {children}
    </div>
  );
}

/** Filterpaneel: desktop als zijbalk-kaart, mobiel in een sheet. */
export function Filters({
  value,
  onChange,
  bare = false,
  showBenchmark,
  onToggleBenchmark,
}: Props) {
  const body = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Filters</h2>
        <Button
          size="sm"
          variant="ghost"
          className="text-accent"
          onPress={() => onChange(DEFAULT_FILTERS)}
        >
          Resetten
        </Button>
      </div>

      <Section title="Opties">
        <Checkbox
          isSelected={showBenchmark}
          onChange={onToggleBenchmark}
          variant="secondary"
        >
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            Benchmark tonen
          </Checkbox.Content>
        </Checkbox>
      </Section>

      <Section title="Periode">
        <DateRangePicker
          aria-label="Periode"
          value={value.range}
          onChange={(range) => onChange({ ...value, range })}
        >
          <DateField.Group fullWidth>
            <DateField.Input slot="start">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateRangePicker.RangeSeparator />
            <DateField.Input slot="end">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DateRangePicker.Trigger>
                <DateRangePicker.TriggerIndicator />
              </DateRangePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DateRangePicker.Popover>
            <RangeCalendar aria-label="Periode">
              <RangeCalendar.Header>
                <RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.YearPickerTriggerHeading />
                  <RangeCalendar.YearPickerTriggerIndicator />
                </RangeCalendar.YearPickerTrigger>
                <RangeCalendar.NavButton slot="previous" />
                <RangeCalendar.NavButton slot="next" />
              </RangeCalendar.Header>
              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => (
                    <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                  )}
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
              <RangeCalendar.YearPickerGrid>
                <RangeCalendar.YearPickerGridBody>
                  {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                </RangeCalendar.YearPickerGridBody>
              </RangeCalendar.YearPickerGrid>
            </RangeCalendar>
          </DateRangePicker.Popover>
        </DateRangePicker>
      </Section>

      <Section title="Afdeling">
        <CheckboxGroup
          aria-label="Afdeling"
          variant="secondary"
          value={value.departments}
          onChange={(departments) => onChange({ ...value, departments })}
        >
          {DEPARTMENTS.map((d) => (
            <Checkbox key={d} value={d}>
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                {d}
              </Checkbox.Content>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Section>

      <Section title="Cyclus">
        <RadioGroup
          aria-label="Cyclus"
          variant="secondary"
          value={value.cycle ?? "latest"}
          onChange={(v) =>
            onChange({ ...value, cycle: v === "latest" ? null : v })
          }
        >
          {[
            { id: "latest", label: "Laatste beoordeling" },
            ...CYCLE_OPTIONS.map((c) => ({ id: c, label: c })),
          ].map((o) => (
            <Radio key={o.id} value={o.id}>
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                {o.label}
              </Radio.Content>
            </Radio>
          ))}
        </RadioGroup>
      </Section>
    </div>
  );

  if (bare) return body;
  return (
    <aside className="bg-surface shadow-surface rounded-2xl p-6">
      {body}
    </aside>
  );
}
