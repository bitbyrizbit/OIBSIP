"use client";

import { motion } from "framer-motion";
import type { Unit } from "../lib/types";

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="relative flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
      <ToggleButton label="c" active={unit === "celsius"} onClick={() => onChange("celsius")} />
      <ToggleButton label="f" active={unit === "fahrenheit"} onClick={() => onChange("fahrenheit")} />
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
    <button onClick={onClick} className="relative px-2 py-1">
      {active && (
        <motion.div
          layoutId="unit-indicator"
          className="absolute inset-0 rounded-sm bg-surface-raised"
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <span className={`relative transition-colors duration-300 ${active ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}>
        {label}
      </span>
    </button>
  );
}