import type { ReactElement, ReactNode } from "react";

// Stage-2 static posters for the 12 capability loops (brief §6). Each poster
// is the key frame of its future Stage-3 animation: one dominant action, thin
// strokes, a single accent. Art keeps the bottom ~36px quiet — the marquee
// tile overlays its label strip there.
// Contract: each Poster fills its parent (absolute inset-0); the tile supplies
// rounding, clipping, grain, and the label.

const VIOLET = "#6965B5";
const MAGENTA = "#BB4F9F";
const GREEN = "#57E39B";
const AMBER = "#EBB268";
const STEEL = "#D7E2EA";

const INK = "rgba(215,226,234,.72)";
const DIM = "rgba(215,226,234,.3)";

function Frame({ tint, children }: { tint: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#211E2A]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `radial-gradient(120% 100% at 24% 0%, ${tint}, transparent 62%)` }}
      />
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 420 270"
        preserveAspectRatio="xMidYMid slice"
      >
        {children}
      </svg>
    </div>
  );
}

const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" } as const;

function Microservices() {
  return (
    <Frame tint="rgba(105,101,181,.12)">
      <circle cx="34" cy="118" r="5" fill={VIOLET} />
      <path d="M39 118 H 74" stroke={INK} strokeWidth="1.5" />
      <rect x="76" y="90" width="36" height="56" rx="7" fill="none" stroke={INK} strokeWidth="1.5" />
      {[38, 84, 130, 176].map((y) => (
        <g key={y}>
          <path d={`M112 118 C 140 118, 150 ${y + 15}, 178 ${y + 15}`} stroke={DIM} strokeWidth="1.5" fill="none" />
          <rect x="180" y={y} width="30" height="30" rx="6" fill="none" stroke={INK} strokeWidth="1.5" />
          <circle cx="187" cy={y + 7} r="2.5" fill={VIOLET} />
          <path d={`M210 ${y + 15} C 250 ${y + 15}, 270 118, 306 118`} stroke={DIM} strokeWidth="1.5" fill="none" />
        </g>
      ))}
      <circle cx="326" cy="118" r="16" fill="rgba(105,101,181,.14)" stroke={VIOLET} strokeWidth="2" />
    </Frame>
  );
}

function Kubernetes() {
  return (
    <Frame tint="rgba(87,227,155,.1)">
      <path d="M20 34 H 400" stroke={GREEN} strokeWidth="2" />
      {/* healthy node */}
      <rect x="42" y="66" width="96" height="118" rx="9" fill="none" stroke={INK} strokeWidth="1.5" />
      {[
        [68, 96],
        [112, 96],
        [68, 140],
        [112, 140],
      ].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="7" fill="rgba(215,226,234,.25)" />
      ))}
      {/* failed node */}
      <rect x="164" y="66" width="96" height="118" rx="9" fill="none" stroke={DIM} strokeWidth="1.5" strokeDasharray="6 6" />
      <path d="M200 112 l24 24 M224 112 l-24 24" stroke="rgba(255,122,122,.6)" strokeWidth="2" />
      {/* node that absorbed the pods */}
      <rect x="286" y="66" width="96" height="118" rx="9" fill="none" stroke={INK} strokeWidth="1.5" />
      {[
        [312, 96],
        [356, 96],
        [312, 140],
        [356, 140],
      ].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="7" fill="rgba(215,226,234,.25)" />
      ))}
      <circle cx="334" cy="162" r="7" fill="none" stroke={GREEN} strokeWidth="2" />
      <circle cx="356" cy="162" r="7" fill="none" stroke={GREEN} strokeWidth="2" />
      <path d="M212 150 C 240 190, 280 176, 322 164" stroke={GREEN} strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
    </Frame>
  );
}

