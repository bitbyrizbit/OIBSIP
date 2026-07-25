"use client";

import { motion } from "framer-motion";

interface CentralOrbProps {
  listening: boolean;
  speaking: boolean;
  processing: boolean;
  amplitude: number;
  onClick: () => void;
}

export default function CentralOrb({
  listening,
  speaking,
  processing,
  amplitude,
  onClick,
}: CentralOrbProps) {
  // Base size of the orb
  const baseSize = 240;
  // Dynamic scale based on amplitude when listening
  const activeScale = 1 + amplitude * 1.5;
  const scale = listening ? activeScale : processing ? 1.1 : speaking ? 1.2 : 1;

  // Visual states
  let animationClass = "animate-[orb-breathe_8s_ease-in-out_infinite]";
  let bgGradient = "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 40%, rgba(0,0,0,0) 70%)";
  let opacity = 0.4;

  if (listening) {
    animationClass = ""; // We control scale manually via amplitude
    bgGradient = "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(0,0,0,0) 80%)";
    opacity = 0.8 + amplitude * 0.2;
  } else if (processing) {
    animationClass = "animate-[orb-breathe_2s_ease-in-out_infinite]";
    bgGradient = "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 40%, rgba(0,0,0,0) 70%)";
    opacity = 0.6;
  } else if (speaking) {
    animationClass = "animate-[orb-speak_4s_linear_infinite]";
    bgGradient = "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.2) 60%, rgba(0,0,0,0) 80%)";
    opacity = 1;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <motion.div
        className={animationClass}
        animate={{ scale, opacity }}
        transition={{ type: "spring", damping: 15, stiffness: 100, mass: 0.5 }}
        style={{
          width: baseSize,
          height: baseSize,
          background: bgGradient,
          borderRadius: "50%",
          filter: "blur(60px)",
          willChange: "transform, filter, opacity",
        }}
      />
      
      {/* Click target (invisible but clickable over the orb center) */}
      <div 
        onClick={onClick}
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}
