"use client";

import type { Unit } from "../lib/types";

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
      <button
        onClick={() => onChange("celsius")}
        className={`transition-colors duration-300 ${
          unit === "celsius" ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        c
      </button>
      <span className="text-text-tertiary">/</span>
      <button
        onClick={() => onChange("fahrenheit")}
        className={`transition-colors duration-300 ${
          unit === "fahrenheit" ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        f
      </button>
    </div>
  );
}