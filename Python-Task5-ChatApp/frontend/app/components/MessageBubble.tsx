import { renderEmojiShortcodes } from "../lib/emoji";
import { motion } from "framer-motion";
import type { Message } from "../lib/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const len = message.content.length;
  
  // Dynamic scaling based on character count
  let fontClass = "text-[2rem] leading-tight md:text-[3rem]";
  if (len < 15) {
    fontClass = "text-[6rem] leading-[0.85] md:text-[10rem]";
  } else if (len < 40) {
    fontClass = "text-[4rem] leading-[0.9] md:text-[7rem]";
  } else if (len < 100) {
    fontClass = "text-[3rem] leading-[0.95] md:text-[5rem]";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col w-full py-12 ${isOwn ? "items-end text-right" : "items-start text-left"}`}
    >
      <div className={`font-mono text-xs uppercase tracking-widest border-4 p-2 mb-4 bg-canvas-blue ${isOwn ? "border-accent-absinthe text-accent-absinthe" : "border-ink-alabaster text-ink-alabaster"}`}>
        {message.sender_username}
      </div>
      
      <div className={`font-sans font-black tracking-tighter uppercase break-words max-w-full ${fontClass} ${isOwn ? "text-accent-absinthe text-stroke" : "text-ink-alabaster"}`}>
        {renderEmojiShortcodes(message.content)}
      </div>
    </motion.div>
  );
}