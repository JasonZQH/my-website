// Stage-2 product reconstructions of YourPassenger's MVP surfaces (session
// memory, conversation journey, live voice). Register: a calm presence
// traveling beside the user — deliberately NOT a nav app, dashboard, cockpit,
// or chat UI. Static; Stage 3 adds the pulse/road motion.
// Contract: each panel fills its parent (absolute inset-0) and owns its
// background; the caller supplies rounding, clipping, and the aria label.

const AMBER = "#EBB268";

export function SessionMemory() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-[9px] overflow-hidden bg-[#0E1526] px-[8%]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 120% at 10% 110%, rgba(235,178,104,.09), transparent 58%)" }}
      />
      <div
        className="relative font-semibold uppercase tracking-[.14em] text-[clamp(12px,1.2vw,15px)]"
        style={{ color: AMBER }}
      >
        37 minutes together
      </div>
      <div className="relative overflow-hidden whitespace-nowrap font-mono text-[9px] uppercase tracking-[.12em] text-[rgba(215,226,234,.55)]">
        Roman history · Solo travel · Electric vehicles
      </div>
      <div className="relative border-t border-[rgba(215,226,234,.1)] pt-[8px]">
        <div className="font-mono text-[8px] uppercase tracking-[.22em] text-[rgba(215,226,234,.35)]">
          Next time
        </div>
        <div className="mt-[3px] text-[11px] font-light text-[#D7E2EA]">
          Continue planning the Spain trip
        </div>
      </div>
    </div>
  );
}

const TOPICS: { label: string; x: string; y: string; bright?: boolean }[] = [
  { label: "MUSIC", x: "5%", y: "56%" },
  { label: "TRAVEL", x: "22%", y: "24%" },
  { label: "HISTORY", x: "44%", y: "60%", bright: true },
  { label: "TECHNOLOGY", x: "62%", y: "26%" },
  { label: "PERSONAL STORIES", x: "77%", y: "52%" },
];

export function ConversationRoad() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0E1526]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(130% 110% at 90% 0%, rgba(235,178,104,.07), transparent 60%)" }}
      />
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[74%] w-full transition-transform duration-700 ease-out group-hover:translate-x-2 motion-reduce:transform-none"
        viewBox="0 0 420 190"
        preserveAspectRatio="none"
      >
        <path
          d="M -8 150 C 70 40, 150 200, 230 92 S 360 44, 428 104"
          fill="none"
          stroke="rgba(215,226,234,.45)"
          strokeWidth="2"
        />
        {/* the current stop on the journey */}
        <circle cx="212" cy="116" r="5" fill={AMBER} />
        <circle cx="212" cy="116" r="11" fill="none" stroke="rgba(235,178,104,.4)" strokeWidth="1.5" />
      </svg>
      {TOPICS.map((topic) => (
        <span
          key={topic.label}
          className={`absolute whitespace-nowrap font-mono text-[8.5px] uppercase tracking-[.16em] ${
            topic.bright ? "" : "text-[rgba(215,226,234,.42)]"
          }`}
          style={{ left: topic.x, top: topic.y, color: topic.bright ? AMBER : undefined }}
        >
          {topic.label}
        </span>
      ))}
      <div className="absolute inset-x-[6%] bottom-[7%] flex flex-wrap gap-x-5 gap-y-1 font-mono text-[8px] uppercase tracking-[.14em] text-[rgba(215,226,234,.4)]">
        <span>Conversation style · Curious</span>
        <span>Response length · Short</span>
        <span>Proactive topics · On</span>
      </div>
    </div>
  );
}

const STATES = ["LISTENING", "THINKING", "SPEAKING"] as const;

export function LiveVoice() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0B1120 0%, #101A31 68%, #0C1322 100%)" }}
    >
      {/* faint road-edge light, blurred into ambience */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 left-[8%] h-[46%] w-[3px] -skew-x-[24deg] blur-[7px]"
        style={{ background: "linear-gradient(180deg, transparent, rgba(235,178,104,.5))" }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-6 right-[10%] h-[38%] w-[2px] skew-x-[20deg] blur-[6px]"
        style={{ background: "linear-gradient(180deg, transparent, rgba(215,226,234,.35))" }}
      />
      <div className="absolute inset-x-[6%] top-[6%] flex justify-center gap-2">
        {STATES.map((state) => (
          <span
            key={state}
            className="whitespace-nowrap rounded-full border px-[10px] py-[4px] font-mono text-[8.5px] tracking-[.16em]"
            style={
              state === "SPEAKING"
                ? { borderColor: "rgba(235,178,104,.5)", background: "rgba(235,178,104,.13)", color: AMBER }
                : { borderColor: "rgba(215,226,234,.14)", color: "rgba(215,226,234,.38)" }
            }
          >
            {state}
          </span>
        ))}
      </div>
      {/* one warm voice pulse per hover entry — the wrapper owns the centering
          translate so the pp-pulse scale keyframes never discard it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[33%] aspect-square h-[30%] -translate-x-1/2 -translate-y-1/2"
      >
        <svg className="pp-pulse h-full w-full" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="92" fill="none" stroke={AMBER} strokeWidth="1" opacity=".08" />
          <circle cx="100" cy="100" r="66" fill="none" stroke={AMBER} strokeWidth="1.2" opacity=".18" />
          <circle cx="100" cy="100" r="42" fill="none" stroke={AMBER} strokeWidth="1.5" opacity=".38" />
          <circle cx="100" cy="100" r="20" fill="none" stroke={AMBER} strokeWidth="2" opacity=".7" />
          <circle cx="100" cy="100" r="7" fill={AMBER} />
        </svg>
      </div>
      <div className="absolute inset-x-[9%] bottom-[7%] flex flex-col gap-4">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-[.24em] text-[rgba(215,226,234,.4)]">You</div>
          <p className="mt-1 text-[11.5px] font-light leading-[1.5] text-[#D7E2EA]">
            I have another forty minutes. Tell me something unexpected.
          </p>
        </div>
        <div className="translate-y-[4px] opacity-75 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transform-none">
          <div className="font-mono text-[8px] uppercase tracking-[.24em]" style={{ color: "rgba(235,178,104,.75)" }}>
            Passenger
          </div>
          <p className="mt-1 text-[11.5px] font-light leading-[1.5] text-[rgba(235,214,183,.92)]">
            Let&apos;s take the long way through a strange part of history.
          </p>
        </div>
      </div>
    </div>
  );
}

export const PASSENGER_PANELS = [SessionMemory, ConversationRoad, LiveVoice] as const;
