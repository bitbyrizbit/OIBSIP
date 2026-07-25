"use client";

import { motion } from "framer-motion";

interface TransmitBarProps {
  listening: boolean;
  speaking: boolean;
  processing: boolean;
  amplitude: number;
  onClick: () => void;
  disabled?: boolean;
  transcript: string;
}

export default function TransmitBar({
  listening,
  speaking,
  processing,
  amplitude,
  onClick,
  disabled,
  transcript,
}: TransmitBarProps) {
  const statusText = listening
    ? transcript || "transmitting..."
    : processing
    ? "relay processing..."
    : speaking
    ? "relay speaking..."
    : "hold to transmit";

  const isActive = listening || speaking || processing;

  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "40px 10vw",
      background: "linear-gradient(to top, rgba(13, 10, 7, 1) 50%, transparent)",
      zIndex: 10,
    }}>
      
      {/* Signal line — the breathing line above the button */}
      <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "32px" }}>
        
        <div style={{ width: "160px", flexShrink: 0, textAlign: "right" }}>
          <span style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: isActive ? "#E8A94B" : "rgba(240, 232, 213, 0.2)",
            transition: "color 0.4s",
          }}>
            {statusText}
          </span>
        </div>

        {/* The signal line */}
        <div style={{ flex: 1, height: "1px", position: "relative", overflow: "visible" }}>
          {/* Base line */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(240, 232, 213, 0.08)",
          }} />

          {/* Animated amplitude wave when listening */}
          {listening && (
            <svg
              style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", width: "100%", overflow: "visible" }}
              height="40"
              viewBox="0 0 400 40"
              preserveAspectRatio="none"
            >
              <motion.path
                d={generateWavePath(amplitude)}
                stroke="#E8A94B"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                animate={{ d: generateWavePath(amplitude) }}
                transition={{ duration: 0.1, ease: "linear" }}
                opacity={0.8}
              />
            </svg>
          )}

          {/* Speaking shimmer */}
          {speaking && (
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, transparent, #7EC8A8, transparent)",
                height: "1px",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
      </div>

      {/* The TRANSMIT bar — not a circle. A horizontal bar. Like a push-to-talk. */}
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <div style={{ width: "160px", flexShrink: 0 }} />
        
        <motion.button
          onClick={onClick}
          disabled={disabled}
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1,
            height: "52px",
            background: listening
              ? "rgba(232, 169, 75, 0.12)"
              : "rgba(240, 232, 213, 0.04)",
            border: listening
              ? "1px solid rgba(232, 169, 75, 0.4)"
              : "1px solid rgba(240, 232, 213, 0.1)",
            borderRadius: "2px",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            transition: "all 0.3s ease",
            opacity: disabled ? 0.4 : 1,
          }}
        >
          <span style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: listening ? "#E8A94B" : "rgba(240, 232, 213, 0.4)",
            transition: "color 0.3s",
          }}>
            {listening ? "release to send" : "transmit"}
          </span>

          {/* Indicator dots — like a VU meter */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {[0.3, 0.5, 0.7, 1.0, 0.7, 0.5, 0.3].map((h, i) => (
              <motion.div
                key={i}
                style={{
                  width: "2px",
                  height: `${h * 18}px`,
                  background: listening ? "#E8A94B" : "rgba(240, 232, 213, 0.15)",
                  borderRadius: "1px",
                  transition: "background 0.3s",
                }}
                animate={listening ? {
                  scaleY: [1, 0.3 + Math.random() * 0.7, 1],
                  opacity: [0.6, 1, 0.6],
                } : { scaleY: 1, opacity: 1 }}
                transition={listening ? {
                  duration: 0.4 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                } : {}}
              />
            ))}
          </div>
        </motion.button>
      </div>
    </div>
  );
}

function generateWavePath(amplitude: number): string {
  const points: string[] = [];
  const segments = 20;
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * 400;
    const y = 20 + Math.sin((i / segments) * Math.PI * 4) * amplitude * 15;
    points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }
  return points.join(" ");
}
