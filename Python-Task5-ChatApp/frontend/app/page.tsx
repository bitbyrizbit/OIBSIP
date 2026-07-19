"use client";

import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { getRooms, getRoomMessages, createRoom as apiCreateRoom } from "./lib/api";
import { useRoomSocket } from "./lib/useRoomSocket";
import type { Room, Message } from "./lib/types";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import ConversationHeader from "./components/ConversationHeader";
import MessageThread from "./components/MessageThread";
import Composer from "./components/Composer";
import EmptyLine from "./components/EmptyLine";

function ChatApp() {
  const { user, token, loading, logout } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!token) return;
    getRooms(token).then(setRooms).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token || activeRoomId === null) {
      setInitialMessages([]);
      return;
    }
    getRoomMessages(activeRoomId, token).then(setInitialMessages).catch(() => {});
  }, [activeRoomId, token]);

  useEffect(() => {
    if (user && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [user]);
  
  const { messages, activeUsers, connected, typingUser, sendMessage, sendTyping } = useRoomSocket(activeRoomId, token, initialMessages);

  async function handleCreateRoom(name: string) {
    if (!token) return;
    try {
      const room = await apiCreateRoom(name, token);
      setRooms((prev) => [room, ...prev]);
      setActiveRoomId(room.id);
    } catch {
      // room name likely taken, silently ignored for now, small polish item later
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas-blue relative overflow-hidden">
        <h2 className="font-sans text-[15rem] font-black uppercase tracking-tighter text-ink-alabaster opacity-10 leading-none text-center absolute">
          WAIT
        </h2>
        <p className="font-sans text-4xl font-black uppercase tracking-tighter text-accent-absinthe relative z-10 animate-pulse">Initializing...</p>
      </div>
    );
  }

  if (!user || !token) {
    return <AuthScreen />;
  }

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        rooms={rooms}
        activeRoomId={activeRoomId}
        onSelectRoom={setActiveRoomId}
        onCreateRoom={handleCreateRoom}
        username={user.username}
        onLogout={logout}
      />
      <div className="flex flex-1 flex-col">
        {activeRoom ? (
          <>
            <ConversationHeader roomName={activeRoom.name} activeUsers={activeUsers} connected={connected} />
            <MessageThread messages={messages} currentUserId={user.id} typingUser={typingUser} />
            <Composer onSend={sendMessage} onTyping={sendTyping} disabled={!connected} />
          </>
        ) : (
          <EmptyLine />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <ChatApp />
    </AuthProvider>
  );
}