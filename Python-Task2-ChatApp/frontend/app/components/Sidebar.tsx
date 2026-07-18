"use client";

import { useState, FormEvent } from "react";
import type { Room } from "../lib/types";
import { motion } from "framer-motion";

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
    <aside className="flex h-full w-72 flex-col border-r border-hairline bg-surface">
      <div className="border-b border-hairline px-6 py-8">
        <h1 className="font-display text-2xl italic text-ink">Party Line</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ink-tertiary">
          instrument no. 02
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex items-center justify-between px-3 pb-2">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-tertiary">the lines</p>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="font-mono text-xs text-accent-gold hover:text-accent-gold-dim"
          >
            + new
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="px-3 pb-3">
            <input
              autoFocus
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="name it..."
              className="w-full rounded-md border border-hairline bg-background px-3 py-1.5 font-sans text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent-gold"
            />
          </form>
        )}

        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className="relative w-full rounded-md px-3 py-2.5 text-left font-sans text-sm"
          >
            {activeRoomId === room.id && (
              <motion.div
                layoutId="active-room"
                className="absolute inset-0 rounded-md bg-surface-raised"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span
              className={`relative transition-colors duration-300 ${
                activeRoomId === room.id ? "text-ink" : "text-ink-secondary hover:text-ink"
              }`}
            >
              {room.name}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-hairline px-6 py-4">
        <p className="font-mono text-xs text-ink-tertiary">signed in as {username}</p>
        <button onClick={onLogout} className="mt-1 font-mono text-xs text-accent-red hover:text-accent-red-dim">
          hang up
        </button>
      </div>
    </aside>
  );
}