"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe prefers-reduced-motion with live updates.
 *
 * framer-motion's useReducedMotion caches a *valueless* boolean media query
 * once per component mount ("(prefers-reduced-motion)"), which misses
 * emulated settings and never updates after mount. This hook queries the
 * explicit form and subscribes to changes. Starts false so SSR + first
 * client render match; flips right after mount.
 */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}
