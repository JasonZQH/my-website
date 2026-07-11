"use client";

import { motion } from "framer-motion";

const STATS = [
  { n: "5+", label: "Internships", from: "#FF5A3C", to: "#FF2E93" },
  { n: "6+", label: "Projects", from: "#FF2E93", to: "#7B5CFF" },
  { n: "1", label: "Publication", from: "#7B5CFF", to: "#24D3EE" },
  { n: "2", label: "Degrees", from: "#24D3EE", to: "#FF5A3C" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-[90px] bg-[#F4EEE3] text-[#1A1220] px-6 sm:px-10 py-[120px]">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[.8fr_1.2fr] gap-[60px] items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="font-mono text-xs tracking-[.24em] uppercase text-[#8A5CFF] mb-[18px]">/ about</div>
          <h2 className="font-display font-extrabold text-[clamp(34px,4.4vw,56px)] leading-[1.02] tracking-[-.02em]">
            Engineer at the intersection of AI &amp; product.
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-lg leading-relaxed text-[#4A4353]"
        >
          <p className="mb-[22px]">
            I&apos;m a Software Engineer and AI application developer holding an{" "}
            <strong className="text-[#1A1220]">M.S. in Computer Science</strong> from Northeastern University&apos;s
            Khoury College, with a foundation in Applied Statistics &amp; Data Science from Penn State.
          </p>
          <p className="mb-[34px]">
            My work spans software engineering, machine learning, and computer vision — with hands-on experience
            building agentic AI workflows, real-time systems, and lightweight deep learning models for
            resource-constrained environments.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="font-display font-extrabold text-4xl bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(120deg,${s.from},${s.to})` }}
                >
                  {s.n}
                </div>
                <div className="text-[13px] text-[#6B6470] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
