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

interface ControlPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ControlPanel({ open, onClose }: ControlPanelProps) {
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
              position: "fixed", inset: 0, background: "rgba(13, 10, 7, 0.7)",
              zIndex: 40, backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", right: 0, top: 0, bottom: 0, width: "420px",
              background: "#161210", borderLeft: "1px solid rgba(240, 232, 213, 0.06)",
              zIndex: 50, display: "flex", flexDirection: "column", padding: "40px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px" }}>
              <h2 className="font-display" style={{ fontSize: "1.6rem", fontStyle: "italic", color: "#F0E8D5" }}>
                Control Panel
              </h2>
              <button
                onClick={onClose}
                style={{ background: "none", border: "none", color: "rgba(240, 232, 213, 0.4)", cursor: "pointer", fontSize: "1rem" }}
              >
                close
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "24px", marginBottom: "32px", borderBottom: "1px solid rgba(240, 232, 213, 0.06)", paddingBottom: "16px" }}>
              {(["commands", "reminders"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem", letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: tab === t ? "#E8A94B" : "rgba(240, 232, 213, 0.3)",
                    borderBottom: tab === t ? "1px solid #E8A94B" : "none",
                    paddingBottom: "4px",
                    transition: "color 0.2s",
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
                    placeholder="trigger phrase..."
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    style={{
                      background: "transparent", border: "none", borderBottom: "1px solid rgba(240, 232, 213, 0.15)",
                      color: "#F0E8D5", fontSize: "0.9rem", padding: "8px 0", outline: "none",
                      fontFamily: "var(--font-dm-sans)", caretColor: "#E8A94B",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="response..."
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    style={{
                      background: "transparent", border: "none", borderBottom: "1px solid rgba(240, 232, 213, 0.15)",
                      color: "#F0E8D5", fontSize: "0.9rem", padding: "8px 0", outline: "none",
                      fontFamily: "var(--font-dm-sans)", caretColor: "#E8A94B",
                    }}
                  />
                  <button
                    onClick={handleAdd}
                    style={{
                      background: "none", border: "1px solid rgba(232, 169, 75, 0.3)", color: "#E8A94B",
                      padding: "10px 20px", cursor: "pointer", fontFamily: "var(--font-dm-mono)",
                      fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase",
                      borderRadius: "2px", transition: "all 0.2s", alignSelf: "flex-start",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(232, 169, 75, 0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                  >
                    Add command
                  </button>
                </div>

                <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "1px" }}>
                  {commands.length === 0 && (
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem", color: "rgba(240, 232, 213, 0.2)" }}>
                      No custom commands yet.
                    </p>
                  )}
                  {commands.map((cmd) => (
                    <div key={cmd.id} style={{
                      padding: "12px 0", borderBottom: "1px solid rgba(240, 232, 213, 0.04)",
                      display: "flex", justifyContent: "space-between", alignItems: "baseline",
                    }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem", color: "#E8A94B", letterSpacing: "0.05em" }}>
                          &ldquo;{cmd.trigger}&rdquo;
                        </p>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(240, 232, 213, 0.6)", marginTop: "4px" }}>
                          → {cmd.response}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(cmd.id)}
                        style={{ background: "none", border: "none", color: "rgba(240, 232, 213, 0.2)", cursor: "pointer", fontSize: "0.75rem" }}
                      >
                        remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reminders Tab */}
            {tab === "reminders" && (
              <div style={{ flex: 1, overflow: "auto" }}>
                {reminders.length === 0 && (
                  <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem", color: "rgba(240, 232, 213, 0.2)" }}>
                    No pending reminders.
                  </p>
                )}
                {reminders.map((r) => (
                  <div key={r.id} style={{
                    padding: "14px 0", borderBottom: "1px solid rgba(240, 232, 213, 0.04)",
                  }}>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", color: "#F0E8D5" }}>
                      {r.content}
                    </p>
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem", color: "#E8A94B", marginTop: "4px" }}>
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
