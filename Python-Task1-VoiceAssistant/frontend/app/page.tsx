"use client";

import { useCallback, useState, useEffect } from "react";
import { sendCommand, getFiredReminders } from "./lib/api";
import { useSpeechRecognition } from "./lib/useSpeechRecognition";
import { useMicAmplitude } from "./lib/useMicAmplitude";
import { useSpeech } from "./lib/useSpeech";
import { generateId } from "./lib/generateId";
import type { ConversationEntry } from "./lib/types";
import TransmissionLog from "./components/TransmissionLog";
import TransmitBar from "./components/TransmitBar";
import ControlPanel from "./components/ControlPanel";

export default function Home() {
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);
  const { speak, speaking } = useSpeech();

  // Play a retro alert tone using Web Audio API when a reminder fires
  const playAlertTone = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = "sine";
      // Arpeggio
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      osc.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.3); // E6

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext blocked or not supported
    }
  }, []);

  // Poll for fired reminders
  useEffect(() => {
    const interval = setInterval(async () => {
      const fired = await getFiredReminders();
      if (fired.length > 0) {
        playAlertTone();
        setEntries((prev) => [
          ...prev,
          ...fired.map((r) => ({
            id: generateId(),
            role: "relay" as const,
            text: `[ALERT] Reminder: "${r.content}" has triggered!`,
            intentType: "reminder" as const,
            timestamp: Date.now(),
          })),
        ]);
        fired.forEach((r) => {
          speak(`Reminder alert: ${r.content}`);
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [playAlertTone, speak]);

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
        
        // Stop listening session if user told assistant to exit/stop
        if (response.data?.stop) {
          stop();
        }

        setEntries((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "relay",
            text: response.spoken_response,
            intentType: response.intent.intent_type,
            timestamp: Date.now(),
            data: response.data,
          },
        ]);
        speak(response.spoken_response);
      } catch {
        const errorText = "Static on the line. Speak into the transmitter again.";
        setEntries((prev) => [
          ...prev,
          { id: generateId(), role: "relay", text: errorText, timestamp: Date.now() },
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
    <div className="flex h-screen flex-col bg-[#0D0A07]" style={{ position: "relative", overflow: "hidden" }}>
      {/* Navigation / Header */}
      <header style={{
        padding: "32px 10vw",
        borderBottom: "1px solid rgba(240, 232, 213, 0.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "1.8rem", fontStyle: "italic", margin: 0, color: "#F0E8D5" }}>
            Relay
          </h1>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem", color: "rgba(240, 232, 213, 0.25)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "4px" }}>
            instrument no. 03
          </p>
        </div>

        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button
            onClick={() => setControlOpen(true)}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem", letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#E8A94B", transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#F0E8D5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#E8A94B"; }}
          >
            control panel
          </button>
          
          <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "12px" }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                style={{
                  width: "2px",
                  height: `${level * 2}px`,
                  background: supported ? "#7EC8A8" : "rgba(240, 232, 213, 0.1)",
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Conversation Log */}
      <TransmissionLog entries={entries} />

      {/* Transmit Bar / Speech Controls */}
      <TransmitBar
        listening={listening}
        speaking={speaking}
        processing={processing}
        amplitude={amplitude}
        onClick={handleMicClick}
        disabled={!supported || processing}
        transcript={transcript}
      />

      {/* Control Panel overlay for custom commands/reminders */}
      <ControlPanel open={controlOpen} onClose={() => setControlOpen(false)} />
    </div>
  );
}