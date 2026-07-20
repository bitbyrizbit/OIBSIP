"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "../lib/types";
import MessageBubble from "./MessageBubble";

interface MessageThreadProps {
  messages: Message[];
  currentUserId: number;
  typingUser: string | null;
}

export default function MessageThread({ messages, currentUserId, typingUser }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  if (messages.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#14110F" }}>
        <p className="font-display" style={{ fontSize: "2.5rem", fontStyle: "italic", color: "rgba(242, 234, 216, 0.2)" }}>
          The line is silent.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#14110F", padding: "0 10vw", paddingTop: "80px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {messages.map((message, i) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender_id === currentUserId}
            index={i}
          />
        ))}
      </div>

      <AnimatePresence>
        {typingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", gap: "24px", padding: "16px 0", alignItems: "baseline" }}
          >
            <div style={{ width: "180px", flexShrink: 0, textAlign: "right" }}>
              <span style={{ fontFamily: "var(--font-work-sans)", fontSize: "1rem", color: "#7BAFC4" }}>
                {typingUser}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <span className="font-display" style={{ fontSize: "1.75rem", fontStyle: "italic", color: "rgba(242, 234, 216, 0.5)", animation: "ambient-pulse 1.5s infinite" }}>
                is speaking...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} style={{ height: "120px" }} />
    </div>
  );
}