import { useEffect, useRef, useState, useCallback } from "react";
import { getWebSocketUrl } from "./api";
import type { Message, WSEnvelope } from "./types";

export function useRoomSocket(roomId: number | null, token: string | null, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      type RoomEnvelope = WSEnvelope | { type: "typing"; payload: { username: string } };
      const envelope = JSON.parse(event.data) as RoomEnvelope;

      if (envelope.type === "message") {
        const incoming = envelope.payload as Message;
        setMessages((prev) => [...prev, incoming]);
        setTypingUser(null);

        if (document.hidden && Notification.permission === "granted") {
          new Notification(`${incoming.sender_username} on the line`, {
            body: incoming.content,
            icon: "/favicon.ico",
          });
        }
      }

      if (envelope.type === "presence") {
        setActiveUsers(envelope.payload.active_users as string[]);
      }

      if (envelope.type === "typing") {
        setTypingUser(envelope.payload.username as string);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2500);
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

  const sendTyping = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "typing", payload: {} }));
    }
  }, []);

  return { messages, activeUsers, connected, typingUser, sendMessage, sendTyping };
}