const TEXT =
  "AGENTIC AI ✦ COMPUTER VISION ✦ FULL-STACK ✦ DEEP LEARNING ✦ SCALABLE SYSTEMS ✦ DATA SCIENCE ✦ ";

export default function Marquee() {
  return (
    <div
      className="py-[22px] overflow-hidden whitespace-nowrap border-y border-white/10"
      style={{ background: "linear-gradient(115deg,#FF5A3C,#FF2E93 45%,#7B5CFF 78%,#24D3EE)" }}
    >
      <div className="inline-flex items-center animate-[marquee_26s_linear_infinite]">
        <span className="font-display font-extrabold text-2xl text-[#0B0711] tracking-[-.01em]">{TEXT}</span>
        <span className="font-display font-extrabold text-2xl text-[#0B0711] tracking-[-.01em]">{TEXT}</span>
      </div>
    </div>
  );
}
