"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const PREVIEWS = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const ROW_ONE = PREVIEWS.slice(0, 11);
const ROW_TWO = PREVIEWS.slice(11);

function PreviewRow({ images, label }: { images: string[]; label: string }) {
  return (
    <>
      {images.concat(images, images).map((src, index) => (
        <div key={`${label}-${index}`} className="h-[clamp(160px,18vw,270px)] w-[clamp(250px,28vw,420px)] flex-none overflow-hidden rounded-2xl bg-[#141414]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={index < images.length ? `${label} website preview` : ""}
            aria-hidden={index >= images.length}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </>
  );
}

/** Two scroll-scrubbed image belts from the supplied reference design. */
export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const xOne = useMotionValue(-200);
  const xTwo = useMotionValue(200);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - top + window.innerHeight) * 0.3;
      xOne.set(offset - 200);
      xTwo.set(-(offset - 200));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [xOne, xTwo]);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Project preview gallery"
      className="scroll-mt-20 overflow-hidden pt-[clamp(96px,11vw,160px)] pb-[clamp(36px,5vw,72px)]"
    >
      <motion.div className="flex gap-3 will-change-transform" style={{ x: reduce ? -200 : xOne }}>
        <PreviewRow images={ROW_ONE} label="Featured" />
      </motion.div>
      <motion.div className="mt-3 flex gap-3 will-change-transform" style={{ x: reduce ? 200 : xTwo }}>
        <PreviewRow images={ROW_TWO} label="Creative" />
      </motion.div>
    </section>
  );
}
