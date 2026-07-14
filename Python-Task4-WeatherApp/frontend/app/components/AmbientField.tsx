"use client";

import { motion } from "framer-motion";
import { isStormCondition } from "../lib/copy";

interface AmbientFieldProps {
  condition: string | null;
}

export default function AmbientField({ condition }: AmbientFieldProps) {
  if (!condition) {
    return <IdleField />;
  }

  if (isStormCondition(condition)) {
    return <RainField />;
  }

  if (condition === "Clear") {
    return <GlowField />;
  }

  return <DriftField />;
}

function IdleField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[100vw] w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.02]"
        style={{
          background: "radial-gradient(circle, var(--color-text-primary) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.01, 0.03, 0.01] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function RainField() {
  const lines = Array.from({ length: 40 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#0B0B0A] to-[#0A0D10]">
      {/* Background Storm Clouds */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[150%] w-[150%] opacity-10 blur-[100px]"
        style={{ background: "radial-gradient(ellipse at center, var(--color-accent-storm-dim) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Rain Lines */}
      <div className="absolute inset-0 opacity-[0.15]">
        {lines.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] rounded-full bg-accent-storm"
            style={{
              left: `${(i * 3.7) % 100}%`,
              top: "-20%",
              rotate: "15deg",
              height: `${Math.random() * 20 + 20}vh`,
            }}
            animate={{ y: ["0vh", "130vh"], opacity: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 0.8 + 0.6,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GlowField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/4 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        style={{
          background: "radial-gradient(circle, var(--color-accent-brass) 0%, transparent 50%)",
          filter: "blur(120px)",
          opacity: 0.15,
        }}
        animate={{ 
          scale: [1, 1.1, 0.95, 1],
          y: ["-50%", "-45%", "-52%", "-50%"]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function DriftField() {
  const bands = Array.from({ length: 3 });
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {bands.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[50vh] w-[120vw] rounded-[100%] blur-[120px] bg-text-secondary opacity-[0.06] mix-blend-screen"
          style={{ top: `${-10 + i * 35}%`, left: "-20%" }}
          animate={{ x: ["-10vw", "30vw", "-10vw"] }}
          transition={{
            duration: 30 + i * 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * -5,
          }}
        />
      ))}
    </div>
  );
}