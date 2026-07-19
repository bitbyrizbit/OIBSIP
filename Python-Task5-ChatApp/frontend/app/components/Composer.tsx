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
    <div className="absolute bottom-0 left-[25%] right-0 z-50 bg-ink-alabaster border-t-8 border-accent-vermilion">
      <form onSubmit={handleSubmit} className="flex items-stretch">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="TYPE HERE..."
          disabled={disabled}
          className="flex-1 bg-transparent px-12 py-8 font-sans text-5xl font-black uppercase tracking-tighter text-canvas-blue placeholder:text-canvas-blue/30 focus:outline-none focus:ring-0 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-canvas-blue px-16 flex items-center justify-center font-sans text-4xl font-black uppercase tracking-tighter text-ink-alabaster hover:bg-accent-vermilion transition-colors disabled:opacity-30"
        >
          Execute
        </button>
      </form>
    </div>
  );
}