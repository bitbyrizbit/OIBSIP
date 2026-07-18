import type { Message, Room, User } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: response.statusText }));
    throw new ApiError(response.status, body.detail ?? "Something went wrong");
  }

  return response.json();
}

export function register(username: string, email: string, password: string): Promise<User> {
  return request<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function login(username: string, password: string): Promise<{ access_token: string }> {
  return request<{ access_token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getMe(token: string): Promise<User> {
  return request<User>("/api/auth/me", {}, token);
}

export function getRooms(token: string): Promise<Room[]> {
  return request<Room[]>("/api/rooms", {}, token);
}

export function createRoom(name: string, token: string): Promise<Room> {
  return request<Room>("/api/rooms", { method: "POST", body: JSON.stringify({ name }) }, token);
}

export function getRoomMessages(roomId: number, token: string): Promise<Message[]> {
  return request<Message[]>(`/api/rooms/${roomId}/messages`, {}, token);
}

export function getWebSocketUrl(roomId: number, token: string): string {
  const wsBase = BASE_URL!.replace(/^http/, "ws");
  return `${wsBase}/ws/rooms/${roomId}?token=${token}`;
}