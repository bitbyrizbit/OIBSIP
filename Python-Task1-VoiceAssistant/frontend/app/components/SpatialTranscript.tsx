"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SpatialTranscriptProps {
  transcript: string;
  listening: boolean;
}

export default function SpatialTranscript({ transcript, listening }: SpatialTranscriptProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "0",
        right: "0",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
        padding: "0 10vw",
      }}
    >
      <AnimatePresence mode="wait">
        {listening && transcript && (
          <motion.div
            key={transcript} // forces re-animation on word change if we wanted, but we use layout
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(20px)", transition: { duration: 0.8 } }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{
              textAlign: "center",
            }}
          >
            <h2
              className="font-sans font-medium"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                textShadow: "0 4px 30px rgba(0,0,0,0.5)",
                mixBlendMode: "difference", // Makes it punch through the bright orb beautifully
              }}
            >
              {transcript}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
