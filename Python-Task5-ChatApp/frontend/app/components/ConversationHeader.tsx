import { motion, AnimatePresence } from "framer-motion";

interface ConversationHeaderProps {
  roomName: string;
  activeUsers: string[];
  connected: boolean;
}

export default function ConversationHeader({ roomName, activeUsers, connected }: ConversationHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#111318",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div>
        <h2
          className="font-display"
          style={{
            fontSize: "1.6rem",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#F4F0E8",
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          {roomName}
        </h2>
        <div style={{ marginTop: "6px", height: "16px", overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeUsers.join(",")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="font-sans"
              style={{
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: "#7A8A9E",
              }}
            >
              {activeUsers.length > 0
                ? `${activeUsers.join(", ")} on the line`
                : "No one on the line yet"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: connected ? "#C9964A" : "#7A8A9E",
            boxShadow: connected ? "0 0 6px rgba(201,150,74,0.6)" : "none",
          }}
        />
        <span
          className="font-sans"
          style={{
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "#7A8A9E",
            textTransform: "uppercase",
          }}
        >
          {connected ? "Connected" : "Connecting"}
        </span>
      </div>
    </div>
  );
}