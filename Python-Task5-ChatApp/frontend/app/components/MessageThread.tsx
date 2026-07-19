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
      <div className="flex flex-1 items-center justify-center bg-background">
        <p className="font-sans small-caps text-xs text-ink-tertiary">
          [ End of Ledger — No Records Found ]
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* The Ledger Header - Just visual structure */}
      <div className="sticky top-0 z-10 flex hairline-b bg-background/95 px-12 py-3 backdrop-blur-sm">
        <div className="w-48 font-mono text-[10px] tracking-widest text-ink-tertiary">origin</div>
        <div className="flex-1 font-mono text-[10px] tracking-widest text-ink-tertiary">transcript</div>
        <div className="w-24 text-right font-mono text-[10px] tracking-widest text-ink-tertiary">time</div>
      </div>

      <div className="px-12 pb-12 pt-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} isOwn={message.sender_id === currentUserId} />
        ))}

        <AnimatePresence>
          {typingUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "linear" }}
              className="mt-6 flex items-start"
            >
              <div className="w-48 font-mono text-xs text-ink-tertiary">{typingUser}</div>
              <div className="flex-1 font-display text-lg italic text-ink-tertiary">
                [ receiving transmission... ]
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}