"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ConversationEntry } from "../lib/types";

interface FloatingLogProps {
  entries: ConversationEntry[];
}

export default function FloatingLog({ entries }: FloatingLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // We only show the last 3 messages so it doesn't clutter the sleek UI.
  // We filter out user messages to keep it minimal, focusing on Assistant responses.
  const recentEntries = entries
    .filter((e) => e.role === "relay")
    .slice(-3);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [recentEntries]);

  if (recentEntries.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "40px",
        left: "40px",
        width: "360px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 20,
        pointerEvents: "none", // Let clicks pass through to the orb/background
      }}
    >
      <AnimatePresence initial={false}>
        {recentEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "20px",
              pointerEvents: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)" }}>
                RELAY
              </span>
              {entry.intentType && (
                <span style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.05em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                  {entry.intentType}
                </span>
              )}
            </div>
            
            <p className="font-sans" style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "#FFFFFF", fontWeight: 400 }}>
              {entry.text}
            </p>

            {typeof entry.data?.search_url === "string" && (
              <a
                href={entry.data.search_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "12px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                View Search Results
              </a>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
