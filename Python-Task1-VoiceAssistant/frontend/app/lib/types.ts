export type IntentType =
  | "greeting"
  | "time"
  | "date"
  | "weather"
  | "web_search"
  | "reminder"
  | "email"
  | "general_question"
  | "unknown";

export interface ParsedIntent {
  intent_type: IntentType;
  confidence: number;
  parameters: Record<string, any>;
  original_text: string;
}

export interface AssistantResponse {
  intent: ParsedIntent;
  spoken_response: string;
  data: Record<string, any>;
}

export interface ConversationEntry {
  id: string;
  role: "user" | "assistant";
  text: string;
  intentType?: IntentType;
  timestamp: number;
}