// Stage-2 product reconstructions of EmojiCam's real surfaces (emoji
// suggestion, 7-class spectrum, live camera). The face is deliberately
// synthetic SVG geometry — never a real person. Static; Stage 3 adds motion.
// Contract: each panel fills its parent (absolute inset-0) and owns its
// background; the caller supplies rounding, clipping, and the aria label.

const LAVENDER = "#B7A7EA";

// Cursor zones (set by the card as [data-zone]): 0 neutral · 1 happy ·
// 2 surprise. A layer tagged ec-notX hides while zone X is active, so each
// variant carries the two ec-not classes for the zones it does NOT belong to.
const ZONE_LAYER = [
  "ec-layer ec-not1 ec-not2", // visible in zone 0
  "ec-layer ec-not0 ec-not2", // visible in zone 1 (default)
  "ec-layer ec-not0 ec-not1", // visible in zone 2
];

const RESPONSES = [
  { chip: "neutral · 0.74", emoji: "😐" },
  { chip: "happy · 0.82", emoji: "😊" },
  { chip: "surprise · 0.77", emoji: "😮" },
];

export function EmojiResponse() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden bg-[#17141F] px-[7%]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 110% at 90% 0%, rgba(183,167,234,.1), transparent 60%)" }}
      />
      <div className="relative h-[34px]">
        {RESPONSES.map((r, zone) => (
          <div
            key={r.chip}
            className={`${ZONE_LAYER[zone]} absolute inset-0 flex items-center gap-3 ${zone === 1 ? "" : "pointer-events-none"}`}
          >
            <span className="whitespace-nowrap rounded-full border border-[rgba(183,167,234,.4)] bg-[rgba(183,167,234,.08)] px-[10px] py-[4px] font-mono text-[9.5px] uppercase tracking-[.1em] text-[#D7E2EA]">
              {r.chip}
            </span>
            <span aria-hidden="true" className="text-[13px]" style={{ color: LAVENDER }}>
              →
            </span>
            <span className="text-[34px] leading-none">{r.emoji}</span>
          </div>
        ))}
      </div>
      <div className="relative flex items-center gap-2">
        <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap rounded-full border border-[rgba(215,226,234,.14)] bg-[rgba(9,8,15,.35)] px-3 py-[7px] text-[9px] text-[rgba(215,226,234,.35)]">
          Message…
        </div>
        <div className="flex flex-none items-center gap-[6px]">
          {["😊", "😄", "🙂"].map((emoji, i) => (
            <span
              key={emoji}
              className={`rounded-md px-[5px] py-[3px] text-[15px] leading-none ${
                i === 0 ? "bg-[rgba(183,167,234,.14)] ring-1 ring-[#B7A7EA]" : "opacity-50"
              }`}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const CLASSES: [string, number][] = [
  ["ANGRY", 8],
  ["DISGUST", 4],
  ["FEAR", 6],
  ["HAPPY", 82],
  ["NEUTRAL", 24],
  ["SAD", 7],
  ["SURPRISE", 12],
];

export function EmotionSpectrum() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#1A1626] p-[6%]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(130% 100% at 50% 120%, rgba(183,167,234,.09), transparent 60%)" }}
      />
      <div className="relative flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[.2em] text-[rgba(215,226,234,.4)]">
        <span>expression distribution</span>
        <span className="flex items-center gap-[6px]">
          <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: LAVENDER }} />
          softmax
        </span>
      </div>
      <div className="relative flex min-h-0 flex-1 items-end justify-between gap-[3%] pt-3">
        {CLASSES.map(([name, value]) => (
          <div key={name} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-[6px]">
            {name === "HAPPY" && (
              <span className="font-mono text-[9px]" style={{ color: LAVENDER }}>
                82%
              </span>
            )}
            <div
              className="w-full rounded-t-[4px]"
              style={{
                height: `${Math.max(value, 4)}%`,
                background: name === "HAPPY" ? LAVENDER : "rgba(215,226,234,.16)",
              }}
            />
            <span
              className={`overflow-hidden font-mono text-[7.5px] tracking-[.06em] ${
                name === "HAPPY" ? "text-[#D7E2EA]" : "text-[rgba(215,226,234,.35)]"
              }`}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LANDMARKS: [number, number][] = [
  [64, 92],
  [92, 88],
  [108, 88],
  [136, 92],
  [76, 108],
  [124, 108],
  [100, 132],
  [74, 150],
  [126, 150],
  [100, 176],
];

type ProbRow = { label: string; value: number; active?: boolean };

// One probability set per cursor zone; zone 1 (happy) is the resting state.
const PROBABILITY_SETS: ProbRow[][] = [
  [
    { label: "NEUTRAL", value: 0.74, active: true },
    { label: "HAPPY", value: 0.14 },
    { label: "SURPRISE", value: 0.05 },
  ],
  [
    { label: "HAPPY", value: 0.82, active: true },
    { label: "NEUTRAL", value: 0.11 },
    { label: "SURPRISE", value: 0.04 },
  ],
  [
    { label: "SURPRISE", value: 0.77, active: true },
    { label: "HAPPY", value: 0.12 },
    { label: "NEUTRAL", value: 0.08 },
  ],
];

function ProbabilityList({ rows }: { rows: ProbRow[] }) {
  return (
    <>
      {rows.map((p) => (
        <div key={p.label} className="flex items-center gap-2">
          <span
            className="w-[72px] flex-none tracking-[.08em]"
            style={{ color: p.active ? LAVENDER : "rgba(215,226,234,.4)" }}
          >
            {p.label}
          </span>
          <span className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-[rgba(215,226,234,.1)]">
            <span
              className="block h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${p.value * 100}%`,
                background: p.active ? LAVENDER : "rgba(215,226,234,.35)",
              }}
            />
          </span>
          <span
            className="w-[34px] flex-none text-right"
            style={{ color: p.active ? "#D7E2EA" : "rgba(215,226,234,.4)" }}
          >
            {p.value.toFixed(2)}
          </span>
        </div>
      ))}
    </>
  );
}

export function LiveExpression() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#17141F]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(90% 70% at 50% 38%, rgba(183,167,234,.1), transparent 62%)" }}
      />
      {/* viewfinder chrome */}
      <div aria-hidden="true" className="absolute left-[6%] top-[5%] h-[14px] w-[14px] border-l-2 border-t-2 border-[rgba(215,226,234,.35)]" />
      <div aria-hidden="true" className="absolute right-[6%] top-[5%] h-[14px] w-[14px] border-r-2 border-t-2 border-[rgba(215,226,234,.35)]" />
      <div aria-hidden="true" className="absolute bottom-[5%] left-[6%] h-[14px] w-[14px] border-b-2 border-l-2 border-[rgba(215,226,234,.35)]" />
      <div aria-hidden="true" className="absolute bottom-[5%] right-[6%] h-[14px] w-[14px] border-b-2 border-r-2 border-[rgba(215,226,234,.35)]" />
      <div className="absolute right-[9%] top-[7%] flex items-center gap-[6px] font-mono text-[8.5px] uppercase tracking-[.2em] text-[rgba(215,226,234,.5)]">
        <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-[#FF7A7A]" />
        live
      </div>
      <svg
        aria-hidden="true"
        className="absolute left-1/2 top-[7%] h-[64%] -translate-x-1/2"
        viewBox="0 0 200 240"
      >
        {/* attention region */}
        <rect
          x="32"
          y="20"
          width="136"
          height="192"
          rx="18"
          fill="none"
          stroke="rgba(183,167,234,.4)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        {/* synthetic head */}
        <ellipse cx="100" cy="118" rx="62" ry="84" fill="rgba(183,167,234,.05)" stroke="rgba(215,226,234,.55)" strokeWidth="2" />
        {/* brows */}
        <path d="M62 93 q 15 -10 30 -4" fill="none" stroke="rgba(215,226,234,.6)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M108 89 q 15 -6 30 4" fill="none" stroke="rgba(215,226,234,.6)" strokeWidth="2.5" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="76" cy="108" r="4" fill="#D7E2EA" />
        <circle cx="124" cy="108" r="4" fill="#D7E2EA" />
        {/* nose */}
        <path d="M100 114 v 18" fill="none" stroke="rgba(215,226,234,.35)" strokeWidth="2" strokeLinecap="round" />
        {/* mouth — one variant per cursor zone */}
        <path
          d="M78 152 q 22 5 44 0"
          fill="none"
          stroke="#D7E2EA"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={ZONE_LAYER[0]}
        />
        <path
          d="M74 150 q 26 22 52 0"
          fill="none"
          stroke="#D7E2EA"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={ZONE_LAYER[1]}
        />
        <ellipse cx="100" cy="156" rx="11" ry="15" fill="none" stroke="#D7E2EA" strokeWidth="2.5" className={ZONE_LAYER[2]} />
        {/* landmarks */}
        {LANDMARKS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill={LAVENDER} />
        ))}
      </svg>
      <div className="absolute inset-x-[9%] bottom-[6%] font-mono text-[9.5px]">
        <div className="relative">
          <div className={`${ZONE_LAYER[0]} pointer-events-none absolute inset-0 flex flex-col gap-[7px]`}>
            <ProbabilityList rows={PROBABILITY_SETS[0]} />
          </div>
          <div className={`${ZONE_LAYER[1]} flex flex-col gap-[7px]`}>
            <ProbabilityList rows={PROBABILITY_SETS[1]} />
          </div>
          <div className={`${ZONE_LAYER[2]} pointer-events-none absolute inset-0 flex flex-col gap-[7px]`}>
            <ProbabilityList rows={PROBABILITY_SETS[2]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const EMOJICAM_PANELS = [EmojiResponse, EmotionSpectrum, LiveExpression] as const;
