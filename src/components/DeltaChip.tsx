import { ArrowDown, ArrowUp, Minus } from "@gravity-ui/icons";
import { TrendChip } from "@heroui-pro/react";
import { fmtDelta } from "../data/vlootschouw";

interface Props {
  own: number;
  benchmark: number;
  /** Voor groepen waar een lager aandeel juist goed is (onderpresteerders, plaatsing heroverwegen). */
  lowerIsBetter?: boolean;
  className?: string;
}

/** Kleur = goed/slecht ten opzichte van de benchmark, pijl = richting van het verschil. */
export function DeltaChip({ own, benchmark, lowerIsBetter = false, className }: Props) {
  const diff = own - benchmark;
  const flat = Math.abs(diff) < 0.05;
  const good = lowerIsBetter ? diff < 0 : diff > 0;
  const trend = flat ? "neutral" : good ? "up" : "down";
  const Icon = flat ? Minus : diff > 0 ? ArrowUp : ArrowDown;
  return (
    <TrendChip size="sm" trend={trend} className={className}>
      <TrendChip.Indicator>
        <Icon />
      </TrendChip.Indicator>
      {fmtDelta(own, benchmark)}
    </TrendChip>
  );
}
