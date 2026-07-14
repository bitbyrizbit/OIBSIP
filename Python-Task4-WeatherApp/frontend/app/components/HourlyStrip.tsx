"use client";

import { motion } from "framer-motion";
import type { HourlyForecastEntry, Unit } from "../lib/types";
import Reveal from "./Reveal";

interface HourlyStripProps {
  hours: HourlyForecastEntry[];
  unit: Unit;
}

export default function HourlyStrip({ hours, unit }: HourlyStripProps) {
  if (hours.length === 0) return null;

  return (
    <section className="px-8 py-8 md:px-16 md:py-12 border-t border-hairline">
      <Reveal>
        <h2 className="font-display italic text-2xl font-light text-accent-brass tracking-tight">
          Imminent Forecast
        </h2>
      </Reveal>

      <div className="mt-10 flex gap-10 overflow-x-auto pb-4 hide-scrollbar">
        {hours.map((hour, i) => {
          const temp = unit === "celsius" ? hour.temperature_celsius : hour.temperature_fahrenheit;
          // Scale: 0–50°C or 32–120°F → 0–100%
          const barHeight = unit === "celsius"
            ? Math.min(100, Math.max(8, (temp / 50) * 100))
            : Math.min(100, Math.max(8, ((temp - 32) / 88) * 100));

          return (
            <Reveal key={hour.timestamp} delay={0.04 * i} className="shrink-0">
              <motion.div
                className="flex flex-col items-center cursor-default"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Time label */}
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-5 text-accent-brass">
                  {hour.time_label}
                </p>

                {/* Bar */}
                <div className="h-20 w-[3px] bg-white/8 relative rounded-full overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 w-full rounded-full bg-accent-brass"
                    initial={{ height: "0%" }}
                    animate={{ height: `${barHeight}%` }}
                    transition={{ duration: 1, delay: 0.1 + 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Temperature */}
                <p className="mt-5 font-display italic text-3xl font-light text-text-primary">
                  {temp.toFixed(0)}°
                </p>

                {/* Condition */}
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-brass">
                  {hour.condition}
                </p>

                {/* Precipitation */}
                {hour.precipitation_probability > 0 && (
                  <p className="mt-1 font-mono text-[10px] text-accent-brass opacity-50">
                    {hour.precipitation_probability}%
                  </p>
                )}
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}