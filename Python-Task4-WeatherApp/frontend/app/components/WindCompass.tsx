"use client";

import { motion } from "framer-motion";

interface WindCompassProps {
  directionDeg: number;
  speed: number;
  unit: string;
}

export default function WindCompass({ directionDeg, speed, unit }: WindCompassProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#262420"
            strokeWidth="1"
          />
          <text x="50" y="12" textAnchor="middle" className="fill-text-tertiary" fontSize="7" fontFamily="var(--font-mono)">
            N
          </text>
          <text x="50" y="94" textAnchor="middle" className="fill-text-tertiary" fontSize="7" fontFamily="var(--font-mono)">
            S
          </text>
          <text x="8" y="53" textAnchor="middle" className="fill-text-tertiary" fontSize="7" fontFamily="var(--font-mono)">
            W
          </text>
          <text x="92" y="53" textAnchor="middle" className="fill-text-tertiary" fontSize="7" fontFamily="var(--font-mono)">
            E
          </text>
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: directionDeg }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "50px 50px" }}
          >
            <line x1="50" y1="50" x2="50" y2="18" stroke="#B8834A" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="18" r="3" fill="#B8834A" />
          </motion.g>
          <circle cx="50" cy="50" r="2.5" fill="#5C594F" />
        </svg>
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">wind</p>
        <p className="mt-1 font-mono text-xl text-text-primary">
          {speed.toFixed(1)} {unit}
        </p>
        <p className="font-mono text-xs text-text-tertiary">{directionDeg} deg</p>
      </div>
    </div>
  );
}