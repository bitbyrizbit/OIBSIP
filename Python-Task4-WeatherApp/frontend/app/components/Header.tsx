"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-8 md:px-16 md:py-12 border-b border-white/5 mix-blend-difference">
      <div className="flex items-baseline gap-4 group cursor-pointer">
        <motion.span 
          className="font-display text-2xl md:text-3xl tracking-tight text-text-primary"
          whileHover={{ textShadow: "0 0 12px rgba(255,255,255,0.4)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          Glass
        </motion.span>
        <span className="hidden font-sans text-xs uppercase tracking-widest text-text-secondary transition-colors duration-500 group-hover:text-text-primary md:inline">
          Version 01
        </span>
      </div>
      <nav className="font-mono text-xs uppercase tracking-widest text-text-secondary flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-brass animate-pulse"></span>
        <span>Atmospheric Observatory</span>
      </nav>
    </header>
  );
}