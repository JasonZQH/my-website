"use client";

import { motion } from "framer-motion";

const GROUPS = [
  { label: "Languages", color: "#FF5A3C", items: ["Python", "TypeScript", "Java", "SQL", "C++"] },
  { label: "AI / ML", color: "#FF2E93", items: ["PyTorch", "LangChain", "Pydantic-AI", "CV", "Transformers"] },
  { label: "Backend", color: "#7B5CFF", items: ["Django", "FastAPI", "Node.js", "REST", "Microservices"] },
  {
    label: "Data & Infra",
    color: "#24D3EE",
    items: ["MongoDB", "Redis", "MySQL", "PostgreSQL", "Docker", "K8s", "GCP"],
  },
];

export default function Stack() {
  return (
    <section id="stack" className="scroll-mt-[90px] bg-[#EFE8DB] text-[#1A1220] px-6 sm:px-10 py-[110px]">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8 }}
          className="mb-[52px]"
        >
          <div className="font-mono text-xs tracking-[.24em] uppercase text-[#8A5CFF] mb-4">/ toolkit</div>
          <h2 className="font-display font-extrabold text-[clamp(32px,4vw,52px)] leading-none tracking-[-.02em]">
            The stack I build with
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
          {GROUPS.map((g, i) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="bg-white rounded-[20px] p-[26px] border border-black/[.06]"
            >
              <div className="font-display font-bold text-[19px] mb-4 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: g.color }} />
                {g.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[13px] bg-[#F4EEE3] px-3 py-1.5 rounded-full text-[#4A4353]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
