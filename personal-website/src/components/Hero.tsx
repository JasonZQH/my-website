"use client";

import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import AuroraPill from "@/components/ui/AuroraPill";
import { useMagnetic } from "@/hooks/useMagnetic";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Hero() {
  const portraitRef = useMagnetic<HTMLDivElement>();

  return (
    <header id="top" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background glows + bottom fade */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(56% 44% at 50% 4%,rgba(182,0,168,.22),transparent 70%)" }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(46% 42% at 90% 102%,rgba(118,33,176,.18),transparent 70%)" }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 h-[30%] z-0 pointer-events-none"
        style={{ background: "linear-gradient(to top,#0C0C0C,transparent)" }}
      />

      {/* In-hero nav — scrolls away with the hero */}
      <FadeIn y={-20} className="relative z-20">
        <nav className="flex items-center justify-between gap-5 py-[26px] px-[clamp(20px,4vw,44px)]">
          {/* Wordmark hides on phones — four links won't fit beside it */}
          <a
            href="#top"
            className="hidden sm:block font-semibold uppercase tracking-[.16em] text-[clamp(1rem,1.4vw,1.35rem)] whitespace-nowrap"
          >
            Jason Zhang
          </a>
          <div className="flex items-center w-full justify-between sm:w-auto sm:justify-normal sm:gap-[clamp(18px,3vw,46px)]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-medium uppercase tracking-[.1em] sm:tracking-[.14em] text-[10px] sm:text-[clamp(.78rem,1vw,1.05rem)] transition hover:opacity-65"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>

      {/* Content column */}
      <div className="relative flex-1 flex flex-col items-center justify-start pt-[clamp(14px,3vh,38px)] px-[clamp(20px,4vw,44px)] pb-10 gap-[clamp(16px,3vh,40px)]">
        {/* Magnetic portrait — soft-masked head, no frame */}
        <FadeIn delay={0.15} y={-8} className="flex justify-center mt-[clamp(2px,1vh,14px)]">
          <div
            ref={portraitRef}
            className="relative w-[clamp(184px,21vw,296px)] h-[clamp(214px,25vw,338px)]"
          >
            <div
              className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[76%] h-[64%] rounded-full opacity-[.32] blur-[34px] pointer-events-none"
              style={{ background: "radial-gradient(circle,var(--acc2),transparent 68%)" }}
            />
            <Image
              src="/avatar.jpeg"
              alt="Jason Zhang"
              fill
              priority
              draggable={false}
              sizes="(max-width: 768px) 60vw, 300px"
              className="object-cover select-none"
              style={{
                objectPosition: "center 6%",
                filter: "brightness(1.05) contrast(1.04) saturate(1.04)",
                WebkitMaskImage: "radial-gradient(50% 60% at 50% 37%, #000 58%, transparent 80%)",
                maskImage: "radial-gradient(50% 60% at 50% 37%, #000 58%, transparent 80%)",
              }}
            />
          </div>
        </FadeIn>

        {/* Giant name */}
        <FadeIn delay={0.3} y={40}>
          <h1 className="steel-text relative z-[1] font-black uppercase tracking-[-.03em] leading-[.9] text-[clamp(2.4rem,13vw,11.5rem)] whitespace-nowrap text-center">
            hi, i&apos;m jason
          </h1>
        </FadeIn>

        {/* Bottom bar */}
        <div className="relative z-[3] w-full mt-auto flex justify-between items-end gap-5">
          <FadeIn delay={0.45} y={20}>
            <p className="max-w-[clamp(150px,22vw,270px)] font-light uppercase tracking-[.04em] leading-[1.35] text-[#D7E2EA] text-[clamp(.7rem,1.3vw,1.4rem)]">
              an ai &amp; software engineer driven by building intelligent, striking, and
              unforgettable products
            </p>
          </FadeIn>
          <FadeIn delay={0.6} y={20}>
            <AuroraPill href="#contact">Contact Me</AuroraPill>
          </FadeIn>
        </div>
      </div>
    </header>
  );
}
