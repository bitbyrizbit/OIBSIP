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
    <div className="bg-surface p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-20 relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-6 bg-background rounded-sm shadow-inner hairline-t hairline-b hairline-l hairline-r border-hairline-dark px-8 py-5">
        <div className="font-sans text-[10px] tracking-[0.2em] text-ink-tertiary uppercase">
          Transmission
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter message..."
          disabled={disabled}
          className="flex-1 bg-transparent font-display text-2xl italic text-ink placeholder:text-ink-tertiary/50 focus:outline-none focus:ring-0 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className="group relative px-6 py-2 bg-surface hairline-t hairline-b hairline-l hairline-r border-hairline-dark rounded-[1px] font-sans text-xs tracking-[0.2em] uppercase text-accent-copper transition-all hover:bg-surface-raised hover:text-ink hover:shadow-lg disabled:opacity-30 active:scale-95"
        >
          <span className="relative z-10 drop-shadow-sm">Send</span>
        </button>
      </form>
    </div>
  );
}