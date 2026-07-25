"use client";

import { useCallback, useState } from "react";
import { sendCommand } from "./lib/api";
import { useSpeechRecognition } from "./lib/useSpeechRecognition";
import { useMicAmplitude } from "./lib/useMicAmplitude";
import { useSpeech } from "./lib/useSpeech";
import { generateId } from "./lib/generateId";
import type { ConversationEntry } from "./lib/types";
import Waveform from "./components/Waveform";
import ConversationLog from "./components/ConversationLog";
import MicButton from "./components/MicButton";

export default function Home() {
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const { speak, speaking } = useSpeech();

  const handleResult = useCallback(
    async (text: string) => {
      if (!text) return;

      setEntries((prev) => [
        ...prev,
        { id: generateId(), role: "user", text, timestamp: Date.now() },
      ]);

      setProcessing(true);
      try {
        const response = await sendCommand(text);
        setEntries((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            text: response.spoken_response,
            intentType: response.intent.intent_type,
            timestamp: Date.now(),
          },
        ]);
        speak(response.spoken_response);
      } catch {
        const errorText = "Something went wrong reaching the assistant.";
        setEntries((prev) => [
          ...prev,
          { id: generateId(), role: "assistant", text: errorText, timestamp: Date.now() },
        ]);
        speak(errorText);
      } finally {
        setProcessing(false);
      }
    },
    [speak]
  );

  const { listening, transcript, supported, start, stop } = useSpeechRecognition(handleResult);
  const amplitude = useMicAmplitude(listening);

  function handleMicClick() {
    if (listening) {
      stop();
    } else {
      start();
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-hairline px-8 py-6">
        <h1 className="font-display text-2xl font-semibold text-text-primary">Relay</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-text-tertiary">
          instrument no. 03
        </p>
      </header>

      <ConversationLog entries={entries} />

      <div className="flex flex-col items-center gap-4 border-t border-hairline px-8 py-8">
        <Waveform amplitude={amplitude} active={listening} speaking={speaking} />

        {!supported && (
          <p className="font-mono text-xs text-accent-alert">
            speech recognition isn't supported in this browser. try chrome.
          </p>
        )}

        <MicButton listening={listening} onClick={handleMicClick} disabled={!supported || processing} />

        <p className="font-mono text-xs text-text-tertiary">
          {listening
            ? transcript || "listening..."
            : processing
            ? "thinking..."
            : "tap to talk"}
        </p>
      </div>
    </div>
  );
}