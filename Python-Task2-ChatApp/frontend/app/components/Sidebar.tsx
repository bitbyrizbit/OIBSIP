interface Room {
  id: number;
  name: string;
}

interface SidebarProps {
  rooms: Room[];
  activeRoomId: number | null;
  onSelectRoom: (id: number) => void;
}

export default function Sidebar({ rooms, activeRoomId, onSelectRoom }: SidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-hairline bg-surface">
      <div className="border-b border-hairline px-6 py-8">
        <h1 className="font-display text-2xl italic text-ink">Party Line</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ink-tertiary">
          instrument no. 02
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 font-mono text-xs uppercase tracking-widest text-ink-tertiary">
          the lines
        </p>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`w-full rounded-md px-3 py-2.5 text-left font-sans text-sm transition-colors duration-300 ${
              activeRoomId === room.id
                ? "bg-surface-raised text-ink"
                : "text-ink-secondary hover:bg-surface-raised/60"
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>
    </aside>
  );
}