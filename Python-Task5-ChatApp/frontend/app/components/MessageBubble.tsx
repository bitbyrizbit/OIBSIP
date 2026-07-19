import { renderEmojiShortcodes } from "../lib/emoji";
import { motion } from "framer-motion";
import type { Message } from "../lib/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  index: number;
}

function getDynamicStyle(len: number): { fontSize: string; lineHeight: string; fontFamily: string; fontStyle: string } {
  if (len < 12) {
    return { fontSize: "5.5rem", lineHeight: "0.9", fontFamily: "var(--font-newsreader), serif", fontStyle: "italic" };
  } else if (len < 30) {
    return { fontSize: "3.2rem", lineHeight: "1.05", fontFamily: "var(--font-newsreader), serif", fontStyle: "italic" };
  } else if (len < 80) {
    return { fontSize: "2rem", lineHeight: "1.2", fontFamily: "var(--font-work-sans), sans-serif", fontStyle: "normal" };
  } else if (len < 200) {
    return { fontSize: "1.2rem", lineHeight: "1.5", fontFamily: "var(--font-work-sans), sans-serif", fontStyle: "normal" };
  } else {
    return { fontSize: "1rem", lineHeight: "1.65", fontFamily: "var(--font-work-sans), sans-serif", fontStyle: "normal" };
  }
}

export default function MessageBubble({ message, isOwn, index }: MessageBubbleProps) {
  const time = new Date(message.sent_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const msgStyle = getDynamicStyle(message.content.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.04, 0.3) }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOwn ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      {/* The Archive Ticket */}
      <div
        style={{
          position: "relative",
          maxWidth: "85%",
          background: isOwn ? "#1E2028" : "#181A21",
          border: `1px solid ${isOwn ? "rgba(201,150,74,0.25)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: "2px",
          overflow: "hidden",
          boxShadow: isOwn
            ? "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(201,150,74,0.1) inset"
            : "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Ticket header strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 18px",
            borderBottom: `1px solid ${isOwn ? "rgba(201,150,74,0.15)" : "rgba(255,255,255,0.05)"}`,
            background: isOwn ? "rgba(201,150,74,0.06)" : "rgba(255,255,255,0.02)",
          }}
        >
          <span
            className="font-sans"
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              fontWeight: 600,
              color: isOwn ? "#C9964A" : "#7A8A9E",
              textTransform: "uppercase",
            }}
          >
            {message.sender_username}
          </span>

          {/* Barcode-like decorative element */}
          <div style={{ display: "flex", gap: "2px", alignItems: "center", opacity: 0.35 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i % 3 === 0 ? "3px" : "1.5px",
                  height: "10px",
                  background: isOwn ? "#C9964A" : "#7A8A9E",
                }}
              />
            ))}
          </div>

          <span
            className="font-sans"
            style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: isOwn ? "rgba(201,150,74,0.6)" : "#7A8A9E",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            {time}
          </span>
        </div>

        {/* Message body */}
        <div
          style={{
            padding: message.content.length < 30 ? "24px 28px 28px" : "18px 22px 22px",
            color: "#F4F0E8",
            wordBreak: "break-word",
            fontWeight: message.content.length < 30 ? 300 : 400,
            letterSpacing: message.content.length < 12 ? "-0.02em" : "0.01em",
            ...msgStyle,
          }}
        >
          {renderEmojiShortcodes(message.content)}
        </div>

        {/* Left accent bar for own messages */}
        {isOwn && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "2px",
              height: "100%",
              background: "linear-gradient(to bottom, #C9964A, transparent)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}