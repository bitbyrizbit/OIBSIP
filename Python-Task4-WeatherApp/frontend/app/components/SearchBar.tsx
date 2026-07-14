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
    <form onSubmit={handleSubmit} className="relative pb-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          log a location
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="a city, anywhere"
          disabled={disabled}
          suppressHydrationWarning
          className="flex-1 bg-transparent font-sans text-lg text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
        <motion.button
          type="submit"
          disabled={disabled}
          whileTap={{ scale: 0.94 }}
          className="font-mono text-xs uppercase tracking-widest text-accent-brass transition-colors duration-300 hover:text-text-primary disabled:opacity-40"
        >
          read
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-hairline" />
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-accent-brass"
        initial={{ width: "0%" }}
        animate={{ width: focused ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </form>
  );
}