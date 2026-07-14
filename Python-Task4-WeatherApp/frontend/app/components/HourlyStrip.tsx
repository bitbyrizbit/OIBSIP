import type { HourlyForecastEntry, Unit } from "../lib/types";
import { isStormCondition } from "../lib/copy";
import Reveal from "./Reveal";

interface HourlyStripProps {
  hours: HourlyForecastEntry[];
  unit: Unit;
}

export default function HourlyStrip({ hours, unit }: HourlyStripProps) {
  if (hours.length === 0) return null;

  return (
    <section className="px-8 py-8 md:px-16">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          next hours
        </p>
      </Reveal>

      <div className="mt-6 flex gap-12">
        {hours.map((hour, i) => {
          const temp = unit === "celsius" ? hour.temperature_celsius : hour.temperature_fahrenheit;
          const accentClass = isStormCondition(hour.condition) ? "text-accent-storm" : "text-accent-brass";

          return (
            <Reveal key={hour.timestamp} delay={0.1 + 0.08 * i}>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  {hour.time_label}
                </p>
                <p className="mt-2 font-display text-3xl font-light text-text-primary">
                  {temp.toFixed(0)}
                </p>
                <p className={`mt-1 font-mono text-xs uppercase tracking-widest ${accentClass}`}>
                  {hour.condition}
                  {hour.precipitation_probability > 0 && (
                    <span className="text-text-tertiary"> - {hour.precipitation_probability}% rain</span>
                  )}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}