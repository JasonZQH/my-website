"use client";

import { useEffect, useRef, useState, type ComponentType, type PointerEvent } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FadeIn from "@/components/ui/FadeIn";
import ImageSlot from "@/components/ui/ImageSlot";
import { CURATOR_PANELS } from "@/components/projects/CuratorPanels";
import { EMOJICAM_PANELS } from "@/components/projects/EmojiCamPanels";
import { PASSENGER_PANELS } from "@/components/projects/PassengerPanels";

type ProjectVisual = {
  id: string;
  type: "product" | "system" | "editorial";
  alt: string;
  /** Path under public/. Omitted until the Stage-2 art lands — wells render placeholder art. */
  asset?: string;
};

type ProjectCardData = {
  id: string;
  /** Eyebrow line; the big 01/02/03 numeral is derived from card order. */
  metadata: string;
  title: string;
  hook: string;
  role: string;
  /** Up to four rendered. */
  tags: string[];
  status?: string;
  /** No href + disabled → non-interactive pill (private repos must not link out). */
  cta: { label: string; href?: string; disabled?: boolean };
  theme: { surface: string; accent: string; mood: string[] };
  visuals: [ProjectVisual, ProjectVisual, ProjectVisual];
};

const PROJECTS: ProjectCardData[] = [
  {
    id: "curator",
    metadata: "Personal Product / Agent Systems · 2026",
    title: "CURATOR",
    hook: "A local-first workbench that makes coding-agent collaboration inspectable, reviewable, and resumable.",
    role: "Product concept · orchestration architecture · CLI/TUI implementation",
    tags: ["Python", "Textual", "Pydantic", "SQLite"],
    status: "Active development",
    cta: { label: "Private repository", disabled: true },
    theme: {
      surface: "rgba(23,27,24,.8)",
      accent: "#57E39B",
      mood: ["controlled", "dense", "auditable", "mechanical"],
    },
    visuals: [
      {
        id: "scheduler-loop",
        type: "system",
        alt: "CURATOR scheduler loop from writer to verifier to reviewer to human gate, with retry, pause, revise-scope, stop and resume branches",
      },
      {
        id: "evidence-ledger",
        type: "product",
        alt: "CURATOR evidence ledger table listing run, provider, verification, evidence hash, decision and checkpoint",
      },
      {
        id: "workbench",
        type: "product",
        alt: "Reconstructed CURATOR workbench TUI: writer, verifier, reviewer and human-gate rows with live run statuses",
      },
    ],
  },
  {
    id: "emojicam",
    metadata: "Team Project / Computer Vision · 2024",
    title: "EmojiCam",
    hook: "A real-time expression-recognition experience that translates facial emotion into immediate emoji suggestions.",
    role: "Team project · model training & CV pipeline · web app development",
    tags: ["TensorFlow", "OpenCV", "MobileNet", "React"],
    status: "FER2013 + RAF-DB · 7 classes",
    cta: {
      label: "View on GitHub",
      href: "https://github.com/JasonZQH/EmojiCam-Facial-Expression-Detection-AI",
    },
    theme: {
      surface: "rgba(31,28,41,.8)",
      accent: "#B7A7EA",
      mood: ["human", "responsive", "expressive", "playful"],
    },
    visuals: [
      {
        id: "emoji-response",
        type: "product",
        alt: "Recommended emoji with confidence score above a simplified mobile messaging surface",
      },
      {
        id: "emotion-spectrum",
        type: "system",
        alt: "Spectrum of EmojiCam's seven expression classes with the active emotion highlighted",
      },
      {
        id: "live-expression",
        type: "product",
        alt: "Synthetic face with landmark overlay and live expression probabilities from the EmojiCam classifier",
      },
    ],
  },
  {
    id: "yourpassenger",
    metadata: "Personal Product / Mobile AI · 2026",
    title: "YourPassenger",
    hook: "A voice-first AI companion designed to turn time on the road into natural, continuous conversation.",
    role: "Product design · SwiftUI client · NestJS backend · realtime interaction architecture",
    tags: ["SwiftUI", "NestJS", "WebSocket", "Voice AI"],
    status: "MVP in development",
    cta: { label: "Private project", disabled: true },
    theme: {
      surface: "rgba(17,22,36,.8)",
      accent: "#EBB268",
      mood: ["calm", "spatial", "conversational", "quietly intelligent"],
    },
    visuals: [
      {
        id: "session-memory",
        type: "editorial",
        alt: "Saved session card summarizing 37 minutes of conversation topics and a next-time reminder",
      },
      {
        id: "conversation-road",
        type: "editorial",
        alt: "Editorial road line with conversation topics and preference settings appearing along the route",
      },
      {
        id: "live-voice",
        type: "product",
        alt: "YourPassenger live voice screen over a blurred night road, cycling listening, thinking and speaking states",
      },
    ],
  },
];

