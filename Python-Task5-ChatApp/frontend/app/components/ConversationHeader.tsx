import { motion, AnimatePresence } from "framer-motion";

interface ConversationHeaderProps {
  roomName: string;
  activeUsers: string[];
  connected: boolean;
}

export default function ConversationHeader({ roomName, activeUsers, connected }: ConversationHeaderProps) {
  return (
    <div className="flex items-end justify-between hairline-b bg-background px-12 py-10">
      <div>
        <h2 className="font-display text-5xl italic tracking-tight text-ink">{roomName}</h2>
        <div className="mt-4 h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeUsers.join(",")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "linear" }}
              className="font-mono text-xs tracking-widest text-ink-tertiary"
            >
              {activeUsers.length > 0 ? `line shared by: ${activeUsers.join(", ")}` : "line empty"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="mb-1">
        <span className={`font-mono text-[10px] tracking-widest ${connected ? "text-ink-secondary" : "text-accent-red"}`}>
          {connected ? "[ status: connected ]" : "[ status: dropped ]"}
        </span>
      </div>
    </div>
  );
}