import type { AssistantResponse, CustomCommand, Reminder } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendCommand(text: string): Promise<AssistantResponse> {
  const response = await fetch(`${BASE_URL}/api/assistant/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(body.detail ?? "Something went wrong");
  }
  return response.json();
}

export async function getFiredReminders(): Promise<Reminder[]> {
  const response = await fetch(`${BASE_URL}/api/assistant/reminders/fired`);
  if (!response.ok) return [];
  return response.json();
}

export async function getPendingReminders(): Promise<Reminder[]> {
  const response = await fetch(`${BASE_URL}/api/assistant/reminders/pending`);
  if (!response.ok) return [];
  return response.json();
}

export async function getCustomCommands(): Promise<CustomCommand[]> {
  const response = await fetch(`${BASE_URL}/api/assistant/custom-commands`);
  if (!response.ok) return [];
  return response.json();
}

export async function addCustomCommand(trigger: string, response_text: string): Promise<CustomCommand> {
  const response = await fetch(`${BASE_URL}/api/assistant/custom-commands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trigger, response: response_text }),
  });
  if (!response.ok) throw new Error("Failed to add custom command");
  return response.json();
}

export async function deleteCustomCommand(id: string): Promise<void> {
  await fetch(`${BASE_URL}/api/assistant/custom-commands/${id}`, { method: "DELETE" });
}