import FadeIn from "@/components/ui/FadeIn";

const ITEMS = [
  {
    range: "2025.09 — 2025.12",
    title: "Teaching Assistant",
    org: "Northeastern University",
    desc: "TA for CS5610: Web Development.",
  },
  {
    range: "2025.06 — 2025.08",
    title: "Backend SWE Intern",
    org: "XPerf",
    desc: "Engineered the backend of an AI-powered bookkeeping app with Django + Pydantic-AI agents — expense tracking, automated invoicing, and tax calculation.",
  },
  {
    range: "2025.01 — 2025.04",
    title: "Software Engineering Intern",
    org: "IpserLab",
    desc: "AI-based travel management system using LangChain for Java.",
  },
  {
    range: "2024.06 — 2024.08",
    title: "Software Engineering Intern",
    org: "SuperADS",
    desc: "Built AI-driven video deduplication workflows with ComfyUI custom nodes; introduced data-driven quality monitoring that raised self-check efficiency by 30%.",
  },
  {
    range: "2023.09 — 2025.12",
    title: "M.S. Computer Science",
    org: "Northeastern University",
    desc: "Machine learning, deep learning, and big-data analytics.",
  },
  {
    range: "2022.05 — 2022.08",
    title: "Data Science Intern",
    org: "Surge Consulting",
    desc: "Automated voice-to-text pipelines (Wav2Vec 2.0), cutting manual work 40% and lifting transcription accuracy 30%, deployed on Docker + Kubernetes.",
  },
  {
    range: "2018.09 — 2022.12",
    title: "B.S. Applied Statistics & Data Science",
    org: "Penn State",
    desc: "Foundation in statistical analysis, programming, and data-driven research.",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="scroll-mt-20 px-[clamp(20px,4vw,40px)] py-[clamp(90px,10vw,130px)]"
    >
      <div className="max-w-[1000px] mx-auto">
        <FadeIn y={40}>
          <h2 className="steel-text text-center font-black uppercase tracking-[-.02em] leading-none text-[clamp(3rem,12vw,150px)] mb-[clamp(46px,7vw,86px)]">
            Experience
          </h2>
        </FadeIn>
        <div className="border-b border-[rgba(215,226,234,.14)]">
          {ITEMS.map((item, i) => (
            <FadeIn
              key={`${item.range}-${item.org}`}
              delay={(i % 3) * 0.07}
              className="flex gap-[clamp(16px,4vw,48px)] items-baseline py-[clamp(24px,3vw,38px)] border-t border-[rgba(215,226,234,.14)]"
            >
              <div className="flex-none w-[clamp(94px,12vw,158px)] font-medium uppercase tracking-[.05em] text-[#8B9298] text-[clamp(.76rem,1.1vw,1rem)]">
                {item.range}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[clamp(1.05rem,2.2vw,1.85rem)] leading-[1.15]">
                  {item.title}{" "}
                  <span className="text-[#8B9298] font-normal">· {item.org}</span>
                </h3>
                <p className="mt-2 font-light leading-[1.6] text-[rgba(215,226,234,.6)] text-[clamp(.9rem,1.5vw,1.12rem)] max-w-[640px]">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
