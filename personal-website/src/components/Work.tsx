"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FadeIn from "@/components/ui/FadeIn";
import ImageSlot from "@/components/ui/ImageSlot";

type Project = {
  category: string;
  title: string;
  href: string;
  slug: string;
  images: { a: string; b: string; c: string };
};

const PROJECTS: Project[] = [
  {
    category: "Client",
    title: "Nextlevel Studio",
    href: "#contact",
    slug: "nextlevel-studio",
    images: {
      a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      c: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    },
  },
  {
    category: "Personal",
    title: "Aura Brand Identity",
    href: "#contact",
    slug: "aura-brand-identity",
    images: {
      a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      c: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    },
  },
  {
    category: "Client",
    title: "Solaris Digital",
    href: "#contact",
    slug: "solaris-digital",
    images: {
      a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      c: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    },
  },
];

const WELL_RADIUS = "rounded-[clamp(24px,3vw,60px)]";

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
  const targetScale = 1 - (count - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / count, 1], [1, targetScale]);
  const num = String(index + 1).padStart(2, "0");

  return (
    <>
      <motion.div
        className="sticky h-[72vh] min-h-[500px] will-change-transform"
        style={{
          top: `calc(clamp(1.5rem, 3vw, 2rem) + ${index * 28}px)`,
          zIndex: index + 1,
          scale: reduce ? 1 : scale,
          transformOrigin: "top center",
        }}
      >
        <article className="flex h-full flex-col rounded-[clamp(32px,4vw,60px)] border-2 border-[#D7E2EA] bg-[rgba(28,25,36,.78)] backdrop-blur-xl p-[clamp(16px,2.2vw,32px)]">
          <div className="mb-[clamp(16px,2.2vw,26px)] flex flex-wrap items-start justify-between gap-5 px-[clamp(4px,1vw,12px)]">
            <div className="flex items-baseline gap-[clamp(14px,2vw,28px)]">
              <span className="steel-text font-black leading-[.8] text-[clamp(2.4rem,7vw,92px)]">{num}</span>
              <div>
                <div className="text-[clamp(.66rem,1vw,.88rem)] uppercase tracking-[.16em] text-[#8B9298]">
                  {project.category}
                </div>
                <h3 className="mt-1 text-[clamp(1.3rem,3vw,2.4rem)] font-semibold leading-[1.05]">
                  {project.title}
                </h3>
              </div>
            </div>
            <a
              href={project.href}
              className="inline-flex whitespace-nowrap rounded-full border-2 border-[#D7E2EA] px-[clamp(22px,2.4vw,34px)] py-[11px] text-[clamp(.7rem,1vw,.95rem)] font-medium uppercase tracking-[.14em] text-[#D7E2EA] transition-colors hover:bg-[rgba(215,226,234,.1)]"
            >
              Live Project
            </a>
          </div>
          <div className="flex min-h-0 flex-1 items-stretch gap-[clamp(10px,1.4vw,18px)]">
            <div className="flex min-h-0 flex-[0_0_40%] flex-col gap-[clamp(10px,1.4vw,18px)]">
              <ImageSlot src={project.images.a} alt={`${project.title} project image one`} className={`min-h-0 flex-[0_0_40%] ${WELL_RADIUS}`} />
              <ImageSlot src={project.images.b} alt={`${project.title} project image two`} className={`min-h-0 flex-1 ${WELL_RADIUS}`} />
            </div>
            <ImageSlot
              src={project.images.c}
              alt={`${project.title} project image three`}
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
              key={project.slug}
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
