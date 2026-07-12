"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FadeIn from "@/components/ui/FadeIn";
import AuroraPill from "@/components/ui/AuroraPill";

const TEXT =
  "With a master's in computer science and five years building software, i focus on agentic ai, computer vision, and full-stack systems. i love working with teams that want to stand out and ship something intelligent — let's build something incredible together!";

// Split once at module level — the string never changes.
const CHARS = TEXT.split("");

// Corner decoration slots: position/size + slide-in direction + stagger.
const DECOR = [
  {
    pos: "top-[4%] left-[1%] w-[clamp(120px,16vw,210px)] sm:left-[2%] md:left-[4%]",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
    x: -80,
    delay: 0.1,
  },
  {
    pos: "top-[4%] right-[1%] w-[clamp(120px,16vw,210px)] sm:right-[2%] md:right-[4%]",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
    x: 80,
    delay: 0.15,
  },
  {
    pos: "bottom-[8%] left-[3%] w-[clamp(100px,14vw,180px)] sm:left-[6%] md:left-[10%]",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
    x: -80,
    delay: 0.25,
  },
  {
    pos: "bottom-[8%] right-[3%] w-[clamp(130px,17vw,220px)] sm:right-[6%] md:right-[10%]",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
    x: 80,
    delay: 0.3,
  },
];

// The source art stays borderless and dissolves into the #0C0C0C section,
// rather than reading as four separate square image tiles.
const DECOR_FADE: CSSProperties = {
  WebkitMaskImage: "radial-gradient(ellipse 64% 64% at center, #000 34%, transparent 76%)",
  maskImage: "radial-gradient(ellipse 64% 64% at center, #000 34%, transparent 76%)",
};

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
      {DECOR.map((d) => (
        <FadeIn
          key={d.pos}
          x={d.x}
          delay={d.delay}
          className={`absolute aspect-square ${d.pos}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={d.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-contain opacity-90"
            style={DECOR_FADE}
          />
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
