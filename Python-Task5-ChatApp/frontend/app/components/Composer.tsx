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
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "40px 10vw",
      background: "linear-gradient(to top, rgba(20, 17, 15, 1) 40%, rgba(20, 17, 15, 0))",
      zIndex: 10
    }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
        <div style={{ width: "180px", flexShrink: 0, textAlign: "right" }}>
          <label style={{ fontFamily: "var(--font-work-sans)", fontSize: "1rem", color: "rgba(242, 234, 216, 0.4)" }}>
            Your voice
          </label>
        </div>
        
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Speak into the receiver..."
          disabled={disabled}
          style={{
            flex: 1, background: "transparent", border: "none", borderBottom: "1px solid rgba(242, 234, 216, 0.2)",
            color: "#F2EAD8", fontSize: "1.75rem", fontFamily: "var(--font-newsreader)", fontStyle: "italic",
            padding: "8px 0", outline: "none", caretColor: "#C9724A"
          }}
        />

        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: "var(--font-work-sans)", fontSize: "1rem", color: value.trim().length > 0 ? "#C9724A" : "rgba(242, 234, 216, 0.2)",
            transition: "color 0.2s"
          }}
        >
          Speak
        </button>
      </form>
    </div>
  );
}