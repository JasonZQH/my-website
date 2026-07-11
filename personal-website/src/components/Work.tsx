"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";

const FEATURED = {
  range: "May 2025 — Dec 2025",
  title: "Tradgent",
  desc: "An AI-powered trading recommendation system delivering real-time, personalized insights. Built on FastAPI + Pydantic-AI with MongoDB and Redis; a conversational AI advisor surfaces live guidance and risk alerts.",
  tags: ["FastAPI", "Pydantic-AI", "MongoDB", "Redis"],
};

const PROJECTS = [
  {
    num: "02",
    range: "Sep 2024 — Jan 2025",
    title: "EmojiCamera",
    desc: "Real-time facial-expression detection mapped to emojis. MobileNetV3 + attention hit 75% accuracy — co-authored a paper on lightweight FER models for low-cost compute.",
    tags: ["MobileNetV3", "Computer Vision", "Publication"],
    hover: "rgba(255,46,147,.4)",
  },
  {
    num: "03",
    range: "Mar 2024 — May 2024",
    title: "Flight Subscription Service",
    desc: "A flight-deal alert platform integrating real-time flight APIs. Users subscribe to deals and searches; built with React, Node.js, and MySQL for performance at scale.",
    tags: ["React", "Node.js", "MySQL"],
    hover: "rgba(123,92,255,.4)",
  },
  {
    num: "04",
    range: "Jan 2024 — Apr 2024",
    title: "Advanced Car Bidding System",
    desc: "A real-time car-auction platform with secure auth and dynamic bidding. Django + React + MySQL, Docker-deployed on GCP — improved usability, security, and scale.",
    tags: ["Django", "GCP", "Docker"],
    hover: "rgba(36,211,238,.4)",
  },
  {
    num: "05",
    range: "Sep 2022 — Dec 2022",
    title: "Vaccine Stock Forecast",
    desc: "Time-series forecasting (ARIMA / SARIMA) on Pfizer, J&J, and Moderna during COVID-19, trained on CDC data — a study in the limits of pandemic-only financial signals.",
    tags: ["ARIMA", "Time Series", "Forecasting"],
    hover: "rgba(255,90,60,.4)",
  },
];

function FeaturedCard() {
  const tiltRef = useTilt<HTMLAnchorElement>();
  return (
    <motion.a
      ref={tiltRef}
      href="#work"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.8 }}
      className="block relative rounded-[26px] overflow-hidden border border-white/10 p-8 sm:p-11 mb-6 text-[#F4EEE3] transition-colors hover:border-white/[.28]"
      style={{ background: "linear-gradient(140deg,rgba(255,90,60,.16),rgba(123,92,255,.16))" }}
    >
      <div className="relative flex justify-between items-start gap-5 flex-wrap">
        <div className="max-w-[640px]">
          <div className="flex items-center gap-3 mb-[18px]">
            <span className="font-mono text-xs text-[#0B0711] bg-[#B8FF39] px-3 py-[5px] rounded-full font-bold">
              FEATURED
            </span>
            <span className="font-mono text-xs text-[#8FE7F5]">{FEATURED.range}</span>
          </div>
          <h3 className="font-display font-extrabold text-[clamp(28px,3.4vw,42px)] leading-[1.02] tracking-[-.02em]">
            {FEATURED.title}
          </h3>
          <p className="text-[#D4CEDD] text-[17px] leading-relaxed mt-3.5">{FEATURED.desc}</p>
          <div className="flex flex-wrap gap-2 mt-[22px]">
            {FEATURED.tags.map((t) => (
              <span key={t} className="font-mono text-xs border border-white/20 px-3 py-[5px] rounded-full text-[#C9C2D4]">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="font-display font-extrabold text-[64px] text-white/[.14] leading-none">01</div>
      </div>
    </motion.a>
  );
}

function ProjectCard({ project, delay }: { project: (typeof PROJECTS)[number]; delay: number }) {
  const tiltRef = useTilt<HTMLAnchorElement>();
  return (
    <motion.a
      ref={tiltRef}
      href="#work"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.8, delay }}
      className="block relative rounded-[22px] bg-[#130C1F] border border-white/[.08] p-8 text-[#F4EEE3] overflow-hidden transition-colors hover:[border-color:var(--hover-c)]"
      style={{ "--hover-c": project.hover } as React.CSSProperties}
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-[#8FE7F5]">{project.range}</span>
        <span className="font-display font-extrabold text-[34px] text-white/[.12]">{project.num}</span>
      </div>
      <h3 className="font-display font-extrabold text-2xl mt-3.5 leading-[1.05]">{project.title}</h3>
      <p className="text-[#C9C2D4] text-[15px] leading-relaxed mt-3">{project.desc}</p>
      <div className="flex flex-wrap gap-[7px] mt-[18px]">
        {project.tags.map((t) => (
          <span key={t} className="font-mono text-[11px] border border-white/[.18] px-2.5 py-1 rounded-full text-[#B7AFC2]">
            {t}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

export default function Work() {
  return (
    <section id="work" className="scroll-mt-[90px] bg-[#0B0711] text-[#F4EEE3] px-6 sm:px-10 pt-10 pb-[130px]">
      <div className="max-w-[1160px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between gap-6 mb-14 flex-wrap"
        >
          <div>
            <div className="font-mono text-xs tracking-[.24em] uppercase text-[#FF2E93] mb-4">/ selected work</div>
            <h2 className="font-display font-extrabold text-[clamp(34px,4.8vw,60px)] leading-none tracking-[-.02em]">
              Projects &amp; publications
            </h2>
          </div>
          <div className="font-mono text-[13px] text-[#8B8397] max-w-[280px]">
            Real-time AI, computer vision, and full-stack systems.
          </div>
        </motion.div>

        <FeaturedCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={i % 2 === 1 ? 0.08 : 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
