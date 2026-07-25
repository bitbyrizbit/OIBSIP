export type IntentType =
  | "greeting"
  | "time"
  | "date"
  | "weather"
  | "web_search"
  | "reminder"
  | "email"
  | "general_question"
  | "custom_command"
  | "stop"
  | "unknown";

export interface ParsedIntent {
  intent_type: IntentType;
  confidence: number;
  parameters: Record<string, unknown>;
  original_text: string;
}

export interface AssistantResponse {
  intent: ParsedIntent;
  spoken_response: string;
  data: Record<string, unknown>;
}

export interface ConversationEntry {
  id: string;
  role: "user" | "relay";
  text: string;
  intentType?: IntentType;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface Reminder {
  id: string;
  content: string;
  trigger_at: string;
  fired: boolean;
}

export interface CustomCommand {
  id: string;
  trigger: string;
  response: string;
}