const WELL_RADIUS = "rounded-[clamp(24px,3vw,60px)]";

// Coded Stage-2 panels per project, in well order [small, wide, tall].
// A visual with an `asset` path falls back to ImageSlot instead.
const PANELS: Record<string, readonly [ComponentType, ComponentType, ComponentType]> = {
  curator: CURATOR_PANELS,
  emojicam: EMOJICAM_PANELS,
  yourpassenger: PASSENGER_PANELS,
};

function PanelWell({
  project,
  slot,
  variant,
  className,
}: {
  project: ProjectCardData;
  slot: 0 | 1 | 2;
  variant: number;
  className: string;
}) {
  const visual = project.visuals[slot];
  const Panel = PANELS[project.id]?.[slot];
  if (Panel && !visual.asset) {
    return (
      <div role="img" aria-label={visual.alt} className={`relative overflow-hidden ${className}`}>
        <Panel />
        <div aria-hidden="true" className="texture-grain absolute inset-0" />
      </div>
    );
  }
  return <ImageSlot src={visual.asset} alt={visual.alt} variant={variant} className={className} />;
}

const CTA_BASE =
  "inline-flex whitespace-nowrap rounded-full border-2 px-[clamp(22px,2.4vw,34px)] py-[11px] text-[clamp(.7rem,1vw,.95rem)] font-medium uppercase tracking-[.14em]";