function MultiAgent() {
  const stages = ["WRITER", "VERIFIER", "REVIEWER", "GATE"];
  return (
    <Frame tint="rgba(187,79,159,.12)">
      {stages.map((label, i) => {
        const x = 22 + i * 100;
        return (
          <g key={label}>
            {i > 0 && <path d={`M${x - 28} 130 H ${x - 4}`} stroke={INK} strokeWidth="1.5" />}
            {i > 0 && <path d={`M${x - 10} 125 l6 5 l-6 5`} fill="none" stroke={INK} strokeWidth="1.5" />}
            <rect
              x={x}
              y="106"
              width="72"
              height="48"
              rx="8"
              fill={label === "GATE" ? "rgba(187,79,159,.1)" : "none"}
              stroke={label === "GATE" ? MAGENTA : INK}
              strokeWidth="1.5"
            />
            <text x={x + 36} y="134" textAnchor="middle" fontSize="10" letterSpacing="1.5" fill={INK} style={mono}>
              {label}
            </text>
          </g>
        );
      })}
      {/* one rejection loops back before approval */}
      <path d="M158 102 C 130 58, 90 58, 62 100" fill="none" stroke={MAGENTA} strokeWidth="1.8" strokeDasharray="5 5" />
      <path d="M62 100 l8 -2 M62 100 l2 -8" fill="none" stroke={MAGENTA} strokeWidth="1.8" />
    </Frame>
  );
}

function CloudCallbacks() {
  return (
    <Frame tint="rgba(235,178,104,.1)">
      {/* local app */}
      <rect x="56" y="150" width="76" height="58" rx="9" fill="none" stroke={INK} strokeWidth="1.5" />
      <path d="M76 182 l8 8 l16 -18" fill="none" stroke={AMBER} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* cloud volume */}
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <ellipse cx="300" cy="84" rx="58" ry="28" />
        <ellipse cx="258" cy="94" rx="26" ry="16" />
        <ellipse cx="344" cy="94" rx="24" ry="14" />
      </g>
      {/* processing */}
      <circle cx="300" cy="84" r="11" fill="none" stroke={DIM} strokeWidth="1.5" strokeDasharray="3 3" />
      {/* upload */}
      <path d="M136 152 C 180 120, 210 104, 238 92" stroke={INK} strokeWidth="1.5" fill="none" />
      <path d="M238 92 l-9 0 M238 92 l-3 8" fill="none" stroke={INK} strokeWidth="1.5" />
      {/* async callback */}
      <path d="M296 116 C 260 170, 200 186, 140 182" stroke={AMBER} strokeWidth="1.8" strokeDasharray="5 5" fill="none" />
      <path d="M140 182 l9 -3 M140 182 l8 5" fill="none" stroke={AMBER} strokeWidth="1.8" />
    </Frame>
  );
}

