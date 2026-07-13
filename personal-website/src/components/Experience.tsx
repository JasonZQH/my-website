import FadeIn from "@/components/ui/FadeIn";

type ExperienceItem = {
  range: string;
  title: string;
  org: string;
  desc: string;
  /** Contribution proof — exact approved wording; revealed as the row scrolls into view. */
  metrics?: string[];
  /** Supporting system labels rendered as quiet chips under the description. */
  systems?: string[];
};

const ITEMS: ExperienceItem[] = [
  {
    range: "Apr 2026 — Present",
    title: "Software Engineer, Founding Team",
    org: "Vybers.ai",
    desc: "Shipped production systems spanning asynchronous generative-video pipelines, autonomous geospatial agents, world-model infrastructure, realtime delivery, and controlled cloud deployment.",
    systems: [
      "AI travel-vlog pipeline",
      "autonomous map-agent exploration",
      "world-model architecture rewrite",
      "versioned-token authentication",
      "canary production delivery",
    ],
    metrics: ["365 commits", "91 merged PRs", "9 repositories touched", "first 3 months"],
  },
  {
    range: "Jun 2025 — Aug 2025",
    title: "Backend SWE Intern",
    org: "XPerf",
    desc: "Built Django/DRF services for 12+ bookkeeping workflows and a typed Pydantic AI graph that routed, validated, confirmed, and gated persistence of multi-step operations.",
  },
  {
    range: "Jan 2025 — Apr 2025",
    title: "Software Engineer Co-op",
    org: "IpserLab",
    desc: "Built Spring Boot services for an AI trip-planning product and a federated GraphQL layer integrating six external providers with concurrency, validation, and fallbacks.",
  },
  {
    range: "Jun 2024 — Aug 2024",
    title: "Software Engineering Intern",
    org: "SuperADS",
    desc: "Built an OpenCV/PyTorch video-processing pipeline used across 65+ batch jobs, with containerized execution and Grafana-based operational visibility.",
  },
  {
    range: "Sep 2023 — Dec 2025",
    title: "M.S. Computer Science",
    org: "Northeastern University",
    desc: "Object-oriented design, algorithms, and distributed systems.",
  },
  {
    range: "Sep 2018 — Dec 2022",
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
                {item.systems && (
                  <ul className="mt-[14px] flex max-w-[640px] flex-wrap gap-2">
                    {item.systems.map((label) => (
                      <li
                        key={label}
                        className="rounded-full border border-[rgba(215,226,234,.16)] px-3 py-1 text-[.68rem] uppercase tracking-[.12em] text-[#8B9298]"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
                {item.metrics && (
                  <FadeIn delay={0.3} y={12}>
                    <p className="mt-[16px] font-medium tracking-[.02em] text-[#D7E2EA] text-[clamp(.9rem,1.4vw,1.1rem)]">
                      {item.metrics.join("  ·  ")}
                    </p>
                  </FadeIn>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
