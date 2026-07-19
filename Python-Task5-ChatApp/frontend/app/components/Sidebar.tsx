"use client";

import { useState, FormEvent } from "react";
import type { Room } from "../lib/types";

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
    <aside style={{
      width: "300px",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(242, 234, 216, 0.08)",
      padding: "40px 0",
      background: "#14110F"
    }}>
      <div style={{ padding: "0 40px", marginBottom: "60px" }}>
        <h1 className="font-display" style={{ fontSize: "2rem", fontStyle: "italic", color: "#F2EAD8", letterSpacing: "-0.02em" }}>
          Party Line
        </h1>
        <p style={{ fontFamily: "var(--font-work-sans)", fontSize: "0.85rem", color: "#C9724A", marginTop: "8px" }}>
          Operator: {username}
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-work-sans)", fontSize: "0.85rem", color: "rgba(242, 234, 216, 0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Active Lines
          </h2>
          <button 
            onClick={() => setShowCreate(!showCreate)}
            style={{ background: "none", border: "none", color: "#7BAFC4", fontSize: "0.85rem", cursor: "pointer", padding: 0 }}
          >
            Ask for a new line
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} style={{ marginBottom: "24px" }}>
            <input
              autoFocus
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Name the line..."
              style={{
                width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #7BAFC4",
                color: "#F2EAD8", fontSize: "1rem", padding: "8px 0", outline: "none", fontFamily: "var(--font-work-sans)"
              }}
            />
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {rooms.map((room) => {
            const isActive = activeRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                style={{
                  background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "12px"
                }}
              >
                <div style={{ 
                  width: "8px", height: "8px", borderRadius: "50%", 
                  background: isActive ? "#C9724A" : "transparent",
                  border: isActive ? "none" : "1px solid rgba(242, 234, 216, 0.2)"
                }} />
                <span style={{ 
                  fontFamily: "var(--font-work-sans)", fontSize: "1.1rem",
                  color: isActive ? "#F2EAD8" : "rgba(242, 234, 216, 0.6)",
                  fontWeight: isActive ? 500 : 400
                }}>
                  {room.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "0 40px", marginTop: "auto" }}>
        <button 
          onClick={onLogout}
          style={{ background: "none", border: "none", color: "rgba(242, 234, 216, 0.4)", fontSize: "0.85rem", cursor: "pointer", padding: 0, textDecoration: "underline" }}
        >
          Hang up the receiver
        </button>
      </div>
    </aside>
  );
}