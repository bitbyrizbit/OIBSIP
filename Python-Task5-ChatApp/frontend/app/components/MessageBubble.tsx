import { renderEmojiShortcodes } from "../lib/emoji";
import { motion } from "framer-motion";
import type { Message } from "../lib/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  index: number;
}

export default function MessageBubble({ message, isOwn, index }: MessageBubbleProps) {
  const time = new Date(message.sent_at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.05, 0.4) }}
      style={{
        display: "flex",
        gap: "24px",
        padding: "16px 0",
        borderBottom: "1px solid rgba(242, 234, 216, 0.04)",
        alignItems: "baseline"
      }}
    >
      <div style={{ width: "180px", flexShrink: 0, textAlign: "right" }}>
        <span style={{ 
          fontFamily: "var(--font-work-sans)", 
          fontSize: "1rem", 
          color: isOwn ? "#C9724A" : "#7BAFC4", 
          fontWeight: 500 
        }}>
          {message.sender_username}
        </span>
        <span style={{ 
          display: "block", 
          fontFamily: "var(--font-space-mono)", 
          fontSize: "0.75rem", 
          color: "rgba(242, 234, 216, 0.4)", 
          marginTop: "4px" 
        }}>
          {time}
        </span>
      </div>

      <div style={{ 
        flex: 1, 
        fontFamily: "var(--font-newsreader)", 
        fontSize: "1.75rem", 
        color: "#F2EAD8", 
        lineHeight: 1.4,
        fontStyle: isOwn ? "normal" : "italic"
      }}>
        {renderEmojiShortcodes(message.content)}
      </div>
    </motion.div>
  );
}