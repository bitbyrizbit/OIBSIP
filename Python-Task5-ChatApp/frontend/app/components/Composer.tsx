"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";

interface ComposerProps {
  onSend: (content: string) => void;
  onTyping: () => void;
  disabled?: boolean;
}

export default function Composer({ onSend, onTyping, disabled }: ComposerProps) {
  const [value, setValue] = useState("");
  const lastTypingSentRef = useRef(0);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    const now = Date.now();
    if (now - lastTypingSentRef.current > 1500) {
      onTyping();
      lastTypingSentRef.current = now;
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSend(trimmed);
      setValue("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-6 hairline-t bg-background px-12 py-6">
      <div className="font-mono text-xs text-ink-secondary">
        [ INPUT ]
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Draft your transmission..."
        disabled={disabled}
        className="flex-1 bg-transparent font-display text-2xl italic text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-0 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="group relative font-mono text-xs tracking-[0.2em] text-ink transition-colors disabled:opacity-30"
      >
        <span className="relative z-10">transmit</span>
        {/* Austere underline hover effect */}
        <span className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
      </button>
    </form>
  );
}