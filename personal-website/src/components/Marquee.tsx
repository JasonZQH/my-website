"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { motion, useMotionValue } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { CAPABILITIES } from "@/components/capability/CapabilityArt";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ROW_ONE = CAPABILITIES.slice(0, 6);
const ROW_TWO = CAPABILITIES.slice(6);

function CapabilityRow({ items, startIndex }: { items: typeof CAPABILITIES; startIndex: number }) {
  return (
    <>
      {items.concat(items, items).map((capability, index) => (
        <article
          key={`${capability.id}-${index}`}
          aria-hidden={index >= items.length || undefined}
          className="tech-card capability-card marquee-capability-card"
          style={{ "--art-accent": capability.accent } as CSSProperties}
        >
          <div className="capability-card-media">
            <Image
              src={capability.src}
              alt={capability.alt}
              fill
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 360px, 250px"
              className="object-cover"
            />
            <div aria-hidden="true" className="card-vignette" />
            <span aria-hidden="true" className="capability-index">
              {String(startIndex + (index % items.length) + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="capability-card-label">
            <span aria-hidden="true" className="capability-dot" />
            <h3>{capability.label}</h3>
          </div>
        </article>
      ))}
    </>
  );
}

/** Two scroll-scrubbed capability belts using the new static tech-art studies. */
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
      aria-labelledby="capabilities-title"
      className="scroll-mt-20 overflow-hidden pb-[clamp(84px,9vw,128px)] pt-[clamp(96px,11vw,160px)]"
    >
      <div className="mx-auto max-w-[1200px] px-[clamp(16px,3vw,32px)]">
        <FadeIn y={32}>
          <div className="mb-[clamp(30px,4vw,52px)] flex flex-wrap items-end justify-between gap-4 px-1">
            <div>
              <p className="font-mono text-[.66rem] uppercase tracking-[.24em] text-[#8B9298]">Selected systems</p>
              <h2 id="capabilities-title" className="steel-text mt-2 text-[clamp(2.7rem,7vw,6.2rem)] font-black uppercase leading-[.86] tracking-[-.03em]">
                Capabilities
              </h2>
            </div>
            <p className="max-w-[34ch] text-[.86rem] font-light leading-[1.55] text-[rgba(215,226,234,.58)] sm:text-right">
              Systems thinking, rendered as a quiet collection of physical-digital studies.
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="space-y-3">
        <motion.div
          className="capability-marquee-row flex gap-3 will-change-transform"
          style={{ x: reduce ? -200 : xOne }}
        >
          <CapabilityRow items={ROW_ONE} startIndex={0} />
        </motion.div>
        <motion.div
          className="capability-marquee-row flex gap-3 will-change-transform"
          style={{ x: reduce ? 200 : xTwo }}
        >
          <CapabilityRow items={ROW_TWO} startIndex={6} />
        </motion.div>
      </div>
    </section>
  );
}
