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
    <aside className="flex h-full w-[25%] min-w-[300px] flex-col bg-accent-vermilion border-r-4 border-ink-alabaster text-ink-alabaster z-50">
      
      {/* Brutalist Header */}
      <div className="p-8 border-b-4 border-ink-alabaster">
        <h1 className="font-sans text-5xl font-bold tracking-tighter uppercase leading-none">Party<br/>Line</h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest border-t-2 border-ink-alabaster pt-2">
          Inst. 02
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="flex items-end justify-between border-b-4 border-ink-alabaster pb-2 mb-8">
          <p className="font-display text-3xl italic">Index</p>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="font-sans text-sm font-bold uppercase tracking-widest hover:text-canvas-blue transition-colors"
          >
            [ + ]
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="mb-8 border-4 border-ink-alabaster bg-canvas-blue p-2">
            <input
              autoFocus
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="CREATE LINE"
              className="w-full bg-transparent font-sans text-xl font-bold uppercase tracking-tight text-ink-alabaster placeholder:text-ink-alabaster/50 focus:outline-none focus:ring-0"
            />
          </form>
        )}

        <div className="flex flex-col gap-4">
          {rooms.map((room) => {
            const isActive = activeRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`w-full text-left p-4 border-4 border-ink-alabaster transition-all duration-200 ${
                  isActive 
                    ? "bg-ink-alabaster text-accent-vermilion" 
                    : "bg-transparent text-ink-alabaster hover:bg-canvas-blue hover:text-ink-alabaster hover:border-canvas-blue"
                }`}
              >
                <span className="font-sans text-2xl font-bold tracking-tight uppercase block leading-none">
                  {room.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-8 border-t-4 border-ink-alabaster bg-accent-vermilion">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-widest">Operator</span>
            <span className="font-sans text-2xl font-bold uppercase tracking-tight">{username}</span>
          </div>
          <button 
            onClick={onLogout} 
            className="w-12 h-12 flex items-center justify-center border-4 border-ink-alabaster bg-ink-alabaster text-accent-vermilion font-bold text-xl hover:bg-canvas-blue hover:border-canvas-blue hover:text-ink-alabaster transition-colors"
            title="Terminate"
          >
            X
          </button>
        </div>
      </div>
    </aside>
  );
}