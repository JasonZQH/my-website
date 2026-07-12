"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FadeIn from "@/components/ui/FadeIn";
import ImageSlot from "@/components/ui/ImageSlot";

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
        id: "workbench",
        type: "product",
        alt: "Reconstructed CURATOR workbench TUI: writer, verifier, reviewer and human-gate rows with live run statuses",
      },
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
        id: "live-expression",
        type: "product",
        alt: "Synthetic face with landmark overlay and live expression probabilities from the EmojiCam classifier",
      },
      {
        id: "emotion-spectrum",
        type: "system",
        alt: "Spectrum of EmojiCam's seven expression classes with the active emotion highlighted",
      },
      {
        id: "emoji-response",
        type: "product",
        alt: "Recommended emoji with confidence score above a simplified mobile messaging surface",
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
        id: "live-voice",
        type: "product",
        alt: "YourPassenger live voice screen over a blurred night road, cycling listening, thinking and speaking states",
      },
      {
        id: "conversation-road",
        type: "editorial",
        alt: "Editorial road line with conversation topics and preference settings appearing along the route",
      },
      {
        id: "session-memory",
        type: "editorial",
        alt: "Saved session card summarizing 37 minutes of conversation topics and a next-time reminder",
      },
    ],
  },
];

const WELL_RADIUS = "rounded-[clamp(24px,3vw,60px)]";

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

  return (
    <>
      <motion.div
        className="sticky h-[72vh] min-h-[540px] will-change-transform"
        style={{
          top: `calc(clamp(1.5rem, 3vw, 2rem) + ${index * 28}px)`,
          zIndex: index + 1,
          scale: reduce ? 1 : scale,
          transformOrigin: "top center",
        }}
      >
        <article
          className="flex h-full flex-col rounded-[clamp(32px,4vw,60px)] border-2 border-[#D7E2EA] backdrop-blur-xl p-[clamp(16px,2.2vw,32px)]"
          style={{ background: project.theme.surface }}
        >
          <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-3 px-[clamp(4px,1vw,12px)]">
            <div className="flex items-baseline gap-[clamp(14px,2vw,28px)]">
              <span className="steel-text font-black leading-[.8] text-[clamp(2.4rem,7vw,92px)]">{num}</span>
              <div>
                <div className="text-[clamp(.66rem,1vw,.88rem)] uppercase tracking-[.16em] text-[#8B9298]">
                  {project.metadata}
                </div>
                <h3 className="mt-1 text-[clamp(1.3rem,3vw,2.4rem)] font-semibold leading-[1.05]">
                  {project.title}
                </h3>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              {linked ? (
                <a
                  href={project.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${CTA_BASE} border-[#D7E2EA] text-[#D7E2EA] transition-colors hover:bg-[rgba(215,226,234,.1)]`}
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
            </div>
          </div>

          <p className="mt-[clamp(10px,1.4vw,16px)] max-w-[62ch] px-[clamp(4px,1vw,12px)] font-light leading-[1.5] text-[rgba(215,226,234,.78)] text-[clamp(.92rem,1.5vw,1.2rem)]">
            {project.hook}
          </p>

          <div className="mt-[clamp(10px,1.4vw,16px)] mb-[clamp(14px,2vw,24px)] flex flex-wrap items-center justify-between gap-x-5 gap-y-3 px-[clamp(4px,1vw,12px)]">
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
          </div>

          <div className="flex min-h-0 flex-1 items-stretch gap-[clamp(10px,1.4vw,18px)]">
            <div className="flex min-h-0 flex-[0_0_40%] flex-col gap-[clamp(10px,1.4vw,18px)]">
              <ImageSlot
                src={project.visuals[0].asset}
                alt={project.visuals[0].alt}
                variant={index * 3}
                className={`min-h-0 flex-[0_0_40%] ${WELL_RADIUS}`}
              />
              <ImageSlot
                src={project.visuals[1].asset}
                alt={project.visuals[1].alt}
                variant={index * 3 + 1}
                className={`min-h-0 flex-1 ${WELL_RADIUS}`}
              />
            </div>
            <ImageSlot
              src={project.visuals[2].asset}
              alt={project.visuals[2].alt}
              variant={index * 3 + 2}
              className={`min-h-0 flex-1 ${WELL_RADIUS}`}
            />
          </div>
        </article>
      </motion.div>
      {index < count - 1 && <div aria-hidden="true" className="h-[13vh] min-h-[96px]" />}
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
          <div aria-hidden="true" className="h-[30vh] min-h-[240px]" />
        </div>
      </div>
    </section>
  );
}
