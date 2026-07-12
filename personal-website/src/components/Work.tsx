"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FadeIn from "@/components/ui/FadeIn";
import ImageSlot from "@/components/ui/ImageSlot";

type Project = {
  category: string;
  title: string;
  subtitle: string;
  href: string;
  slug: string;
  /**
   * Real shots go in public/projects/<slug>-{a,b,c}.webp and get wired by
   * filling these fields (e.g. a: "/projects/tradgent-a.webp"). Empty slots
   * render the on-brand gradient placeholder.
   */
  images: { a?: string; b?: string; c?: string };
};

const PROJECTS: Project[] = [
  {
    category: "AI System · 2025",
    title: "Tradgent",
    subtitle: "Real-time AI trading advisor — FastAPI · Pydantic-AI · MongoDB · Redis",
    href: "https://github.com/JasonZQH",
    slug: "tradgent",
    images: {},
  },
  {
    category: "Computer Vision · 2024",
    title: "EmojiCamera",
    subtitle: "Lightweight real-time facial-expression → emoji model (MobileNetV3)",
    href: "https://github.com/JasonZQH",
    slug: "emojicamera",
    images: {},
  },
  {
    category: "Full-Stack · 2024",
    title: "Flight Subscription Service",
    subtitle: "Flight-deal alerts on live APIs — React · Node.js · MySQL",
    href: "https://github.com/JasonZQH",
    slug: "flight-subscription",
    images: {},
  },
  {
    category: "Full-Stack · 2024",
    title: "Advanced Car Bidding System",
    subtitle: "Real-time auction platform — Django · React · GCP · Docker",
    href: "https://github.com/JasonZQH",
    slug: "car-bidding",
    images: {},
  },
  {
    category: "Data Science · 2022",
    title: "Vaccine Stock Forecast",
    subtitle: "ARIMA / SARIMA time-series study on pandemic-era pharma stocks",
    href: "https://github.com/JasonZQH",
    slug: "vaccine-forecast",
    images: {},
  },
];

const WELL_RADIUS = "rounded-[clamp(24px,3vw,44px)]";

function ProjectCard({
  project,
  index,
  count,
  progress,
}: {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const reduce = usePrefersReducedMotion();
  // As the next card scrolls over this one, recede toward 1 - (n-1-i) * 0.03.
  const scale = useTransform(progress, [index / count, 1], [1, 1 - (count - 1 - index) * 0.03]);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="h-[90vh]">
      <motion.div
        className="sticky will-change-transform"
        style={{
          top: 90 + index * 26,
          scale: reduce ? 1 : scale,
          transformOrigin: "top center",
        }}
      >
        <article className="border-2 border-[#D7E2EA] rounded-[clamp(32px,4vw,56px)] bg-[#0C0C0C] p-[clamp(18px,2.2vw,32px)]">
          <div className="flex justify-between items-start gap-5 flex-wrap mb-[clamp(16px,2.2vw,26px)] px-[clamp(4px,1vw,12px)]">
            <div className="flex items-baseline gap-[clamp(14px,2vw,28px)]">
              <span className="steel-text font-black leading-[.8] text-[clamp(2.4rem,7vw,92px)]">
                {num}
              </span>
              <div>
                <div className="uppercase tracking-[.16em] text-[#8B9298] text-[clamp(.66rem,1vw,.88rem)]">
                  {project.category}
                </div>
                <h3 className="font-semibold text-[clamp(1.3rem,3vw,2.4rem)] leading-[1.05] mt-1">
                  {project.title}
                </h3>
                <p className="font-light text-[rgba(215,226,234,.55)] text-[clamp(.82rem,1.3vw,1.05rem)] mt-1.5 max-w-[440px]">
                  {project.subtitle}
                </p>
              </div>
            </div>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-medium uppercase tracking-[.14em] text-[clamp(.7rem,1vw,.95rem)] text-[#D7E2EA] px-[clamp(22px,2.4vw,34px)] py-[11px] rounded-full border-2 border-[#D7E2EA] whitespace-nowrap transition-colors hover:bg-[rgba(215,226,234,.1)]"
            >
              View Project
            </a>
          </div>
          <div className="flex gap-[clamp(10px,1.4vw,18px)] items-stretch">
            <div className="flex-[0_0_40%] flex flex-col gap-[clamp(10px,1.4vw,18px)]">
              <ImageSlot
                src={project.images.a}
                alt={`${project.title} screenshot placeholder`}
                variant={index * 3}
                className={`h-[clamp(84px,10vw,150px)] ${WELL_RADIUS}`}
              />
              <ImageSlot
                src={project.images.b}
                alt={`${project.title} screenshot placeholder`}
                variant={index * 3 + 1}
                className={`h-[clamp(112px,14vw,205px)] ${WELL_RADIUS}`}
              />
            </div>
            <ImageSlot
              src={project.images.c}
              alt={`${project.title} screenshot placeholder`}
              variant={index * 3 + 2}
              className={`flex-1 min-h-[clamp(206px,25vw,373px)] ${WELL_RADIUS}`}
            />
          </div>
        </article>
      </motion.div>
    </div>
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
      className="scroll-mt-20 relative z-[3] bg-[#0C0C0C] px-[clamp(16px,3vw,32px)] pt-[clamp(70px,8vw,110px)] pb-5"
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeIn y={40}>
          <h2 className="steel-text font-black uppercase tracking-[-.02em] leading-none text-[clamp(3rem,12vw,150px)] text-center mb-[clamp(36px,5vw,60px)]">
            Projects
          </h2>
        </FadeIn>
        <div ref={stackRef}>
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              count={PROJECTS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
