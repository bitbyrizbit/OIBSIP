"use client";

import { useState, FormEvent } from "react";

interface ComposerProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function Composer({ onSend, disabled }: ComposerProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSend(trimmed);
      setValue("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-hairline bg-background px-8 py-5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="say something down the line..."
        disabled={disabled}
        className="flex-1 rounded-md border border-hairline bg-surface px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent-gold"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-background transition-opacity duration-300 hover:opacity-90 disabled:opacity-40"
      >
        ring
      </button>
    </form>
  );
}