"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Card = {
  index: string;
  label: string;
  background: string;
};

const CARDS: Card[] = [
  {
    index: "01",
    label: "Agentic AI",
    background:
      "radial-gradient(130% 90% at 12% 0%, var(--acc2, #B600A8), transparent 56%), radial-gradient(120% 100% at 92% 100%, var(--acc3, #7621B0), transparent 56%), #0F0A16",
  },
  {
    index: "02",
    label: "Computer Vision",
    background:
      "radial-gradient(120% 90% at 90% 4%, var(--acc4, #BE4C00), transparent 56%), radial-gradient(120% 100% at 6% 100%, var(--acc2, #B600A8), transparent 56%), #0F0A16",
  },
  {
    index: "03",
    label: "Full-Stack",
    background:
      "radial-gradient(120% 120% at 0% 50%, var(--acc3, #7621B0), transparent 56%), radial-gradient(120% 120% at 100% 50%, var(--acc4, #BE4C00), transparent 56%), #0F0A16",
  },
  {
    index: "04",
    label: "Backend Systems",
    background:
      "radial-gradient(150% 100% at 50% 0%, var(--acc2, #B600A8), transparent 60%), radial-gradient(120% 90% at 50% 100%, var(--acc4, #BE4C00), transparent 52%), #0F0A16",
  },
  {
    index: "05",
    label: "Data Science",
    background:
      "radial-gradient(120% 100% at 16% 92%, var(--acc4, #BE4C00), transparent 56%), radial-gradient(120% 100% at 86% 8%, var(--acc3, #7621B0), transparent 56%), #0F0A16",
  },
];

const CARDS_REVERSED: Card[] = [...CARDS].reverse();

function CapabilityCard({ card }: { card: Card }) {
  return (
    <div
      className="relative flex-none w-[clamp(300px,28vw,440px)] h-[clamp(200px,19vw,290px)] overflow-hidden rounded-[22px] border border-[rgba(215,226,234,.1)]"
      style={{ background: card.background }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 flex items-end justify-between gap-3 p-[clamp(16px,2vw,26px)]"
        style={{ background: "linear-gradient(to top, rgba(8,5,12,.72), transparent)" }}
      >
        <div className="font-semibold uppercase tracking-[.01em] text-[clamp(1.05rem,1.9vw,1.7rem)] text-[#F3F6F9] leading-[1.05]">
          {card.label}
        </div>
        <div className="font-extrabold text-[clamp(1.5rem,2.6vw,2.3rem)] text-[rgba(255,255,255,.38)] leading-[.8]">
          {card.index}
        </div>
      </div>
    </div>
  );
}

/**
 * v3 capabilities band: two rows of accent-gradient cards that scrub
 * horizontally with the section's progress through the viewport
 * (row 1 sweeps left→right, row 2 mirrors it). Not an auto-ticker.
 */
export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const [metrics, setMetrics] = useState({ row1: 0, row2: 0, section: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const measure = () => {
      setMetrics({
        row1: row1Ref.current?.scrollWidth ?? 0,
        row2: row2Ref.current?.scrollWidth ?? 0,
        section: sectionRef.current?.clientWidth ?? 0,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Prototype math: s = overflow, amp = (s/2)*0.85, center = -s/2.
  // s = 0 (rows fit) collapses both ranges to [0, 0] → static rows.
  const s1 = Math.max(0, metrics.row1 - metrics.section);
  const amp1 = (s1 / 2) * 0.85;
  const center1 = -s1 / 2;
  const s2 = Math.max(0, metrics.row2 - metrics.section);
  const amp2 = (s2 / 2) * 0.85;
  const center2 = -s2 / 2;

  const x1 = useTransform(scrollYProgress, [0, 1], [center1 - amp1, center1 + amp1]);
  const x2 = useTransform(scrollYProgress, [0, 1], [center2 + amp2, center2 - amp2]);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Capabilities"
      className="scroll-mt-[80px] overflow-hidden pt-[clamp(64px,9vw,120px)] pb-[clamp(44px,6vw,72px)]"
    >
      <motion.div
        ref={row1Ref}
        className="flex gap-4 px-2 will-change-transform"
        style={{ x: reduce ? center1 : x1 }}
      >
        {CARDS.map((card) => (
          <CapabilityCard key={card.index} card={card} />
        ))}
      </motion.div>
      <motion.div
        ref={row2Ref}
        aria-hidden="true"
        className="mt-4 flex gap-4 px-2 will-change-transform"
        style={{ x: reduce ? center2 : x2 }}
      >
        {CARDS_REVERSED.map((card) => (
          <CapabilityCard key={card.index} card={card} />
        ))}
      </motion.div>
    </section>
  );
}
