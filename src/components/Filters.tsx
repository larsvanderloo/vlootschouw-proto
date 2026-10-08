import { DateField, DateRangePicker, Label, ListBox, RangeCalendar, Select } from "@heroui/react";
import { parseDate, type DateValue } from "@internationalized/date";
import { CYCLE_OPTIONS, DEPARTMENTS } from "../data/vlootschouw";

export interface FilterState {
  department: string | null;
  cycle: string | null;
  range: { start: DateValue; end: DateValue } | null;
}

export const DEFAULT_FILTERS: FilterState = {
  department: null,
  cycle: null,
  range: { start: parseDate("2025-01-01"), end: parseDate("2026-10-08") },
};

interface Props { value: FilterState; onChange: (v: FilterState) => void }

export function Filters({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <DateRangePicker
        className="w-[320px]"
        value={value.range}
        onChange={(range) => onChange({ ...value, range })}
      >
        <Label>Periode</Label>
        <DateField.Group fullWidth>
          <DateField.Input slot="start">{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
          <DateRangePicker.RangeSeparator />
          <DateField.Input slot="end">{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
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
              <RangeCalendar.GridHeader>{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}</RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>{(date) => <RangeCalendar.Cell date={date} />}</RangeCalendar.GridBody>
            </RangeCalendar.Grid>
            <RangeCalendar.YearPickerGrid>
              <RangeCalendar.YearPickerGridBody>{({ year }) => <RangeCalendar.YearPickerCell year={year} />}</RangeCalendar.YearPickerGridBody>
            </RangeCalendar.YearPickerGrid>
          </RangeCalendar>
        </DateRangePicker.Popover>
      </DateRangePicker>

      <Select
        className="w-[260px]"
        placeholder="Alle afdelingen"
        selectedKey={value.department ?? "all"}
        onSelectionChange={(k) => onChange({ ...value, department: k === "all" || k === null ? null : String(k) })}
      >
        <Label>Afdeling / functie</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="all" textValue="Alle afdelingen">Alle afdelingen<ListBox.ItemIndicator /></ListBox.Item>
            {DEPARTMENTS.map((d) => (
              <ListBox.Item key={d} id={d} textValue={d}>{d}<ListBox.ItemIndicator /></ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        className="w-[260px]"
        placeholder="Laatste beoordeling"
        selectedKey={value.cycle ?? "latest"}
        onSelectionChange={(k) => onChange({ ...value, cycle: k === "latest" || k === null ? null : String(k) })}
      >
        <Label>Cyclus</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="latest" textValue="Laatste beoordeling">Laatste beoordeling<ListBox.ItemIndicator /></ListBox.Item>
            {CYCLE_OPTIONS.map((c) => (
              <ListBox.Item key={c} id={c} textValue={c}>{c}<ListBox.ItemIndicator /></ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
