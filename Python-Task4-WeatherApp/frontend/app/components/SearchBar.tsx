"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSearch(trimmed);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative pb-3 group w-full max-w-sm">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-brass whitespace-nowrap">
          Read Location
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter city..."
          disabled={disabled}
          suppressHydrationWarning
          className="flex-1 bg-transparent font-display italic text-2xl text-text-primary placeholder:text-text-tertiary focus:outline-none transition-all duration-700"
        />
        <motion.button
          suppressHydrationWarning
          type="submit"
          disabled={disabled}
          whileHover={{ scale: 1.2, x: 3 }}
          whileTap={{ scale: 0.9 }}
          className="font-mono text-lg text-accent-brass hover:opacity-80 disabled:opacity-30 transition-opacity"
        >
          →
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-white/5" />
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-accent-brass"
        initial={{ width: "0%", left: "50%", x: "-50%" }}
        animate={{ width: focused ? "100%" : "0%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </form>
  );
}