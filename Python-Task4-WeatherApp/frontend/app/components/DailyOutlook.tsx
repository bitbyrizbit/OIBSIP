import type { DailyForecastEntry, Unit } from "../lib/types";
import { isStormCondition } from "../lib/copy";
import Reveal from "./Reveal";

interface DailyOutlookProps {
  days: DailyForecastEntry[];
  unit: Unit;
}

export default function DailyOutlook({ days, unit }: DailyOutlookProps) {
  if (days.length === 0) return null;

  const mins = days.map((d) => (unit === "celsius" ? d.temp_min_celsius : d.temp_min_fahrenheit));
  const maxs = days.map((d) => (unit === "celsius" ? d.temp_max_celsius : d.temp_max_fahrenheit));
  const weekMin = Math.min(...mins);
  const weekMax = Math.max(...maxs);
  const range = weekMax - weekMin || 1;

  return (
    <section className="px-8 py-12 md:px-16 md:py-16">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          the week ahead
        </p>
      </Reveal>

      <div className="mt-8 flex flex-col">
        {days.map((day, i) => {
          const min = unit === "celsius" ? day.temp_min_celsius : day.temp_min_fahrenheit;
          const max = unit === "celsius" ? day.temp_max_celsius : day.temp_max_fahrenheit;
          const leftPct = ((min - weekMin) / range) * 100;
          const widthPct = ((max - min) / range) * 100;
          const accentClass = isStormCondition(day.condition) ? "bg-accent-storm" : "bg-accent-brass";

          return (
            <Reveal key={day.date} delay={0.08 * i}>
              <div className="grid grid-cols-[6rem_1fr_7rem] items-center gap-4 border-t border-hairline py-4 last:border-b md:grid-cols-[8rem_1fr_9rem]">
                <div>
                  <p className="font-sans text-sm text-text-primary">{day.day_label}</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                    {day.condition}
                  </p>
                </div>

                <div className="relative h-1 rounded-full bg-hairline">
                  <div
                    className={`absolute h-1 rounded-full ${accentClass}`}
                    style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 4)}%` }}
                  />
                </div>

                <div className="flex items-baseline justify-end gap-2 font-mono text-sm">
                  <span className="text-text-secondary">{min.toFixed(0)}</span>
                  <span className="text-text-tertiary">-</span>
                  <span className="text-text-primary">{max.toFixed(0)}</span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}