function ProjectCard({
  project,
  index,
  count,
  progress,
}: {
  project: ProjectCardData;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const reduce = usePrefersReducedMotion();
  const targetScale = 1 - (count - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / count, 1], [1, targetScale]);
  const num = String(index + 1).padStart(2, "0");
  const linked = project.cta.href && !project.cta.disabled;

  // The sticky stack is a desktop treatment: on mobile the cards are taller
  // than the viewport, so a stuck card would hide its bottom panel. Below the
  // sm breakpoint they fall back to normal flow (no sticky, no top, no scale).
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setStacked(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // EmojiCam only: horizontal cursor position picks the expression zone
  // (0 neutral / 1 happy / 2 surprise); panels crossfade via [data-zone].
  const zoned = project.id === "emojicam";
  const [zone, setZone] = useState(1);
  const trackZone = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setZone(x < 0.34 ? 0 : x < 0.67 ? 1 : 2);
  };

  return (
    <>
      <motion.div
        className="relative will-change-transform sm:sticky sm:h-[72vh] sm:min-h-[540px]"
        style={{
          top: stacked ? `calc(clamp(1.5rem, 3vw, 2rem) + ${index * 28}px)` : undefined,
          zIndex: index + 1,
          scale: reduce || !stacked ? 1 : scale,
          transformOrigin: "top center",
        }}
      >
        <article
          className="group flex h-full flex-col rounded-[clamp(32px,4vw,60px)] border-2 border-[#D7E2EA] backdrop-blur-xl p-[clamp(16px,2.2vw,32px)]"
          style={{ background: project.theme.surface }}
          data-zone={zoned ? zone : undefined}
          onPointerMove={zoned && !reduce ? trackZone : undefined}
          onPointerLeave={zoned ? () => setZone(1) : undefined}
        >
          <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-3 px-[clamp(4px,1vw,12px)]">
            <FadeIn y={16} className="flex items-baseline gap-[clamp(14px,2vw,28px)]">
              <span className="steel-text font-black leading-[.8] text-[clamp(2.4rem,7vw,92px)]">{num}</span>
              <div>
                <div className="text-[clamp(.66rem,1vw,.88rem)] uppercase tracking-[.16em] text-[#8B9298]">
                  {project.metadata}
                </div>
                <h3 className="mt-1 text-[clamp(1.3rem,3vw,2.4rem)] font-semibold leading-[1.05]">
                  {project.title}
                </h3>
              </div>
            </FadeIn>
            <FadeIn y={16} delay={0.28} className="flex flex-col items-start gap-2 sm:items-end">
              {linked ? (
                <a
                  href={project.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${CTA_BASE} border-[#D7E2EA] text-[#D7E2EA] transition hover:bg-[rgba(215,226,234,.1)] group-hover:-translate-y-0.5 motion-reduce:transform-none`}
                >
                  {project.cta.label}
                </a>
              ) : (
                <span
                  className={`${CTA_BASE} select-none border-dashed border-[rgba(215,226,234,.4)] text-[rgba(215,226,234,.55)]`}
                >
                  {project.cta.label}
                </span>
              )}
              {project.status && (
                <span className="inline-flex items-center gap-2 text-[clamp(.6rem,.85vw,.78rem)] uppercase tracking-[.18em] text-[#8B9298]">
                  <span
                    aria-hidden="true"
                    className="h-[7px] w-[7px] rounded-full"
                    style={{ background: project.theme.accent }}
                  />
                  {project.status}
                </span>
              )}
            </FadeIn>
          </div>

          <FadeIn y={14} delay={0.1}>
            <p className="mt-[clamp(10px,1.4vw,16px)] max-w-[62ch] px-[clamp(4px,1vw,12px)] font-light leading-[1.5] text-[rgba(215,226,234,.78)] text-[clamp(.92rem,1.5vw,1.2rem)]">
              {project.hook}
            </p>
          </FadeIn>

          <FadeIn
            y={14}
            delay={0.18}
            className="mt-[clamp(10px,1.4vw,16px)] mb-[clamp(14px,2vw,24px)] flex flex-wrap items-center justify-between gap-x-5 gap-y-3 px-[clamp(4px,1vw,12px)]"
          >
            <div className="text-[clamp(.62rem,.9vw,.8rem)] uppercase tracking-[.14em] text-[#8B9298]">
              {project.role}
            </div>
            <ul className="flex flex-wrap gap-2">
              {project.tags.slice(0, 4).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-[rgba(215,226,234,.18)] px-3 py-1 text-[clamp(.6rem,.8vw,.74rem)] uppercase tracking-[.12em] text-[rgba(215,226,234,.7)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </FadeIn>

          <motion.div
            className="flex min-h-0 flex-1 flex-col items-stretch gap-[clamp(10px,1.4vw,18px)] sm:flex-row"
            initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex min-h-0 flex-row gap-[clamp(10px,1.4vw,18px)] sm:flex-[0_0_40%] sm:flex-col">
              <PanelWell
                project={project}
                slot={0}
                variant={index * 3}
                className={`aspect-[16/10] min-h-0 flex-1 sm:aspect-auto sm:flex-[0_0_40%] ${WELL_RADIUS}`}
              />
              <PanelWell
                project={project}
                slot={1}
                variant={index * 3 + 1}
                className={`aspect-[16/10] min-h-0 flex-1 sm:aspect-auto ${WELL_RADIUS}`}
              />
            </div>
            <PanelWell
              project={project}
              slot={2}
              variant={index * 3 + 2}
              className={`order-first aspect-[4/3] min-h-0 w-full sm:order-none sm:aspect-auto sm:w-auto sm:flex-1 ${WELL_RADIUS} transition duration-300 group-hover:brightness-[1.06]`}
            />
          </motion.div>
        </article>
      </motion.div>
      {index < count - 1 && <div aria-hidden="true" className="h-6 sm:h-[13vh] sm:min-h-[96px]" />}
    </>
  );
}

export default function Work() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      className="relative z-[3] -mt-[clamp(40px,5vw,56px)] scroll-mt-20 rounded-t-[clamp(40px,5vw,60px)] bg-[rgba(24,22,31,.58)] backdrop-blur-md px-[clamp(16px,3vw,32px)] pb-5 pt-[clamp(90px,11vw,150px)]"
    >
      <div className="mx-auto max-w-[1200px]">
        <FadeIn y={40}>
          <h2 className="steel-text mb-[clamp(36px,5vw,60px)] text-center text-[clamp(3rem,12vw,150px)] font-black uppercase leading-none tracking-[-.02em]">
            Project
          </h2>
        </FadeIn>
        <div ref={stackRef}>
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              count={PROJECTS.length}
              progress={scrollYProgress}
            />
          ))}
          <div aria-hidden="true" className="h-10 sm:h-[30vh] sm:min-h-[240px]" />
        </div>
      </div>
    </section>
  );
}
