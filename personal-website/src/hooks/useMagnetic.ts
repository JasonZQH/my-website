"use client";

import { useEffect, useRef } from "react";

/**
 * Smooth magnetic hover. Pointer movement only updates the destination; a
 * requestAnimationFrame loop eases the element toward it so it never snaps
 * when the browser coalesces pointer events.
 */
export function useMagnetic<T extends HTMLElement>({ strength = 3, padding = 150 } = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame: number | null = null;

    const animate = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      el.style.transform = `translate3d(${currentX.toFixed(2)}px,${currentY.toFixed(2)}px,0)`;

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frame = window.requestAnimationFrame(animate);
      } else {
        currentX = targetX;
        currentY = targetY;
        frame = null;
      }
    };

    const requestAnimation = () => {
      if (frame === null) {
        el.style.willChange = "transform";
        frame = window.requestAnimationFrame(animate);
      }
    };

    const handleMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const within =
        e.clientX > r.left - padding &&
        e.clientX < r.right + padding &&
        e.clientY > r.top - padding &&
        e.clientY < r.bottom + padding;
      if (within) {
        targetX = (e.clientX - (r.left + r.width / 2)) / strength;
        targetY = (e.clientY - (r.top + r.height / 2)) / strength;
      } else {
        targetX = 0;
        targetY = 0;
      }
      requestAnimation();
    };

    // Pointer events stop when the cursor leaves the window or the tab blurs;
    // without these the element stays frozen at its last displaced offset.
    const reset = () => {
      targetX = 0;
      targetY = 0;
      requestAnimation();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      if (frame !== null) window.cancelAnimationFrame(frame);
      el.style.willChange = "";
      el.style.transform = "";
    };
  }, [strength, padding]);

  return ref;
}
