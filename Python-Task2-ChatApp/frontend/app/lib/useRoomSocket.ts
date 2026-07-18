import { useEffect, useRef, useState, useCallback } from "react";
import { getWebSocketUrl } from "./api";
import type { Message, WSEnvelope } from "./types";

export function useRoomSocket(roomId: number | null, token: string | null, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (roomId === null || !token) return;

    const ws = new WebSocket(getWebSocketUrl(roomId, token));
    socketRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const envelope: WSEnvelope = JSON.parse(event.data);

      if (envelope.type === "message") {
        setMessages((prev) => [...prev, envelope.payload as Message]);
      }

      if (envelope.type === "presence") {
        setActiveUsers(envelope.payload.active_users as string[]);
      }
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [roomId, token]);

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "message", payload: { content } }));
    }
  }, []);

  return { messages, activeUsers, connected, sendMessage };
}