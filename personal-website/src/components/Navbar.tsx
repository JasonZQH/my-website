"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { NAV_LINKS } from "@/lib/navLinks";

/**
 * v3 reveal-on-scroll bar: hidden while the hero (with its own in-page nav)
 * is on screen; slides down once the user scrolls past ~80% of the viewport.
 */
export default function Navbar() {
  const [shown, setShown] = useState(false);
  const reduce = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setShown(v > window.innerHeight * 0.8);
  });

  return (
    <motion.nav
      aria-label="Site"
      inert={!shown}
      initial={false}
      animate={{ y: shown ? 0 : "-110%" }}
      transition={{ duration: reduce ? 0 : 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between backdrop-blur-xl bg-[rgba(28,25,37,.62)] border-b border-[rgba(235,232,242,.14)] py-[14px] px-[clamp(20px,4vw,44px)]"
    >
      {/* Wordmark hides on phones — four links won't fit beside it */}
      <a
        href="#top"
        className="hidden sm:block font-semibold uppercase tracking-[.16em] text-[clamp(.9rem,1.2vw,1.1rem)] text-[#D7E2EA] whitespace-nowrap"
      >
        Jason Zhang
      </a>
      <div className="flex items-center w-full justify-between sm:w-auto sm:justify-normal sm:gap-[clamp(16px,3vw,40px)]">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="font-medium uppercase tracking-[.1em] sm:tracking-[.14em] text-[10px] sm:text-[clamp(.72rem,1vw,.95rem)] text-[#D7E2EA] hover:opacity-65 transition-opacity"
          >
            {label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
