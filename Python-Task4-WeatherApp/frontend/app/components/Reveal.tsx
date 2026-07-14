"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  masked?: boolean;
}

export default function Reveal({ children, delay = 0, className, masked = true }: RevealProps) {
  if (masked) {
    return (
      <div className={`overflow-hidden ${className || ""}`}>
        <motion.div
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 1.2, delay, type: "spring", bounce: 0, damping: 25, stiffness: 120 }}
          style={{ transformOrigin: "bottom" }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}