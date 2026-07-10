"use client";

import { motion } from "framer-motion";

const ITEMS = [
  {
    range: "2025.09 — 2025.12",
    title: "Teaching Assistant",
    org: "Northeastern University",
    desc: "TA for CS5610: Web Development.",
    from: "#FF5A3C",
    to: "#FF2E93",
  },
  {
    range: "2025.06 — 2025.08",
    title: "Backend SWE Intern",
    org: "XPerf",
    desc: "Engineered the backend of an AI-powered bookkeeping app with Django + Pydantic-AI agents — expense tracking, automated invoicing, and tax calculation.",
    from: "#FF5A3C",
    to: "#FF2E93",
  },
  {
    range: "2025.01 — 2025.04",
    title: "Software Engineering Intern",
    org: "IpserLab",
    desc: "AI-based travel management system using LangChain for Java.",
    from: "#FF2E93",
    to: "#7B5CFF",
  },
  {
    range: "2024.06 — 2024.08",
    title: "Software Engineering Intern",
    org: "SuperADS",
    desc: "Built AI-driven video deduplication workflows with ComfyUI custom nodes; introduced data-driven quality monitoring that raised self-check efficiency by 30%.",
    from: "#7B5CFF",
    to: "#24D3EE",
  },
  {
    range: "2023.09 — 2025.12",
    title: "M.S. Computer Science",
    org: "Northeastern University",
    desc: "Machine learning, deep learning, and big-data analytics.",
    from: "#B8FF39",
    to: "#24D3EE",
  },
  {
    range: "2022.05 — 2022.08",
    title: "Data Science Intern",
    org: "Surge Consulting",
    desc: "Automated voice-to-text pipelines (Wav2Vec 2.0), cutting manual work 40% and lifting transcription accuracy 30%, deployed on Docker + Kubernetes.",
    from: "#FF5A3C",
    to: "#24D3EE",
  },
  {
    range: "2018.09 — 2022.12",
    title: "B.S. Applied Statistics & Data Science",
    org: "Penn State",
    desc: "Foundation in statistical analysis, programming, and data-driven research.",
    from: "#FF2E93",
    to: "#B8FF39",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-[90px] bg-[#0B0711] text-[#F4EEE3] px-6 sm:px-10 py-[120px]">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-[70px]"
        >
          <div className="font-mono text-xs tracking-[.24em] uppercase text-[#8FE7F5] mb-4">/ journey</div>
          <h2 className="font-display font-extrabold text-[clamp(34px,4.6vw,58px)] leading-none tracking-[-.02em]">
            Experience &amp; education
          </h2>
        </motion.div>
        <div className="relative pl-[38px] border-l-2 border-white/10">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title + item.range}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.8, delay: i === 0 ? 0 : 0.06 }}
              className={`relative ${i < ITEMS.length - 1 ? "mb-[38px]" : ""}`}
            >
              <span
                className="absolute -left-[47px] top-1 w-4 h-4 rounded-full"
                style={{ background: `linear-gradient(120deg,${item.from},${item.to})` }}
              />
              <div className="font-mono text-xs text-[#8FE7F5] mb-1.5">{item.range}</div>
              <div className="font-display font-bold text-[22px]">
                {item.title} · <span className="text-[#B7AFC2] font-semibold">{item.org}</span>
              </div>
              <p className="text-[#C9C2D4] mt-2 leading-relaxed max-w-[640px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