function Websocket() {
  return (
    <Frame tint="rgba(87,227,155,.1)">
      <circle cx="104" cy="128" r="6" fill={GREEN} />
      <circle cx="104" cy="128" r="20" fill="none" stroke={GREEN} strokeWidth="1.5" opacity=".5" />
      <circle cx="104" cy="128" r="38" fill="none" stroke={GREEN} strokeWidth="1.2" opacity=".25" />
      <circle cx="104" cy="128" r="58" fill="none" stroke={GREEN} strokeWidth="1" opacity=".12" />
      {[36, 110, 184].map((y) => (
        <g key={y}>
          <path d={`M110 128 C 190 128, 210 ${y + 26}, 288 ${y + 26}`} stroke={DIM} strokeWidth="1.5" fill="none" />
          <rect x="290" y={y} width="86" height="52" rx="7" fill="none" stroke={INK} strokeWidth="1.5" />
          <circle cx="304" cy={y + 12} r="3" fill={GREEN} />
          <path d={`M300 ${y + 30} h 60 M300 ${y + 40} h 42`} stroke={DIM} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </Frame>
  );
}

function Postgis() {
  return (
    <Frame tint="rgba(105,101,181,.12)">
      <circle cx="150" cy="126" r="4.5" fill={VIOLET} />
      <circle cx="150" cy="126" r="30" fill="none" stroke={VIOLET} strokeWidth="1.2" opacity=".5" strokeDasharray="4 4" />
      <circle cx="150" cy="126" r="62" fill="none" stroke={VIOLET} strokeWidth="1" opacity=".28" strokeDasharray="4 4" />
      <circle cx="150" cy="126" r="96" fill="none" stroke={VIOLET} strokeWidth="1" opacity=".14" strokeDasharray="4 4" />
      {[
        [96, 84],
        [208, 74],
        [232, 150],
        [118, 190],
        [190, 196],
      ].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3.5" fill="rgba(215,226,234,.5)" />
      ))}
      {/* the selected point */}
      <circle cx="262" cy="106" r="4.5" fill={VIOLET} />
      <circle cx="262" cy="106" r="10" fill="none" stroke={VIOLET} strokeWidth="1.8" />
      {/* the route bends toward it */}
      <path d="M18 214 C 90 206, 150 196, 196 168 S 248 124, 258 114" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </Frame>
  );
}

function ComputerVision() {
  return (
    <Frame tint="rgba(187,79,159,.12)">
      <rect x="82" y="34" width="140" height="182" rx="16" fill="none" stroke="rgba(187,79,159,.45)" strokeWidth="1.5" strokeDasharray="6 6" />
      <ellipse cx="152" cy="126" rx="52" ry="68" fill="rgba(187,79,159,.05)" stroke={INK} strokeWidth="1.8" />
      <path d="M122 104 q 12 -8 24 -3 M158 101 q 12 -5 24 3" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="132" cy="118" r="3.4" fill={STEEL} />
      <circle cx="172" cy="118" r="3.4" fill={STEEL} />
      <path d="M132 158 q 20 16 40 0" fill="none" stroke={STEEL} strokeWidth="2" strokeLinecap="round" />
      {[
        [122, 104],
        [146, 101],
        [158, 101],
        [182, 104],
        [132, 118],
        [172, 118],
        [152, 140],
        [132, 158],
        [172, 158],
      ].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="2.4" fill={MAGENTA} />
      ))}
      {/* confidence */}
      <rect x="258" y="92" width="118" height="9" rx="4.5" fill="rgba(187,79,159,.2)" />
      <rect x="258" y="92" width="94" height="9" rx="4.5" fill={MAGENTA} />
      <rect x="258" y="116" width="118" height="9" rx="4.5" fill="rgba(215,226,234,.12)" />
      <rect x="258" y="116" width="34" height="9" rx="4.5" fill="rgba(215,226,234,.35)" />
      <rect x="258" y="140" width="118" height="9" rx="4.5" fill="rgba(215,226,234,.12)" />
      <rect x="258" y="140" width="16" height="9" rx="4.5" fill="rgba(215,226,234,.35)" />
    </Frame>
  );
}

function GenerativeMedia() {
  return (
    <Frame tint="rgba(235,178,104,.1)">
      {/* fragments */}
      <rect x="34" y="44" width="58" height="40" rx="6" fill="none" stroke={INK} strokeWidth="1.5" transform="rotate(-6 63 64)" />
      <rect x="42" y="106" width="58" height="40" rx="6" fill="none" stroke={DIM} strokeWidth="1.5" transform="rotate(4 71 126)" />
      <rect x="30" y="166" width="58" height="40" rx="6" fill="none" stroke={DIM} strokeWidth="1.5" transform="rotate(-3 59 186)" />
      {[64, 126, 186].map((y) => (
        <path key={y} d={`M100 ${y} C 130 ${y}, 140 150, 166 150`} stroke={DIM} strokeWidth="1.5" fill="none" />
      ))}
      {/* timeline with waveform + caption ticks */}
      <rect x="168" y="132" width="152" height="36" rx="7" fill="none" stroke={INK} strokeWidth="1.5" />
      <path
        d="M178 150 l8 -8 l8 12 l8 -14 l8 10 l8 -6 l8 9 l8 -11 l8 8 l8 -5 l8 7 l8 -9 l8 6"
        fill="none"
        stroke={AMBER}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {[188, 224, 260, 296].map((x) => (
        <path key={x} d={`M${x} 172 v 7`} stroke={DIM} strokeWidth="2" />
      ))}
      {/* the finished piece */}
      <rect x="330" y="58" width="64" height="46" rx="7" fill="rgba(235,178,104,.08)" stroke={AMBER} strokeWidth="1.8" />
      <path d="M356 72 l14 9 l-14 9 z" fill={AMBER} />
      <path d="M320 132 C 340 124, 350 112, 356 106" stroke={AMBER} strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
    </Frame>
  );
}

