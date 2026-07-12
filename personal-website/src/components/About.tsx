"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FadeIn from "@/components/ui/FadeIn";
import AuroraPill from "@/components/ui/AuroraPill";

const TEXT =
  "i move between product, systems, and ai without treating them as separate disciplines. i'm drawn to ambiguous problems, fast feedback, and ideas that only become clear once they are made. i adapt when the evidence changes, question familiar patterns, and care equally about how a product works and how it feels.";

// Split once at module level — the string never changes.
const CHARS = TEXT.split("");

// Corner decoration slots: position/size + slide-in direction + stagger.
const DECOR = [
  {
    pos: "top-[4%] left-[1%] w-[clamp(120px,16vw,210px)] sm:left-[2%] md:left-[4%]",
    src: "/assets/about/moon.png",
    x: -80,
    delay: 0.1,
  },
  {
    pos: "top-[4%] right-[1%] w-[clamp(120px,16vw,210px)] sm:right-[2%] md:right-[4%]",
    src: "/assets/about/lego.png",
    x: 80,
    delay: 0.15,
  },
  {
    pos: "bottom-[8%] left-[3%] w-[clamp(100px,14vw,180px)] sm:left-[6%] md:left-[10%]",
    src: "/assets/about/p59.png",
    x: -80,
    delay: 0.25,
  },
  {
    pos: "bottom-[8%] right-[3%] w-[clamp(130px,17vw,220px)] sm:right-[6%] md:right-[10%]",
    src: "/assets/about/badge.png",
    x: 80,
    delay: 0.3,
  },
];

// The source art stays borderless and dissolves into the liquid page surface,
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

      {/* Screen readers get the plain text via the sr-only span — aria-label on a
          <p> is ignored (the paragraph role prohibits naming), so it can't carry it. */}
      <p
        ref={pRef}
        className="relative z-[1] max-w-[560px] mx-auto font-medium leading-[1.7] text-[#D7E2EA] text-[clamp(1rem,2vw,1.35rem)]"
      >
        {reduce ? (
          TEXT
        ) : (
          <>
            <span className="sr-only">{TEXT}</span>
            <span aria-hidden="true">
              {CHARS.map((char, i) => (
                <Char key={i} char={char} index={i} progress={scrollYProgress} />
              ))}
            </span>
          </>
        )}
      </p>

      <FadeIn y={20} delay={0.12} className="mt-[clamp(48px,7vw,88px)]">
        <AuroraPill href="#contact">Contact Me</AuroraPill>
      </FadeIn>
    </section>
  );
}
