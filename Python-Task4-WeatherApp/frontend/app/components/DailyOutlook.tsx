"use client";

import { motion } from "framer-motion";
import type { DailyForecastEntry, Unit } from "../lib/types";
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
    <section className="px-8 py-8 md:px-16 md:py-12 border-t border-hairline">
      <Reveal>
        <h2 className="font-display italic text-2xl font-light text-accent-brass tracking-tight">
          Extended Outlook
        </h2>
      </Reveal>

      <div className="mt-10 flex flex-col max-w-4xl">
        {days.map((day, i) => {
          const min = unit === "celsius" ? day.temp_min_celsius : day.temp_min_fahrenheit;
          const max = unit === "celsius" ? day.temp_max_celsius : day.temp_max_fahrenheit;
          const leftPct = ((min - weekMin) / range) * 100;
          const widthPct = ((max - min) / range) * 100;

          return (
            <Reveal key={day.date} delay={0.06 * i}>
              <motion.div
                className="grid grid-cols-[6rem_1fr_5rem] md:grid-cols-[9rem_1fr_7rem] items-center gap-8 py-4 border-b border-hairline last:border-b-0"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Day + condition */}
                <div>
                  <p className="font-display italic text-xl font-light text-text-primary leading-tight">{day.day_label}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-brass">
                    {day.condition}
                  </p>
                </div>

                {/* Range bar */}
                <div className="relative h-[2px] w-full bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 h-full rounded-full bg-accent-brass"
                    initial={{ width: "0%", left: `${leftPct}%` }}
                    animate={{ width: `${Math.max(widthPct, 5)}%`, left: `${leftPct}%` }}
                    transition={{ duration: 1.2, delay: 0.1 + 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Temps */}
                <div className="flex flex-col items-end">
                  <span className="font-display italic text-xl font-light text-text-primary">{max.toFixed(0)}°</span>
                  <span className="font-mono text-[10px] text-accent-brass opacity-50">{min.toFixed(0)}°</span>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}