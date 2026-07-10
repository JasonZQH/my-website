"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTilt } from "@/hooks/useTilt";

const PALETTE = ["#FF5A3C", "#FF2E93", "#7B5CFF", "#24D3EE"];
const LOGOS = ["meta", "openai", "google", "youtube", "github", "tiktok", "apple", "notion", "microsoft", "s"];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropLayerRef = useRef<HTMLDivElement>(null);
  const metaBarRef = useRef<HTMLDivElement>(null);
  const btnRowRef = useRef<HTMLAnchorElement>(null);
  const avatarRef = useTilt<HTMLDivElement>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let points: { x: number; y: number; vx: number; vy: number; r: number; c: string }[] = [];
    let raf = 0;

    const seed = () => {
      const n = Math.min(80, Math.floor((w * h) / 16000));
      points = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 2.2 + 0.8,
        c: PALETTE[Math.floor(Math.random() * 4)],
      }));
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.55;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const layer = dropLayerRef.current;
    const metabar = metaBarRef.current;
    if (!layer || !metabar) return;

    const timer = setTimeout(() => {
      const W = layer.clientWidth;
      const lineY = metabar.offsetTop;
      if (!W || lineY < 80) return;
      layer.innerHTML = "";
      const shuffled = [...LOGOS].sort(() => Math.random() - 0.5);
      const n = Math.min(shuffled.length, W < 560 ? 4 : W < 860 ? 6 : 8);
      const pad = Math.max(24, W * 0.045);
      let gapL = W * 0.36;
      let gapR = W * 0.64;
      const btnRow = btnRowRef.current;
      if (btnRow) {
        const lr = layer.getBoundingClientRect();
        const br = btnRow.getBoundingClientRect();
        gapL = br.left - lr.left - 28;
        gapR = br.right - lr.left + 28;
      }
      const leftW = Math.max(0, gapL - pad);
      const rightW = Math.max(0, W - pad - gapR);
      const useZones = leftW > 70 && rightW > 70;
      const nLeft = Math.ceil(n / 2);

      for (let i = 0; i < n; i++) {
        const size = 50 + Math.round(Math.random() * 24);
        let center: number;
        let span: number;
        let cnt: number;
        if (useZones) {
          if (i < nLeft) {
            cnt = nLeft;
            span = leftW;
            center = pad + (span * (i + 0.5)) / cnt;
          } else {
            cnt = n - nLeft;
            span = rightW;
            center = gapR + (span * (i - nLeft + 0.5)) / cnt;
          }
        } else {
          cnt = n;
          span = W - 2 * pad;
          center = pad + (span * (i + 0.5)) / cnt;
        }
        const tx = Math.max(0, Math.min(W - size, center - size / 2 + (Math.random() - 0.5) * (span / cnt) * 0.6));
        const yf = lineY - size + Math.round(Math.random() * 2);
        const y0 = -size - 80 - Math.round(Math.random() * 140);
        const r0 = (Math.random() - 0.5) * 80;
        const rf = (Math.random() - 0.5) * 40;
        const el = document.createElement("img");
        el.src = `/assets/logos/${shuffled[i]}.png`;
        el.alt = shuffled[i];
        el.draggable = false;
        el.style.cssText = `position:absolute;top:0;left:0;width:${size}px;height:${size}px;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.5));user-select:none`;
        el.style.setProperty("--tx", `${tx}px`);
        el.style.setProperty("--y0", `${y0}px`);
        el.style.setProperty("--yf", `${yf}px`);
        el.style.setProperty("--r0", `${r0}deg`);
        el.style.setProperty("--rf", `${rf}deg`);
        el.style.transform = `translate(${tx}px,${yf}px) rotate(${rf}deg)`;
        el.style.animation = "dropIn 1.2s both";
        el.style.animationDelay = `${(i * 0.11).toFixed(2)}s`;
        layer.appendChild(el);
      }
    }, 480);

    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-[118px] pb-10 overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
          backgroundSize: "68px 68px",
          WebkitMaskImage: "radial-gradient(circle at 50% 40%,#000,transparent 74%)",
          maskImage: "radial-gradient(circle at 50% 40%,#000,transparent 74%)",
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[.48] animate-[blobA_22s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(44% 40% at 50% 0%,#FF5A3C,transparent 66%)" }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40 animate-[blobB_27s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(40% 44% at 90% 98%,#7B5CFF,transparent 66%)" }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[.26]"
        style={{ background: "radial-gradient(36% 40% at 6% 90%,#24D3EE,transparent 66%)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] w-full h-full pointer-events-none opacity-80" />
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-50 mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
        }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(125% 88% at 50% 36%,transparent 50%,rgba(11,7,17,.9))" }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 h-[38%] z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to top,#0B0711 5%,transparent)" }}
      />
      <div ref={dropLayerRef} className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" />

      <div className="flex-1 min-h-[20px]" />

      <div className="relative z-[3] flex flex-col items-center text-center max-w-[1100px]">
        <div className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[.28em] text-[#B7AFC2] uppercase border border-white/[.14] px-4 py-2 rounded-full bg-white/[.03] mb-8">
          <span className="w-[7px] h-[7px] rounded-full bg-[#B8FF39] shadow-[0_0_10px_#B8FF39] animate-[pulseGlow_2s_infinite]" />
          AI / ML · Software Engineer
        </div>

        <div className="relative flex items-center justify-center mb-8">
          <div
            className="absolute w-[230px] h-[230px] rounded-full opacity-[.22] blur-[26px] pointer-events-none"
            style={{ background: "radial-gradient(circle,#FF2E93,transparent 60%)" }}
          />
          <div className="absolute w-[196px] h-[196px] rounded-full border border-white/[.07] pointer-events-none" />
          <div className="absolute w-[158px] h-[158px] rounded-full border border-dashed border-white/[.13] pointer-events-none animate-[spinRing_44s_linear_infinite]" />
          <div
            ref={avatarRef}
            className="relative w-[124px] h-[124px] rounded-full p-1 shadow-[0_24px_60px_rgba(255,46,147,.28)] animate-[gradShift_6s_ease_infinite,floatY_6s_ease-in-out_infinite] [background-size:220%_220%]"
            style={{ background: "linear-gradient(120deg,#FF5A3C,#FF2E93,#7B5CFF,#24D3EE)" }}
          >
            <Image
              src="/avatar.jpeg"
              alt="Jason Zhang"
              width={124}
              height={124}
              priority
              className="w-full h-full rounded-full object-cover border-[3px] border-[#0B0711]"
            />
          </div>
        </div>

        <h1 className="font-display font-extrabold leading-[.92] tracking-[-.03em] text-[clamp(52px,9vw,132px)]">
          <span className="block overflow-hidden">
            {"Jason".split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block animate-[letterUp_.7s_both]"
                style={{ animationDelay: `${0.05 + i * 0.05}s` }}
              >
                {ch}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden">
            <span
              className="inline-block animate-[riseIn_.85s_cubic-bezier(.2,.7,.2,1)_both]"
              style={{ animationDelay: "0.34s" }}
            >
              <span
                className="inline-block bg-clip-text text-transparent [background-size:220%_220%] animate-[gradShift_7s_ease_infinite]"
                style={{ backgroundImage: "linear-gradient(115deg,#FF5A3C,#FF2E93 40%,#7B5CFF 70%,#24D3EE)" }}
              >
                Zhang
              </span>
            </span>
          </span>
        </h1>

        <p className="max-w-[560px] mx-auto mt-[30px] text-[clamp(16px,2vw,19px)] leading-relaxed text-[#C9C2D4]">
          I build <strong className="text-[#F4EEE3] font-semibold">agentic AI systems</strong> and full-stack
          products — from real-time recommendation engines to lightweight vision models that run anywhere.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mt-10">
          <a
            ref={btnRowRef}
            href="#work"
            className="inline-flex items-center gap-2.5 font-semibold text-[15px] text-[#0B0711] px-7 py-[15px] rounded-full shadow-[0_14px_40px_rgba(255,90,60,.32)] transition hover:brightness-[1.08] hover:-translate-y-0.5"
            style={{ background: "linear-gradient(120deg,#FF5A3C,#FF2E93 55%,#7B5CFF)" }}
          >
            See my work →
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 font-semibold text-[15px] text-[#F4EEE3] border border-white/[.18] px-7 py-[15px] rounded-full bg-white/[.03] transition hover:border-white/50 hover:bg-white/[.07]"
          >
            Let&apos;s connect
          </a>
        </div>
      </div>

      <div className="flex-1 min-h-[24px]" />

      <div
        ref={metaBarRef}
        className="relative z-[3] w-full max-w-[1180px] border-t border-white/[.08] pt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-5"
      >
        <div className="font-mono text-xs tracking-[.05em] text-[#9A93A6] flex items-center gap-2 justify-self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF39] shadow-[0_0_9px_#B8FF39] animate-[pulseGlow_2s_infinite]" />
          Based in Bay Area, CA · open to 2026 roles
        </div>
        <div className="flex flex-col items-center gap-2 justify-self-center">
          <span className="w-[22px] h-[34px] border border-white/[.24] rounded-xl relative block">
            <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-2 rounded-sm bg-[#FF2E93] animate-[cueDot_1.8s_ease-in-out_infinite]" />
          </span>
          <span className="font-mono text-[9px] tracking-[.24em] text-[#6F6880]">SCROLL</span>
        </div>
        <div className="font-mono text-xs tracking-[.05em] text-[#9A93A6] text-right justify-self-end">
          M.S. Computer Science · Northeastern
        </div>
      </div>
    </header>
  );
}
