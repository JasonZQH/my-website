"use client";

import { useEffect, useRef } from "react";

/**
 * v3 magnetic hover: while the cursor is within `padding` px of the element's
 * box, translate the element toward the cursor by delta/strength; on leave,
 * ease back to rest. No-op under prefers-reduced-motion.
 */
export function useMagnetic<T extends HTMLElement>({ strength = 3, padding = 150 } = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.willChange = "transform";
    let active = false;

    const handleMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const within =
        e.clientX > r.left - padding &&
        e.clientX < r.right + padding &&
        e.clientY > r.top - padding &&
        e.clientY < r.bottom + padding;
      if (within) {
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transition = "transform .3s ease-out";
        el.style.transform = `translate3d(${dx / strength}px,${dy / strength}px,0)`;
        active = true;
      } else if (active) {
        el.style.transition = "transform .6s ease-in-out";
        el.style.transform = "translate3d(0,0,0)";
        active = false;
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [strength, padding]);

  return ref;
}
