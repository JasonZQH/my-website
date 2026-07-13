"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CAPABILITIES } from "@/components/capability/CapabilityPosters";

const ROW_ONE = CAPABILITIES.slice(0, 6);
const ROW_TWO = CAPABILITIES.slice(6);

function CapabilityRow({ items }: { items: typeof CAPABILITIES }) {
  return (
    <>
      {items.concat(items, items).map((cap, index) => (
        <div
          key={`${cap.id}-${index}`}
          aria-hidden={index >= items.length || undefined}
          className="relative h-[clamp(160px,18vw,270px)] w-[clamp(250px,28vw,420px)] flex-none overflow-hidden rounded-2xl bg-[#292530] shadow-[0_18px_40px_rgba(9,8,15,.22)]"
        >
          <cap.Poster />
          <div aria-hidden="true" className="texture-grain absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-[rgba(9,8,15,.78)] via-[rgba(9,8,15,.32)] to-transparent px-4 pb-[10px] pt-7">
            <span
              aria-hidden="true"
              className="h-[6px] w-[6px] flex-none rounded-full"
              style={{ background: cap.accent }}
            />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[.16em] text-[rgba(215,226,234,.72)]">
              {cap.label}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Two scroll-scrubbed capability belts. Each tile is a coded poster — the
 * static key frame of a Stage-3 loop; the belts keep the template's
 * scroll-driven horizontal movement (×3 duplication keeps the scrub seamless).
 */
export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const xOne = useMotionValue(-200);
  const xTwo = useMotionValue(200);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - top + window.innerHeight) * 0.3;
      xOne.set(offset - 200);
      xTwo.set(-(offset - 200));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [xOne, xTwo]);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      aria-label="Capability gallery"
      className="scroll-mt-20 overflow-hidden pt-[clamp(96px,11vw,160px)] pb-[clamp(84px,9vw,128px)]"
    >
      <motion.div className="flex gap-3 will-change-transform" style={{ x: reduce ? -200 : xOne }}>
        <CapabilityRow items={ROW_ONE} />
      </motion.div>
      <motion.div className="mt-3 flex gap-3 will-change-transform" style={{ x: reduce ? 200 : xTwo }}>
        <CapabilityRow items={ROW_TWO} />
      </motion.div>
    </section>
  );
}
