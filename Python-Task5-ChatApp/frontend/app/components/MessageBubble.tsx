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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "linear" }}
      className={`group flex items-start py-4 hairline-b transition-colors hover:bg-surface/50`}
    >
      <div className={`w-48 pt-0.5 font-mono text-xs ${isOwn ? "text-accent-red" : "text-ink"}`}>
        {message.sender_username}
        {isOwn && <span className="ml-2 opacity-50">[ self ]</span>}
      </div>
      
      <div className="flex-1 pr-8 font-sans text-base leading-relaxed text-ink">
        {renderEmojiShortcodes(message.content)}
      </div>

      <div className="w-24 pt-1 text-right font-mono text-[10px] text-ink-tertiary">
        {time}
      </div>
    </motion.div>
  );
}