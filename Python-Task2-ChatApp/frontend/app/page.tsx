"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ConversationHeader from "./components/ConversationHeader";
import EmptyLine from "./components/EmptyLine";

const placeholderRooms = [
  { id: 1, name: "general" },
  { id: 2, name: "random" },
];

export default function Home() {
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const activeRoom = placeholderRooms.find((r) => r.id === activeRoomId);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar rooms={placeholderRooms} activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />
      <div className="flex flex-1 flex-col">
        {activeRoom ? (
          <>
            <ConversationHeader roomName={activeRoom.name} activeUsers={["priya"]} />
            <div className="flex-1" />
          </>
        ) : (
          <EmptyLine />
        )}
      </div>
    </div>
  );
}