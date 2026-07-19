"use client";

import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent } from "react";

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
    <div
      style={{
        background: "#111318",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "16px 48px 20px",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Subtle top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "48px",
          right: "48px",
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(201,150,74,0.4), transparent)",
        }}
      />

      <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <label
          className="font-sans"
          style={{
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "#7A8A9E",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Transmit
        </label>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Write your message..."
          disabled={disabled}
          className="font-sans"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "1.1rem",
            color: "#F4F0E8",
            letterSpacing: "0.01em",
            lineHeight: 1.5,
            caretColor: "#C9964A",
            padding: "8px 0",
          }}
        />

        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className="font-sans"
          style={{
            flexShrink: 0,
            background: "transparent",
            border: "1px solid rgba(201,150,74,0.4)",
            color: "#C9964A",
            padding: "8px 22px",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
            borderRadius: "2px",
            opacity: disabled || value.trim().length === 0 ? 0.4 : 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled && value.trim().length > 0) {
              e.currentTarget.style.background = "#C9964A";
              e.currentTarget.style.color = "#0C0D11";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#C9964A";
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}