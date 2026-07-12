"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FadeIn from "@/components/ui/FadeIn";
import AuroraPill from "@/components/ui/AuroraPill";
import ImageSlot from "@/components/ui/ImageSlot";

const TEXT =
  "With a master's in computer science and five years building software, i focus on agentic ai, computer vision, and full-stack systems. i love working with teams that want to stand out and ship something intelligent — let's build something incredible together!";

// Split once at module level — the string never changes.
const CHARS = TEXT.split("");

// Corner decoration slots: position/size + slide-in direction + stagger.
const DECOR = [
  { pos: "top-[5%] left-[3%] w-[clamp(86px,14vw,200px)]", x: -80, delay: 0 },
  { pos: "top-[5%] right-[3%] w-[clamp(86px,14vw,200px)]", x: 80, delay: 0.08 },
  { pos: "bottom-[7%] left-[6%] w-[clamp(76px,12vw,176px)]", x: -80, delay: 0.16 },
  { pos: "bottom-[7%] right-[6%] w-[clamp(86px,13vw,190px)]", x: 80, delay: 0.24 },
];

/**
 * One character of the scrub paragraph. A subcomponent because useTransform
 * is a hook — it can't be called in a loop inside the parent render.
 */
function Char({
  char,
  index,
  progress,
}: {
  char: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [index / CHARS.length, Math.min(1, (index + 1) / CHARS.length)],
    [0.5, 1]
  );
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

export default function About() {
  const pRef = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: pRef,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <section
      id="about"
      className="scroll-mt-20 relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden py-[clamp(90px,12vw,150px)] px-6"
    >
      {DECOR.map((d, i) => (
        <FadeIn
          key={d.pos}
          x={d.x}
          delay={d.delay}
          className={`absolute aspect-square ${d.pos}`}
        >
          <ImageSlot alt="" variant={i} className="w-full h-full rounded-[26px]" />
        </FadeIn>
      ))}

      <FadeIn y={40}>
        <h2 className="steel-text font-black uppercase tracking-[-.02em] leading-none text-[clamp(3rem,12vw,150px)] mb-[clamp(28px,5vw,54px)]">
          About me
        </h2>
      </FadeIn>

      <p
        ref={pRef}
        aria-label={TEXT}
        className="relative z-[1] max-w-[560px] mx-auto font-medium leading-[1.7] text-[#D7E2EA] text-[clamp(1rem,2vw,1.35rem)]"
      >
        {reduce ? (
          TEXT
        ) : (
          <span aria-hidden="true">
            {CHARS.map((char, i) => (
              <Char key={i} char={char} index={i} progress={scrollYProgress} />
            ))}
          </span>
        )}
      </p>

      <FadeIn y={20} delay={0.12} className="mt-[clamp(48px,7vw,88px)]">
        <AuroraPill href="#contact">Contact Me</AuroraPill>
      </FadeIn>
    </section>
  );
}
