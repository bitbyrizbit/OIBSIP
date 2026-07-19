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
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0C0D11",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,150,74,0.04) 0%, transparent 70%)",
            animation: "ambient-breathe 6s ease-in-out infinite",
          }}
        />
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <p
            className="font-display"
            style={{ fontSize: "1.8rem", fontStyle: "italic", color: "rgba(244,240,232,0.25)", letterSpacing: "-0.01em" }}
          >
            Nothing on the line yet.
          </p>
          <p
            className="font-sans"
            style={{ marginTop: "12px", fontSize: "11px", letterSpacing: "0.15em", color: "rgba(122,138,158,0.6)", textTransform: "uppercase" }}
          >
            Be the first to transmit
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#0C0D11",
        position: "relative",
      }}
    >
      {/* Top fade */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "40px",
          background: "linear-gradient(to bottom, #0C0D11, transparent)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "8px 48px 32px",
        }}
      >
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: "0 48px 24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              className="font-sans"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "#C9964A",
                textTransform: "uppercase",
              }}
            >
              {typingUser}
            </span>
            <span
              className="font-sans"
              style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#7A8A9E" }}
            >
              is typing
            </span>
            {/* Animated dots */}
            <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#C9964A" }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} style={{ height: "4px" }} />
    </div>
  );
}