function Grpc() {
  return (
    <Frame tint="rgba(105,101,181,.12)">
      {[
        [40, 76],
        [72, 118],
        [50, 158],
        [92, 88],
        [86, 186],
        [118, 140],
      ].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4" fill="rgba(215,226,234,.4)" />
      ))}
      {/* schema boundary */}
      <path d="M182 62 h-16 v 146 h16" fill="none" stroke={VIOLET} strokeWidth="2" />
      <path d="M198 62 h16 v 146 h-16" fill="none" stroke={VIOLET} strokeWidth="2" />
      {/* ordered packets */}
      {[236, 280, 324].map((x, i) => (
        <rect
          key={x}
          x={x}
          y="120"
          width="26"
          height="26"
          rx="5"
          fill={i === 0 ? "rgba(105,101,181,.16)" : "none"}
          stroke={VIOLET}
          strokeWidth="1.8"
        />
      ))}
      {/* service line they cross */}
      <path d="M366 54 V 216" stroke={DIM} strokeWidth="1.5" strokeDasharray="6 6" />
      <path d="M350 133 h 34" stroke={INK} strokeWidth="1.5" />
      <path d="M384 133 l-7 -5 M384 133 l-7 5" fill="none" stroke={INK} strokeWidth="1.5" />
    </Frame>
  );
}

function Cicd() {
  return (
    <Frame tint="rgba(87,227,155,.1)">
      <circle cx="44" cy="128" r="6" fill={INK} />
      {/* 90% to stable */}
      <path d="M50 124 C 80 104, 100 96, 128 94" stroke={INK} strokeWidth="3" fill="none" />
      <rect x="130" y="80" width="230" height="28" rx="14" fill="rgba(215,226,234,.07)" stroke={INK} strokeWidth="1.5" />
      <text x="352" y="72" textAnchor="end" fontSize="10" fill={DIM} style={mono}>
        90%
      </text>
      {/* 10% to canary */}
      <path d="M50 134 C 76 154, 96 162, 126 164" stroke={GREEN} strokeWidth="1.5" fill="none" />
      <rect x="128" y="152" width="86" height="26" rx="13" fill="rgba(87,227,155,.08)" stroke={GREEN} strokeWidth="1.8" />
      <text x="226" y="170" fontSize="10" fill={GREEN} style={mono}>
        10%
      </text>
      {/* healthy signal on the canary */}
      <path d="M246 166 l6 6 l12 -13" fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M214 165 h 24" stroke="rgba(87,227,155,.35)" strokeWidth="1.2" strokeDasharray="3 3" />
    </Frame>
  );
}

function Observability() {
  return (
    <Frame tint="rgba(187,79,159,.12)">
      {/* latency line with one spike */}
      <path d="M28 74 L 130 72 L 158 70" stroke={INK} strokeWidth="1.8" fill="none" />
      <path d="M158 70 L 182 34 L 206 76" stroke={MAGENTA} strokeWidth="2" fill="none" />
      <path d="M206 76 L 392 72" stroke={INK} strokeWidth="1.8" fill="none" />
      {/* trace waterfall; the culprit span lights up */}
      <rect x="60" y="118" width="240" height="11" rx="5.5" fill="rgba(215,226,234,.16)" />
      <rect x="96" y="140" width="176" height="11" rx="5.5" fill="rgba(215,226,234,.12)" />
      <rect x="128" y="162" width="118" height="11" rx="5.5" fill={MAGENTA} />
      <rect x="150" y="184" width="56" height="11" rx="5.5" fill="rgba(215,226,234,.12)" />
      <path d="M182 40 C 210 84, 200 130, 187 160" stroke="rgba(187,79,159,.45)" strokeWidth="1.3" strokeDasharray="4 4" fill="none" />
    </Frame>
  );
}

