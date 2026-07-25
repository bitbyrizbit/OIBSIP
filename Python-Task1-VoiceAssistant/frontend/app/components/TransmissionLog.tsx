"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ConversationEntry } from "../lib/types";

// Human-readable label for each intent
const INTENT_LABELS: Record<string, string> = {
  greeting: "GREETING",
  time: "TIME",
  date: "DATE",
  weather: "WEATHER",
  web_search: "SEARCH",
  reminder: "REMINDER",
  email: "EMAIL",
  general_question: "Q&A",
  custom_command: "CUSTOM",
  stop: "STOP",
  unknown: "UNKNOWN",
};

interface TransmissionLogProps {
  entries: ConversationEntry[];
}

export default function TransmissionLog({ entries }: TransmissionLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p className="font-display" style={{ fontSize: "2rem", fontStyle: "italic", color: "rgba(240, 232, 213, 0.15)", letterSpacing: "-0.02em" }}>
            The channel is open.
          </p>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem", color: "rgba(232, 169, 75, 0.4)", marginTop: "12px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Transmit to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "48px 10vw 0" }}>
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              gap: "32px",
              padding: "20px 0",
              borderBottom: "1px solid rgba(240, 232, 213, 0.04)",
              alignItems: "baseline",
            }}
          >
            {/* Left column: callsign + intent badge */}
            <div style={{ width: "160px", flexShrink: 0, textAlign: "right" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                <span style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: entry.role === "user" ? "#E8A94B" : "#7EC8A8",
                }}>
                  {entry.role === "user" ? "you" : "relay"}
                </span>
                {entry.intentType && entry.role === "relay" && (
                  <span style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "rgba(240, 232, 213, 0.25)",
                    textTransform: "uppercase",
                  }}>
                    {INTENT_LABELS[entry.intentType] ?? entry.intentType}
                  </span>
                )}
                <span style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.6rem",
                  color: "rgba(240, 232, 213, 0.2)",
                }}>
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Right column: message */}
            <div style={{ flex: 1 }}>
              <p className="font-display" style={{
                fontSize: entry.role === "relay" ? "1.6rem" : "1.3rem",
                fontStyle: entry.role === "relay" ? "italic" : "normal",
                color: entry.role === "relay" ? "#F0E8D5" : "rgba(240, 232, 213, 0.65)",
                lineHeight: 1.4,
                letterSpacing: entry.role === "relay" ? "-0.01em" : "0",
              }}>
                {entry.text}
              </p>

              {/* Inline weather/search data rendering */}
              {typeof entry.data?.search_url === 'string' && (
                <a
                  href={entry.data.search_url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.7rem",
                    color: "#E8A94B",
                    textDecoration: "underline",
                    letterSpacing: "0.05em",
                  }}
                >
                  Open search →
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} style={{ height: "200px" }} />
    </div>
  );
}
