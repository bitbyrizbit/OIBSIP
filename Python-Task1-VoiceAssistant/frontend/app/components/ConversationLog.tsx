import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ConversationEntry } from "../lib/types";

interface ConversationLogProps {
  entries: ConversationEntry[];
}

export default function ConversationLog({ entries }: ConversationLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-mono text-sm text-text-tertiary">
          the channel is open. say something.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-8 py-6">
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: entry.role === "user" ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className="max-w-lg">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                {entry.role === "user" ? "you" : "relay"}
              </span>
              {entry.intentType && (
                <span className="rounded-full bg-surface-raised px-2 py-0.5 font-mono text-xs text-accent-signal">
                  {entry.intentType}
                </span>
              )}
            </div>
            <p
              className={`mt-1 font-sans text-sm leading-relaxed ${
                entry.role === "user" ? "text-text-secondary" : "text-text-primary"
              }`}
            >
              {entry.text}
            </p>
          </div>
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}