function DataCoordination() {
  return (
    <Frame tint="rgba(235,178,104,.1)">
      {/* relational */}
      <g fill="none" stroke={INK} strokeWidth="1.5">
        <ellipse cx="76" cy="56" rx="26" ry="9" />
        <path d="M50 56 v 34 a26 9 0 0 0 52 0 v -34" />
      </g>
      {/* cache */}
      <rect x="50" y="122" width="52" height="40" rx="7" fill="none" stroke={INK} strokeWidth="1.5" />
      <path d="M80 128 l-10 15 h9 l-7 13" fill="none" stroke={AMBER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* spatial */}
      <path d="M76 186 c -12 0 -20 9 -20 19 c 0 13 20 29 20 29 c 0 0 20 -16 20 -29 c 0 -10 -8 -19 -20 -19 z" fill="none" stroke={INK} strokeWidth="1.5" />
      <circle cx="76" cy="205" r="5" fill="rgba(215,226,234,.35)" />
      {/* convergence into one product state */}
      {[70, 142, 210].map((y) => (
        <path key={y} d={`M108 ${y} C 170 ${y}, 190 132, 246 132`} stroke={DIM} strokeWidth="1.5" fill="none" />
      ))}
      <rect x="248" y="100" width="118" height="64" rx="10" fill="rgba(235,178,104,.07)" stroke={AMBER} strokeWidth="1.8" />
      <path d="M264 120 h 86 M264 134 h 62 M264 148 h 74" stroke="rgba(215,226,234,.4)" strokeWidth="2.4" strokeLinecap="round" />
    </Frame>
  );
}

export const CAPABILITIES: {
  id: string;
  label: string;
  accent: string;
  Poster: () => ReactElement;
}[] = [
  { id: "microservices", label: "MICROSERVICES · DISTRIBUTED OWNERSHIP", accent: VIOLET, Poster: Microservices },
  { id: "kubernetes", label: "KUBERNETES · SELF-HEALING DELIVERY", accent: GREEN, Poster: Kubernetes },
  { id: "multi-agent", label: "MULTI-AGENT · CONTROLLED COLLABORATION", accent: MAGENTA, Poster: MultiAgent },
  { id: "cloud-callbacks", label: "CLOUD SYSTEMS · ASYNC CALLBACKS", accent: AMBER, Poster: CloudCallbacks },
  { id: "websocket", label: "WEBSOCKET · LIVE STATE", accent: GREEN, Poster: Websocket },
  { id: "postgis", label: "POSTGIS · LOCATION INTELLIGENCE", accent: VIOLET, Poster: Postgis },
  { id: "computer-vision", label: "COMPUTER VISION · HUMAN SIGNAL", accent: MAGENTA, Poster: ComputerVision },
  { id: "generative-video", label: "GENERATIVE VIDEO · MEDIA PIPELINES", accent: AMBER, Poster: GenerativeMedia },
  { id: "grpc", label: "gRPC · PROTOCOL BUFFERS", accent: VIOLET, Poster: Grpc },
  { id: "cicd", label: "CI/CD · CONTROLLED RELEASES", accent: GREEN, Poster: Cicd },
  { id: "observability", label: "OBSERVABILITY · TRACE TO CAUSE", accent: MAGENTA, Poster: Observability },
  { id: "data-systems", label: "DATA SYSTEMS · ONE PRODUCT STATE", accent: AMBER, Poster: DataCoordination },
];
