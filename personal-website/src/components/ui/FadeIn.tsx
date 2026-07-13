"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Seconds before the reveal starts once in view. */
  delay?: number;
  duration?: number;
  /** Starting offset — v3 fades slide in from a small translate. */
  x?: number;
  y?: number;
  amount?: number;
};

/**
 * v3 scroll reveal: opacity 0 + small translate → rest when ~in view.
 * Under prefers-reduced-motion, content renders directly in its resting state.
 */
export default function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.85,
  x = 0,
  y = 30,
  amount = 0.14,
}: Props) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reduce ? { duration: 0 } : { duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
