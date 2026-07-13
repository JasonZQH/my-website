import { Fragment } from "react";

// Stage-2 product reconstructions of CURATOR's real surfaces (scheduler loop,
// evidence ledger, workbench TUI) — content mirrors the shipped workflow, not
// marketing art. Static by design; Stage 3 layers the motion on.
// Contract: each panel fills its parent (absolute inset-0) and owns its
// background; the caller supplies rounding, clipping, and the aria label.

const GREEN = "#57E39B";
const AMBER = "#EBB268";

const SCHEDULER_NODES = ["writer", "verifier", "reviewer", "human gate"] as const;

export function CuratorScheduler() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-4 overflow-hidden bg-[#101511] px-[6%]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 110% at 88% 0%, rgba(87,227,155,.08), transparent 62%)" }}
      />
      <div className="relative pt-4">
        {/* the verifier can reject once — dashed loop back to the writer */}
        <svg
          aria-hidden="true"
          className="absolute -top-1 left-[5%] h-6 w-[36%]"
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
        >
          <path
            d="M97 22 C 72 -6, 28 -6, 5 18"
            fill="none"
            stroke="#FF7A7A"
            strokeWidth="2"
            strokeDasharray="5 5"
            opacity=".6"
          />
          <path d="M5 18 l8 -1 M5 18 l3 -7" fill="none" stroke="#FF7A7A" strokeWidth="2" opacity=".6" />
        </svg>
        <div className="flex items-center gap-[5px]">
          {SCHEDULER_NODES.map((node, i) => (
            <Fragment key={node}>
              {i > 0 && (
                <span aria-hidden="true" className="text-[11px]" style={{ color: GREEN }}>
                  →
                </span>
              )}
              <span
                className="whitespace-nowrap rounded-md border px-[6px] py-[4px] font-mono text-[9.5px] tracking-[.02em] text-[#D7E2EA]"
                style={
                  node === "human gate"
                    ? { borderColor: "rgba(235,178,104,.45)", background: "rgba(235,178,104,.07)" }
                    : { borderColor: "rgba(87,227,155,.3)", background: "rgba(87,227,155,.06)" }
                }
              >
                {node}
              </span>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="relative whitespace-nowrap font-mono text-[9px] uppercase tracking-[.16em] text-[rgba(215,226,234,.4)]">
        retry · pause · revise scope · stop · resume
      </div>
    </div>
  );
}

const LEDGER_HEAD = ["run", "provider", "verification", "evidence", "decision", "checkpoint"];

const LEDGER_ROWS = [
  ["#12", "claude-code", "12 passed", "a1f3…9c2", "accept", "✓ saved"],
  ["#11", "codex", "review ok", "77bd…e41", "approve", "✓ saved"],
  ["#10", "claude-code", "2 failed", "5c09…b77", "retry", "— rolled back"],
  ["#09", "claude-code", "9 passed", "d21a…f03", "accept", "✓ saved"],
];

function ledgerCellColor(value: string) {
  if (value === "2 failed") return "#FF7A7A";
  if (value === "retry") return AMBER;
  return undefined;
}

export function CuratorLedger() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0E120F] p-[6%]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(130% 100% at 0% 100%, rgba(87,227,155,.06), transparent 55%)" }}
      />
      <div className="relative mb-[10px] font-mono text-[8.5px] uppercase tracking-[.2em] text-[rgba(87,227,155,.6)]">
        evidence ledger · .curator/
      </div>
      <table className="relative w-full border-collapse font-mono text-[9.5px] leading-[1.4]">
        <thead>
          <tr>
            {LEDGER_HEAD.map((h) => (
              <th
                key={h}
                className="border-b border-[rgba(215,226,234,.14)] pb-[6px] pr-2 text-left text-[8.5px] font-normal uppercase tracking-[.1em] text-[rgba(215,226,234,.38)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LEDGER_ROWS.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="whitespace-nowrap border-b border-[rgba(215,226,234,.07)] py-[6px] pr-2 text-[rgba(215,226,234,.78)]"
                  style={{ color: ledgerCellColor(cell) }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const WORKBENCH_ROWS = [
  { agent: "WRITER", provider: "CLAUDE CODE", state: "▸ RUNNING", color: GREEN },
  { agent: "VERIFIER", provider: "LOCAL COMMANDS", state: "WAITING", color: "rgba(215,226,234,.4)" },
  { agent: "REVIEWER", provider: "CODEX", state: "READY", color: "#A8B1C0" },
  { agent: "HUMAN GATE", provider: "", state: "LOCKED", color: AMBER },
];

export function CuratorWorkbench() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#121713] p-[7%] font-mono">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(110% 70% at 12% 0%, rgba(87,227,155,.07), transparent 58%)" }}
      />
      <div className="relative flex items-center gap-2 border-b border-[rgba(215,226,234,.1)] pb-3">
        <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-[#FF7A7A] opacity-60" />
        <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-[#EBB268] opacity-60" />
        <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-[#57E39B] opacity-60" />
        <span className="ml-1 text-[10px] tracking-[.08em] text-[rgba(215,226,234,.45)]">
          curator · workbench
        </span>
      </div>
      <div className="relative mt-4 text-[11px] font-medium tracking-[.22em]" style={{ color: GREEN }}>
        GOAL ACCEPTED
      </div>
      <div className="relative mt-4 flex flex-col gap-[11px] text-[10.5px]">
        {WORKBENCH_ROWS.map((row) => (
          <div key={row.agent} className="grid grid-cols-[86px_1fr_auto] items-baseline gap-2">
            <span className="tracking-[.08em] text-[rgba(215,226,234,.85)]">{row.agent}</span>
            <span className="overflow-hidden whitespace-nowrap text-[9.5px] text-[rgba(215,226,234,.4)]">
              {row.provider}
            </span>
            <span className="tracking-[.06em]" style={{ color: row.color }}>
              {row.state}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-auto border-t border-[rgba(215,226,234,.08)] pt-3 text-[9.5px] leading-[1.8] text-[rgba(215,226,234,.38)]">
        <div>
          <span style={{ color: GREEN }}>▸</span> dispatching writer…
        </div>
        <div>workspace clean · context package rendered</div>
        <div>
          evidence hash a1f3…9c2 recorded{" "}
          <span aria-hidden="true" style={{ color: GREEN }}>
            ▍
          </span>
        </div>
      </div>
    </div>
  );
}

export const CURATOR_PANELS = [CuratorScheduler, CuratorLedger, CuratorWorkbench] as const;
