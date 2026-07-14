"use client";

import { motion } from "framer-motion";

interface WindCompassProps {
  directionDeg: number;
  speed: number;
  unit: string;
}

function degreeToCardinal(deg: number) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function WindCompass({ directionDeg, speed, unit }: WindCompassProps) {
  const cardinal = degreeToCardinal(directionDeg);

  return (
    <motion.div
      className="flex items-start gap-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Clean compass dial */}
      <div className="relative h-24 w-24 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Single outer ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#2A2620" strokeWidth="1.5" />

          {/* 8 subtle tick marks at 45° intervals */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = i * 45;
            const rad = (angle - 90) * (Math.PI / 180);
            const isMajor = angle % 90 === 0;
            const outerR = 46;
            const innerR = isMajor ? 38 : 41;
            return (
              <line
                key={i}
                x1={50 + Math.cos(rad) * outerR}
                y1={50 + Math.sin(rad) * outerR}
                x2={50 + Math.cos(rad) * innerR}
                y2={50 + Math.sin(rad) * innerR}
                stroke="#D4A373"
                strokeWidth={isMajor ? 1 : 0.5}
                opacity={isMajor ? 0.9 : 0.4}
              />
            );
          })}

          {/* Cardinal letters */}
          {[
            { label: "N", x: 50, y: 14 },
            { label: "S", x: 50, y: 90 },
            { label: "E", x: 88, y: 53 },
            { label: "W", x: 12, y: 53 },
          ].map(({ label, x, y }) => (
            <text
              key={label}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontFamily="var(--font-fraunces)"
              fontStyle="italic"
              fill="#D4A373"
              opacity="0.85"
            >
              {label}
            </text>
          ))}

          {/* Animated needle */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: directionDeg }}
            transition={{ duration: 2, type: "spring", stiffness: 50, damping: 18 }}
            style={{ transformOrigin: "50px 50px" }}
          >
            {/* Arrow tip */}
            <line x1="50" y1="50" x2="50" y2="16" stroke="#D4A373" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="50,10 47,20 53,20" fill="#D4A373" />
            {/* Blunt tail */}
            <line x1="50" y1="50" x2="50" y2="72" stroke="#D4A373" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
          </motion.g>

          {/* Center pivot */}
          <circle cx="50" cy="50" r="3" fill="#1B1916" stroke="#D4A373" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="1.2" fill="#D4A373" />
        </svg>
      </div>

      {/* Wind data */}
      <div className="flex flex-col gap-4 pt-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-brass">Wind</p>
          <p className="mt-1.5 font-display italic text-3xl font-light text-text-primary">
            {speed.toFixed(1)} <span className="text-sm text-accent-brass opacity-60">{unit}</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-brass">Bearing</p>
          <p className="mt-1.5 font-display italic text-3xl font-light text-text-primary">
            {cardinal} <span className="text-sm text-accent-brass opacity-60">{directionDeg}°</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}