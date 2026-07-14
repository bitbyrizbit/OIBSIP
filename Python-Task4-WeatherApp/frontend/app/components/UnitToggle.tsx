"use client";

import { motion } from "framer-motion";
import type { Unit } from "../lib/types";

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="relative flex items-center gap-1 font-mono text-xs uppercase tracking-widest bg-white/5 rounded-full p-1 backdrop-blur-md">
      <ToggleButton label="C" active={unit === "celsius"} onClick={() => onChange("celsius")} />
      <ToggleButton label="F" active={unit === "fahrenheit"} onClick={() => onChange("fahrenheit")} />
    </div>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick} 
      className="relative px-4 py-2 rounded-full outline-none"
    >
      {active && (
        <motion.div
          layoutId="unit-indicator-pill"
          className="absolute inset-0 rounded-full bg-surface-raised border border-white/10"
          transition={{ duration: 0.6, type: "spring", bounce: 0.15 }}
        />
      )}
      <span className={`relative transition-colors duration-500 z-10 ${active ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}>
        °{label}
      </span>
    </button>
  );
}