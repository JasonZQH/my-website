"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";

const PILL_CLASSES =
  "inline-flex items-center text-sm uppercase tracking-[.1em] text-[#D7E2EA] border border-[rgba(215,226,234,.16)] px-[22px] py-[11px] rounded-full transition-colors hover:text-white";

export default function Footer() {
  // Computed client-side so a statically-built page can't freeze last year's
  // date into the copyright; suppressHydrationWarning covers the rare build
  // that straddles New Year's.
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="bg-[rgba(22,20,30,.7)] backdrop-blur-xl border-t border-[rgba(215,226,234,.14)] px-[clamp(20px,4vw,40px)] pt-[clamp(66px,8vw,110px)] pb-11">
      <div className="max-w-[1100px] mx-auto text-center">
        <FadeIn y={20}>
          <div className="aurora-text font-black uppercase tracking-[-.02em] leading-[.9] text-[clamp(2.6rem,10vw,120px)]">
            Jason Zhang
          </div>
        </FadeIn>
        <div className="flex gap-3 justify-center flex-wrap mt-[clamp(26px,4vw,42px)]">
          <a
            href="mailto:jasonontheway98@qinhaozhang.dev"
            className={`${PILL_CLASSES} hover:border-[#BB4F9F]`}
          >
            Email
          </a>
          <a
            href="https://github.com/JasonZQH"
            target="_blank"
            rel="noopener noreferrer"
            className={`${PILL_CLASSES} hover:border-[#D7E2EA]`}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/qinhaozhang98/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${PILL_CLASSES} hover:border-[#57E39B]`}
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/str8up__z"
            target="_blank"
            rel="noopener noreferrer"
            className={`${PILL_CLASSES} hover:border-[#BE4C00]`}
          >
            Instagram
          </a>
        </div>
        <div
          suppressHydrationWarning
          className="mt-[clamp(28px,4vw,46px)] font-light text-[.85rem] text-[rgba(215,226,234,.5)]"
        >
          © {year} Jason Zhang · Designed &amp; built with care
        </div>
      </div>
    </footer>
  );
}
