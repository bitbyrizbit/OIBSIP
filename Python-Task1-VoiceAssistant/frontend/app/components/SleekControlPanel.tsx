"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CustomCommand, Reminder } from "../lib/types";
import {
  getCustomCommands,
  addCustomCommand,
  deleteCustomCommand,
  getPendingReminders,
} from "../lib/api";

interface SleekControlPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SleekControlPanel({ open, onClose }: SleekControlPanelProps) {
  const [commands, setCommands] = useState<CustomCommand[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newTrigger, setNewTrigger] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [tab, setTab] = useState<"commands" | "reminders">("commands");

  useEffect(() => {
    if (open) {
      getCustomCommands().then(setCommands);
      getPendingReminders().then(setReminders);
    }
  }, [open]);

  async function handleAdd() {
    if (!newTrigger.trim() || !newResponse.trim()) return;
    const cmd = await addCustomCommand(newTrigger.trim(), newResponse.trim());
    setCommands((prev) => [...prev, cmd]);
    setNewTrigger("");
    setNewResponse("");
  }

  async function handleDelete(id: string) {
    await deleteCustomCommand(id);
    setCommands((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.4)",
              zIndex: 40, backdropFilter: "blur(10px)",
            }}
          />
          <motion.div
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed", right: "20px", top: "20px", bottom: "20px", width: "400px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              zIndex: 50, display: "flex", flexDirection: "column", padding: "32px",
              backdropFilter: "blur(40px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <h2 className="font-sans" style={{ fontSize: "1.2rem", fontWeight: 500, color: "#FFFFFF" }}>
                Settings
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.1)", border: "none", width: "32px", height: "32px",
                  borderRadius: "16px", color: "#FFFFFF", cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", background: "rgba(0,0,0,0.3)", padding: "4px", borderRadius: "12px", marginBottom: "32px" }}>
              {(["commands", "reminders"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, background: tab === t ? "rgba(255,255,255,0.15)" : "transparent",
                    border: "none", cursor: "pointer", padding: "8px", borderRadius: "8px",
                    fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 500,
                    color: tab === t ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                    transition: "all 0.2s", textTransform: "capitalize",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Commands Tab */}
            {tab === "commands" && (
              <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="text"
                    placeholder="When I say..."
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    style={{
                      background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px", color: "#FFFFFF", fontSize: "0.9rem", padding: "12px 16px",
                      outline: "none", fontFamily: "var(--font-inter)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="You reply with..."
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    style={{
                      background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px", color: "#FFFFFF", fontSize: "0.9rem", padding: "12px 16px",
                      outline: "none", fontFamily: "var(--font-inter)",
                    }}
                  />
                  <button
                    onClick={handleAdd}
                    style={{
                      background: "#FFFFFF", border: "none", color: "#000000", fontWeight: 500,
                      padding: "12px 20px", cursor: "pointer", fontFamily: "var(--font-inter)",
                      fontSize: "0.9rem", borderRadius: "12px", transition: "all 0.2s", marginTop: "4px",
                    }}
                  >
                    Save Custom Command
                  </button>
                </div>

                <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {commands.length === 0 && (
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.3)", textAlign: "center", marginTop: "20px" }}>
                      No custom commands configured.
                    </p>
                  )}
                  {commands.map((cmd) => (
                    <div key={cmd.id} style={{
                      padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.05)",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "#FFFFFF", fontWeight: 500 }}>
                          "{cmd.trigger}"
                        </p>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.5)", marginTop: "4px" }}>
                          {cmd.response}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(cmd.id)}
                        style={{ background: "rgba(255,255,255,0.1)", border: "none", width: "28px", height: "28px", borderRadius: "14px", color: "#FFFFFF", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reminders Tab */}
            {tab === "reminders" && (
              <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                {reminders.length === 0 && (
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.3)", textAlign: "center", marginTop: "20px" }}>
                    No pending reminders.
                  </p>
                )}
                {reminders.map((r) => (
                  <div key={r.id} style={{
                    padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#FFFFFF", fontWeight: 500 }}>
                      {r.content}
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                      {new Date(r.trigger_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
