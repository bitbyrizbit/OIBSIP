"use client";

import { motion } from "framer-motion";

interface WaveformProps {
  amplitude: number;
  active: boolean;
  speaking: boolean;
}

export default function Waveform({ amplitude, active, speaking }: WaveformProps) {
  const barCount = 40;
  const bars = Array.from({ length: barCount });

  return (
    <div className="flex h-40 items-center justify-center gap-1">
      {bars.map((_, i) => {
        const distanceFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const falloff = 1 - distanceFromCenter * 0.6;
        const baseHeight = active ? amplitude * falloff : speaking ? 0.3 + Math.sin(i) * 0.15 : 0.05;
        const height = Math.max(baseHeight * 100, 4);

        return (
          <motion.div
            key={i}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className={`w-1 rounded-full ${
              active || speaking ? "bg-accent-signal" : "bg-hairline"
            }`}
          />
        );
      })}
    </div>
  );
}