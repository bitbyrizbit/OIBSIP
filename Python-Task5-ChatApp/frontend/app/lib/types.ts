export interface Room {
  id: number;
  name: string;
  created_by_id: number;
  created_at: string;
}

export interface Message {
  id: number;
  room_id: number;
  sender_id: number;
  sender_username: string;
  content: string;
  sent_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface WSEnvelope {
  type: "message" | "presence";
  payload: any;
}