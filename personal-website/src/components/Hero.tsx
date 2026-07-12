"use client";

import FadeIn from "@/components/ui/FadeIn";
import { useMagnetic } from "@/hooks/useMagnetic";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Hero() {
  const portraitRef = useMagnetic<HTMLDivElement>({ strength: 12, padding: 120 });

  return (
    <header id="top" className="relative flex h-[100svh] min-h-[600px] flex-col overflow-x-clip">
      <FadeIn y={-20} className="relative z-20">
        <nav className="flex items-center justify-between gap-3 px-6 pt-6 text-[#D7E2EA] sm:px-10 sm:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-medium uppercase tracking-[.1em] text-[.64rem] transition-opacity hover:opacity-70 sm:text-sm md:text-lg lg:text-[1.4rem]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <FadeIn delay={0.15} y={40} className="relative z-[1] mt-[clamp(20px,3vw,48px)] overflow-hidden">
        <h1 className="steel-text w-full whitespace-nowrap text-center font-black uppercase leading-none tracking-[-.04em] text-[clamp(3rem,16vw,17.5vw)]">
            hi, i&apos;m jason
        </h1>
      </FadeIn>

      <FadeIn delay={0.6} y={30} className="pointer-events-none absolute -bottom-3 left-[48%] z-10 w-[clamp(320px,50vw,640px)] -translate-x-1/2 md:-bottom-5">
        <div ref={portraitRef} className="pointer-events-auto relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/portrait/jason-hero-wink-smirk-v7.png"
            alt="3D portrait of Jason"
            draggable={false}
            className="block h-auto w-full select-none"
          />
        </div>
      </FadeIn>

      <div className="relative z-20 mt-auto px-6 pb-7 sm:px-10 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="max-w-[clamp(150px,22vw,260px)] font-light uppercase tracking-[.04em] leading-[1.35] text-[#D7E2EA] text-[clamp(.7rem,1.4vw,1.5rem)]">
            an ai &amp; software engineer driven by building intelligent, striking, and
            unforgettable products
          </p>
        </FadeIn>
      </div>
    </header>
  );
}
