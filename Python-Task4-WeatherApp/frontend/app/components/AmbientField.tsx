"use client";

import { motion } from "framer-motion";
import { isStormCondition } from "../lib/copy";

interface AmbientFieldProps {
  condition: string | null;
}

export default function AmbientField({ condition }: AmbientFieldProps) {
  if (!condition) {
    return null;
  }

  if (isStormCondition(condition)) {
    return <RainField />;
  }

  if (condition === "Clear") {
    return <GlowField />;
  }

  return <DriftField />;
}

function RainField() {
  const lines = Array.from({ length: 24 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.07]">
      {lines.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-32 w-px bg-accent-storm"
          style={{
            left: `${(i * 4.3) % 100}%`,
            top: "-10%",
            rotate: "12deg",
          }}
          animate={{ y: ["0vh", "120vh"] }}
          transition={{
            duration: 2.4 + (i % 5) * 0.3,
            repeat: Infinity,
            ease: "linear",
            delay: (i % 7) * 0.4,
          }}
        />
      ))}
    </div>
  );
}

function GlowField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/3 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(184,131,74,0.10) 0%, rgba(184,131,74,0) 70%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function DriftField() {
  const bands = Array.from({ length: 4 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.05]">
      {bands.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-24 w-[60vw] rounded-full blur-3xl bg-text-secondary"
          style={{ top: `${10 + i * 22}%`, left: "-30%" }}
          animate={{ x: ["0vw", "140vw"] }}
          transition={{
            duration: 40 + i * 8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 6,
          }}
        />
      ))}
    </div>
  );
}