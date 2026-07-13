"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSearch(trimmed);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-hairline pb-3">
      <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
        log a location
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="a city, anywhere"
        disabled={disabled}
        className="flex-1 bg-transparent font-sans text-lg text-text-primary placeholder:text-text-tertiary focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled}
        className="font-mono text-xs uppercase tracking-widest text-accent-brass transition-colors duration-300 hover:text-text-primary disabled:opacity-40"
      >
        read
      </button>
    </form>
  );
}