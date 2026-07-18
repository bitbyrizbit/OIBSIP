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
      <div className="flex flex-1 items-center justify-center">
        <p className="font-display text-lg italic text-ink-tertiary">
          nothing's been said yet. be the first.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-8 py-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} isOwn={message.sender_id === currentUserId} />
      ))}

      <AnimatePresence>
        {typingUser && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="px-1 font-mono text-xs italic text-ink-tertiary"
          >
            {typingUser} is on the line, typing...
          </motion.p>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}