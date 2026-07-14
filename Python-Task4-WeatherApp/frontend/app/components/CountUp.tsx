"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface CountUpProps {
  value: number;
  decimals?: number;
  className?: string;
}

export default function CountUp({ value, decimals = 1, className }: CountUpProps) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));
  const [rendered, setRendered] = useState("0.0");

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setRendered(v));
    return unsubscribe;
  }, [display]);

  return <motion.span className={className}>{rendered}</motion.span>;
}