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
      <div className="flex flex-1 items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface/[0.15] to-transparent" />
        <p className="font-sans text-xs tracking-[0.2em] text-ink-tertiary uppercase relative z-10">
          Awaiting Transmission
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background relative">
      {/* Heavy shadow at top to simulate physical depth inside the machine */}
      <div className="sticky top-0 z-10 h-6 bg-gradient-to-b from-[#0B0B0C] to-transparent pointer-events-none" />

      <div className="px-12 pb-12 pt-2">
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} isOwn={message.sender_id === currentUserId} />
          ))}
        </div>

        <AnimatePresence>
          {typingUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mt-6 flex items-center gap-6 py-4"
            >
              <div className="w-32 font-sans text-[10px] tracking-widest text-accent-copper uppercase">{typingUser}</div>
              <div className="flex-1 font-display text-xl italic text-ink-tertiary">
                Receiving signal...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}