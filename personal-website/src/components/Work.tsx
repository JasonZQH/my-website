"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ProjectCardData = {
  id: string;
  metadata: string;
  title: string;
  hook: string;
  role: string;
  tags: string[];
  status?: string;
  cta: { label: string; href?: string; disabled?: boolean };
  theme: { surface: string; accent: string };
  art: { src: string; alt: string; caption: string };
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
    theme: { surface: "#171B18", accent: "#57E39B" },
    art: {
      src: "/assets/cards/projects/curator-tech-art-v1.webp",
      alt: "A layered smoked-glass agent workbench with a mint orchestration route ending at an amber human approval gate.",
      caption: "Evidence route · human gate",
    },
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
    theme: { surface: "#111624", accent: "#EBB268" },
    art: {
      src: "/assets/cards/projects/yourpassenger-tech-art-v1.webp",
      alt: "A warm companion signal travels alongside a calm blue-black route through a spatial field.",
      caption: "Continuous companion signal",
    },
  },
  {
    id: "emojicam",
    metadata: "Team Project / Computer Vision · 2024",
    title: "EmojiCam",
    hook: "A real-time expression-recognition experience that translates facial emotion into immediate emoji suggestions.",
    role: "Team project · model training & CV pipeline · web app development",
    tags: ["TensorFlow", "OpenCV", "MobileNet", "React"],
    status: "FER2013 + RAF-DB · 7 classes",
    cta: { label: "View on GitHub", href: "https://github.com/JasonZQH/EmojiCam-Facial-Expression-Detection-AI" },
    theme: { surface: "#1B1824", accent: "#B7A7EA" },
    art: {
      src: "/assets/cards/projects/emojicam-tech-art-v1.webp",
      alt: "A tall smoked-glass prism refracting a subtle spectrum into a warm expressive signal.",
      caption: "Signal spectrum · live response",
    },
  },
];

const CTA_BASE =
  "inline-flex w-fit rounded-full border px-5 py-3 text-[.68rem] font-medium uppercase tracking-[.15em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

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
  const linked = project.cta.href && !project.cta.disabled;
  const number = String(index + 1).padStart(2, "0");

  return (
    <>
      <motion.div
        className="project-motion-card relative sticky will-change-transform lg:h-[72vh] lg:min-h-[580px]"
        style={{
          top: `calc(clamp(1.5rem, 3vw, 2rem) + ${index * 28}px)`,
          zIndex: index + 1,
          scale: reduce ? 1 : scale,
          transformOrigin: "top center",
        }}
      >
        <article
          className="project-card h-full"
          style={
            {
              "--project-surface": project.theme.surface,
              "--art-accent": project.theme.accent,
            } as CSSProperties
          }
        >
          <div className="project-card-media">
            <Image
              src={project.art.src}
              alt={project.art.alt}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="card-vignette project-card-vignette" />
            <p className="project-art-caption">{project.art.caption}</p>
          </div>

          <div className="project-card-content">
            <div className="flex items-start justify-between gap-5">
              <span className="steel-text project-number">{number}</span>
              {project.status && (
                <span className="project-status">
                  <span aria-hidden="true" />
                  {project.status}
                </span>
              )}
            </div>

            <div className="mt-6">
              <p className="project-metadata">{project.metadata}</p>
              <h3 className="mt-2 text-[clamp(2rem,4.2vw,4.25rem)] font-semibold leading-[.9] tracking-[-.04em] text-[#F4F1F0]">
                {project.title}
              </h3>
              <p className="mt-5 max-w-[50ch] text-[clamp(1rem,1.45vw,1.16rem)] font-light leading-[1.58] text-[rgba(215,226,234,.78)]">
                {project.hook}
              </p>
            </div>

            <div className="mt-7 border-t border-[rgba(215,226,234,.14)] pt-5">
              <p className="max-w-[50ch] text-[.7rem] uppercase tracking-[.14em] text-[#8B9298]">{project.role}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag} className="project-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              {linked ? (
                <a
                  href={project.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${CTA_BASE} border-[color:var(--art-accent)] text-[#D7E2EA] hover:bg-[color:var(--art-accent)] hover:text-[#121013]`}
                >
                  {project.cta.label}
                </a>
              ) : (
                <span className={`${CTA_BASE} cursor-default border-dashed border-[rgba(215,226,234,.34)] text-[rgba(215,226,234,.54)]`}>
                  {project.cta.label}
                </span>
              )}
            </div>
          </div>
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
      aria-labelledby="projects-title"
      className="relative z-[3] -mt-[clamp(24px,4vw,48px)] scroll-mt-20 rounded-t-[clamp(40px,5vw,60px)] bg-[rgba(24,22,31,.7)] px-[clamp(16px,3vw,32px)] pb-[clamp(84px,10vw,140px)] pt-[clamp(90px,11vw,150px)] backdrop-blur-md"
    >
      <div className="mx-auto max-w-[1200px]">
        <FadeIn y={40}>
          <div className="mb-[clamp(38px,5vw,68px)] text-center">
            <p className="font-mono text-[.66rem] uppercase tracking-[.24em] text-[#8B9298]">Selected work</p>
            <h2 id="projects-title" className="steel-text mt-3 text-[clamp(3rem,12vw,150px)] font-black uppercase leading-none tracking-[-.03em]">
              Projects
            </h2>
          </div>
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
