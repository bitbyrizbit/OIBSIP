"use client";

import { motion } from "framer-motion";

interface MicButtonProps {
  listening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function MicButton({ listening, onClick, disabled }: MicButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      {listening && (
        <motion.div
          className="absolute h-20 w-20 rounded-full bg-accent-signal/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.92 }}
        className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300 ${
          listening ? "bg-accent-signal text-background" : "bg-surface-raised text-text-primary"
        } disabled:opacity-40`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
          <path
            d="M5 10v1a7 7 0 0014 0v-1M12 18v3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>
    </div>
  );
}