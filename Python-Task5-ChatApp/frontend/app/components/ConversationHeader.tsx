import { motion, AnimatePresence } from "framer-motion";

interface ConversationHeaderProps {
  roomName: string;
  activeUsers: string[];
  connected: boolean;
}

export default function ConversationHeader({ roomName, activeUsers, connected }: ConversationHeaderProps) {
  return (
    <div className="flex items-end justify-between hairline-b bg-surface px-12 py-10 relative overflow-hidden shadow-md">
      {/* Physical lighting gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="font-display text-5xl italic tracking-tight text-ink drop-shadow-md">{roomName}</h2>
        <div className="mt-4 h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeUsers.join(",")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="font-sans text-xs tracking-widest text-accent-copper"
            >
              {activeUsers.length > 0 ? `Shared by: ${activeUsers.join(", ")}` : "Line empty"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mb-1 relative z-10">
        <div className={`flex items-center gap-3 ${connected ? "text-ink-tertiary" : "text-accent-copper"}`}>
          <span className="font-sans text-[10px] tracking-widest">
            {connected ? "Connection active" : "Connection dropped"}
          </span>
          {/* Physical connection light */}
          <div className={`h-2 w-2 rounded-full shadow-inner ${connected ? "bg-[#3A4A3A] shadow-[#2A3A2A]" : "bg-accent-copper shadow-[#63221A]"}`} />
        </div>
      </div>
    </div>
  );
}