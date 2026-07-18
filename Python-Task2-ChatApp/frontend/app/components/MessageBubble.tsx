import { renderEmojiShortcodes } from "../lib/emoji";
import { motion } from "framer-motion";
import type { Message } from "../lib/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.sent_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
    >
      {!isOwn && (
        <p className="mb-1 px-1 font-mono text-xs text-ink-tertiary">{message.sender_username}</p>
      )}
      <div
        className={`max-w-md rounded-lg px-4 py-2.5 font-sans text-sm leading-relaxed ${
          isOwn ? "bg-accent-red text-background" : "bg-surface text-ink"
        }`}
      >
        {renderEmojiShortcodes(message.content)}
      </div>
      <p className="mt-1 px-1 font-mono text-xs text-ink-tertiary">{time}</p>
    </motion.div>
  );
}