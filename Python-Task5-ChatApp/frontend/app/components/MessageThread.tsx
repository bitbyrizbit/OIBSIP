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
      <div className="flex flex-1 items-center justify-center p-24">
        <h2 className="font-sans text-[8rem] font-black uppercase tracking-tighter text-ink-alabaster opacity-10 mix-blend-overlay text-stroke">
          EMPTY
        </h2>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-24 pt-48 pb-64">
      <div className="flex flex-col gap-8">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} isOwn={message.sender_id === currentUserId} />
        ))}
      </div>

      <AnimatePresence>
        {typingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-12 flex items-center justify-end"
          >
            <div className="border-4 border-accent-absinthe bg-canvas-blue p-4 text-right">
              <span className="font-sans text-4xl font-black uppercase tracking-tighter text-accent-absinthe animate-pulse block leading-none">
                {typingUser} IS<br/>TRANSMITTING
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} className="h-4" />
    </div>
  );
}