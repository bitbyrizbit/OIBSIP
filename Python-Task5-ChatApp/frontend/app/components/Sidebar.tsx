"use client";

import { useState, FormEvent } from "react";
import type { Room } from "../lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  rooms: Room[];
  activeRoomId: number | null;
  onSelectRoom: (id: number) => void;
  onCreateRoom: (name: string) => void;
  username: string;
  onLogout: () => void;
}

export default function Sidebar({ rooms, activeRoomId, onSelectRoom, onCreateRoom, username, onLogout }: SidebarProps) {
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    const trimmed = newRoomName.trim();
    if (trimmed.length > 0) {
      onCreateRoom(trimmed);
      setNewRoomName("");
      setShowCreate(false);
    }
  }

  return (
    <aside
      className="flex h-full flex-col"
      style={{
        width: "280px",
        minWidth: "280px",
        background: "#111318",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "32px 28px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "2.2rem",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#F4F0E8",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Party Line
        </h1>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#C9964A",
            }}
          />
          <span
            className="font-sans"
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "#7A8A9E",
              textTransform: "uppercase",
            }}
          >
            Instrument No. 02
          </span>
        </div>
      </div>

      {/* Lines List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px 16px",
          }}
        >
          <span
            className="font-sans"
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "#7A8A9E",
              textTransform: "uppercase",
            }}
          >
            Connections
          </span>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="font-sans"
            style={{
              fontSize: "11px",
              color: "#C9964A",
              letterSpacing: "0.05em",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F0E8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#C9964A")}
          >
            + New
          </button>
        </div>

        <AnimatePresence>
          {showCreate && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreate}
              style={{ overflow: "hidden", marginBottom: "12px" }}
            >
              <input
                autoFocus
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Line name..."
                className="font-sans"
                style={{
                  width: "100%",
                  background: "#181A21",
                  border: "1px solid rgba(201,150,74,0.4)",
                  padding: "10px 14px",
                  fontSize: "14px",
                  color: "#F4F0E8",
                  outline: "none",
                  borderRadius: "4px",
                  letterSpacing: "0.01em",
                }}
              />
            </motion.form>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {rooms.map((room) => {
            const isActive = activeRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="font-sans"
                style={{
                  position: "relative",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  background: isActive ? "rgba(201,150,74,0.08)" : "transparent",
                  border: "none",
                  borderLeft: isActive ? "2px solid #C9964A" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  borderRadius: "0 4px 4px 0",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#F4F0E8" : "#7A8A9E",
                    letterSpacing: "0.01em",
                    transition: "color 0.2s",
                  }}
                >
                  {room.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator Footer */}
      <div
        style={{
          padding: "20px 28px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            className="font-sans"
            style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#7A8A9E", textTransform: "uppercase" }}
          >
            Operator
          </p>
          <p
            className="font-sans"
            style={{ marginTop: "2px", fontSize: "14px", color: "#F4F0E8", fontWeight: 500 }}
          >
            {username}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="font-sans"
          style={{
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "#7A8A9E",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C44B35")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7A8A9E")}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}