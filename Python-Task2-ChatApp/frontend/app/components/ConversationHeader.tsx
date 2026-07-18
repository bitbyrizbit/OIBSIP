import { motion, AnimatePresence } from "framer-motion";

interface ConversationHeaderProps {
  roomName: string;
  activeUsers: string[];
  connected: boolean;
}

export default function ConversationHeader({ roomName, activeUsers, connected }: ConversationHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-hairline bg-background px-8 py-5">
      <div>
        <h2 className="font-display text-xl text-ink">{roomName}</h2>
        <div className="mt-0.5 h-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeUsers.join(",")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-xs text-ink-tertiary"
            >
              {activeUsers.length > 0 ? `${activeUsers.join(", ")} on the line` : "no one on the line yet"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <motion.span
          animate={connected ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-accent-gold" : "bg-ink-tertiary"}`}
        />
        <span className="font-mono text-xs uppercase tracking-widest text-ink-tertiary">
          {connected ? "connected" : "connecting"}
        </span>
      </div>
    </div>
  );
}