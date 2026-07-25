import type { AssistantResponse } from "./types";

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