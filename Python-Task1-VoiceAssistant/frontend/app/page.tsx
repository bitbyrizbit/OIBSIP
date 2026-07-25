"use client";

import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendCommand, getFiredReminders } from "./lib/api";
import { useSpeechRecognition } from "./lib/useSpeechRecognition";
import { useMicAmplitude } from "./lib/useMicAmplitude";
import { useSpeech } from "./lib/useSpeech";
import { generateId } from "./lib/generateId";
import type { ConversationEntry } from "./lib/types";

import CentralOrb from "./components/CentralOrb";
import SpatialTranscript from "./components/SpatialTranscript";
import FloatingLog from "./components/FloatingLog";
import SleekControlPanel from "./components/SleekControlPanel";

export default function Home() {
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [controlOpen, setControlOpen] = useState(false);
  const { speak, speaking } = useSpeech();

  // Retro alert tone for reminders
  const playAlertTone = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      osc.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.3); // E6

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext blocked
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
            text: `Reminder: ${r.content}`,
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
        const errorText = "I couldn't process that. Try again.";
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

  function handleToggleListening() {
    if (listening) {
      stop();
    } else {
      start();
    }
  }

  return (
    <div className="flex h-screen flex-col bg-black text-white" style={{ position: "relative", overflow: "hidden" }}>
      
      {/* Dynamic Central AI Orb */}
      <CentralOrb 
        listening={listening}
        speaking={speaking}
        processing={processing}
        amplitude={amplitude}
        onClick={handleToggleListening}
      />

      {/* Immediate real-time transcript over the orb */}
      <SpatialTranscript transcript={transcript} listening={listening} />

      {/* Header / Nav */}
      <header style={{
        position: "absolute", top: 0, left: 0, right: 0, padding: "32px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1 className="font-sans" style={{ fontSize: "1.2rem", fontWeight: 500, margin: 0, letterSpacing: "-0.02em" }}>
            Relay
          </h1>
          {!supported && (
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "10px" }}>
              Speech recognition not supported in this browser
            </span>
          )}
        </div>

        <button
          onClick={() => setControlOpen(true)}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
            fontFamily: "var(--font-inter)", fontSize: "0.85rem", fontWeight: 500,
            color: "#FFFFFF", backdropFilter: "blur(10px)", transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
        >
          Settings
        </button>
      </header>

      {/* Minimal Floating Log (only shows recent Assistant messages) */}
      <FloatingLog entries={entries} />

      {/* Minimal Mic Toggle Button (bottom center) */}
      <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
        <AnimatePresence mode="wait">
          {!listening ? (
            <motion.button
              key="start"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleListening}
              disabled={!supported || processing}
              style={{
                width: "64px", height: "64px", borderRadius: "32px",
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(20px)", color: "#FFFFFF", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: (!supported || processing) ? 0.5 : 1,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </motion.button>
          ) : (
            <motion.button
              key="stop"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleListening}
              style={{
                width: "64px", height: "64px", borderRadius: "32px",
                background: "#FFFFFF", color: "#000000", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none", boxShadow: "0 0 30px rgba(255,255,255,0.3)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect width="8" height="8" x="8" y="8" rx="1" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <SleekControlPanel open={controlOpen} onClose={() => setControlOpen(false)} />
    </div>
  );
}