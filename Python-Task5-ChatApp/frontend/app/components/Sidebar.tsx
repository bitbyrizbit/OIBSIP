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
    <aside className="relative flex h-full w-72 flex-col hairline-r bg-background">
      {/* Heavy, cinematic header */}
      <div className="hairline-b px-8 py-10 relative overflow-hidden">
        {/* Subtle physical lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
        <h1 className="font-display text-4xl italic tracking-tight text-ink">Party Line</h1>
        <p className="mt-1 font-sans text-[10px] tracking-widest text-accent-copper">
          Instrument No. 02
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 relative">
        <div className="flex items-center justify-between pb-6">
          <p className="font-sans text-xs tracking-[0.15em] text-ink-secondary">Switchboard</p>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="font-sans text-[10px] tracking-widest text-accent-copper transition-colors hover:text-ink"
          >
            [ new connection ]
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="mb-6">
            <input
              autoFocus
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Name the line..."
              className="w-full border-0 hairline-b bg-transparent px-0 py-2 font-display text-lg italic text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-0 focus:border-accent-copper"
            />
          </form>
        )}

        <div className="flex flex-col relative space-y-1">
          {rooms.map((room) => {
            const isActive = activeRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="group relative flex w-full items-center py-3 pl-4 pr-2 text-left transition-all duration-300"
              >
                {/* Physical Copper Bar sliding indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-copper-bar"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent-copper shadow-[0_0_8px_rgba(181,115,76,0.3)]"
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                )}
                <span
                  className={`relative transition-all duration-300 ${
                    isActive
                      ? "font-display text-xl italic text-ink tracking-wide"
                      : "font-sans text-sm text-ink-secondary group-hover:text-ink group-hover:tracking-wide"
                  }`}
                >
                  {room.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hairline-t px-8 py-6 bg-surface/30">
        <p className="font-sans text-[10px] tracking-widest text-ink-secondary">Active Operator</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-sans text-sm tracking-wide text-ink">{username}</span>
          <button onClick={onLogout} className="font-sans text-[10px] tracking-widest text-ink-tertiary transition-colors hover:text-accent-copper-dim">
            [ disconnect ]
          </button>
        </div>
      </div>
    </aside>
  );
}