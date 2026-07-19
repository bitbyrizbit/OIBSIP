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
    <aside className="flex h-full w-72 flex-col hairline-r bg-background">
      <div className="hairline-b px-8 py-10">
        <h1 className="font-display text-3xl tracking-tight text-ink">Party Line</h1>
        <p className="mt-2 font-mono text-[10px] tracking-widest text-ink-tertiary">
          instrument no. 02
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex items-center justify-between pb-6">
          <p className="font-sans small-caps text-xs text-ink-secondary">The Ledger</p>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="font-mono text-xs text-ink-secondary transition-colors hover:text-ink"
          >
            [ new ]
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="mb-6">
            <input
              autoFocus
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Name it..."
              className="w-full border-0 hairline-b bg-transparent px-0 py-2 font-display text-lg italic text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-0 focus:border-ink"
            />
          </form>
        )}

        <div className="flex flex-col space-y-1">
          {rooms.map((room) => {
            const isActive = activeRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="group relative flex w-full items-center justify-between py-2 text-left transition-all duration-200"
              >
                <span
                  className={`relative ${
                    isActive
                      ? "font-display text-xl italic text-ink"
                      : "font-sans text-sm text-ink-secondary group-hover:text-ink group-hover:italic"
                  }`}
                >
                  {room.name}
                </span>
                
                {/* Austere active indicator - just a small dash on the right */}
                {isActive && (
                  <span className="font-mono text-xs text-ink">—</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hairline-t px-8 py-6">
        <p className="font-mono text-[10px] tracking-widest text-ink-secondary">operator</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-sans text-sm text-ink">{username}</span>
          <button onClick={onLogout} className="font-mono text-[10px] tracking-widest text-accent-red hover:text-accent-red-dim">
            [ drop ]
          </button>
        </div>
      </div>
    </aside>
  );
}