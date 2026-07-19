import { motion, AnimatePresence } from "framer-motion";

interface ConversationHeaderProps {
  roomName: string;
  activeUsers: string[];
  connected: boolean;
}

export default function ConversationHeader({ roomName, activeUsers, connected }: ConversationHeaderProps) {
  return (
    <div style={{
      padding: "40px 10vw",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      background: "linear-gradient(to bottom, rgba(20, 17, 15, 1) 40%, rgba(20, 17, 15, 0))",
      zIndex: 10,
      pointerEvents: "none"
    }}>
      <div>
        <h2 className="font-display" style={{ fontSize: "2.5rem", fontStyle: "italic", color: "#F2EAD8", margin: 0, letterSpacing: "-0.02em" }}>
          {roomName}
        </h2>
        <div style={{ height: "24px", overflow: "hidden", marginTop: "4px" }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeUsers.join(",")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ fontFamily: "var(--font-work-sans)", fontSize: "0.85rem", color: "rgba(242, 234, 216, 0.4)" }}
            >
              {activeUsers.length > 0
                ? `Also on the line: ${activeUsers.join(", ")}`
                : "You're the only one here right now."}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ 
          width: "6px", height: "6px", borderRadius: "50%", 
          background: connected ? "#C9724A" : "rgba(242, 234, 216, 0.2)",
          animation: connected ? "ambient-pulse 3s infinite" : "none"
        }} />
        <span style={{ fontFamily: "var(--font-work-sans)", fontSize: "0.85rem", color: connected ? "#C9724A" : "rgba(242, 234, 216, 0.4)" }}>
          {connected ? "Line connected" : "Line dead"}
        </span>
      </div>
    </div>
  );
}