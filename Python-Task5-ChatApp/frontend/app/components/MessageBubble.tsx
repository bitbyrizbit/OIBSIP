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
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`group flex items-start gap-6 py-5 px-6 rounded-sm bg-surface transition-colors hover:bg-surface-raised shadow-sm ${isOwn ? "border-r-2 border-accent-copper" : "border-l-2 border-ink-tertiary"}`}
    >
      <div className={`w-32 pt-1 font-sans text-[10px] tracking-widest uppercase ${isOwn ? "text-accent-copper" : "text-ink-secondary"}`}>
        {message.sender_username}
      </div>
      
      <div className="flex-1 font-display text-[22px] leading-relaxed text-ink">
        {renderEmojiShortcodes(message.content)}
      </div>

      <div className="w-16 pt-1.5 text-right font-sans text-[10px] tracking-wider text-ink-tertiary">
        {time}
      </div>
    </motion.div>
  );
}