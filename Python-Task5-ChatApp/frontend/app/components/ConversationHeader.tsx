import { motion, AnimatePresence } from "framer-motion";

interface ConversationHeaderProps {
  roomName: string;
  activeUsers: string[];
  connected: boolean;
}

export default function ConversationHeader({ roomName, activeUsers, connected }: ConversationHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 p-12 pointer-events-none flex justify-between items-start">
      <div className="pointer-events-auto">
        <h2 className="font-display text-8xl italic text-ink-alabaster leading-none tracking-tight">
          {roomName}
        </h2>
      </div>
      
      <div className="pointer-events-auto flex flex-col items-end text-right">
        <div className="border-4 border-ink-alabaster bg-canvas-blue p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 justify-end">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-alabaster">
              {connected ? "LINK: ESTABLISHED" : "LINK: SEVERED"}
            </span>
            <div className={`h-4 w-4 border-2 border-ink-alabaster ${connected ? "bg-accent-absinthe" : "bg-accent-vermilion"} ${connected ? "animate-pulse" : ""}`} />
          </div>
          
          <div className="mt-2 h-4 overflow-hidden border-t-2 border-ink-alabaster pt-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeUsers.join(",")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-sans text-xs font-bold uppercase tracking-widest text-accent-absinthe"
              >
                {activeUsers.length > 0 ? activeUsers.join(" // ") : "EMPTY VECTOR"}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}