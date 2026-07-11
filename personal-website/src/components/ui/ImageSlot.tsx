"use client";

import Image from "next/image";
import { useState } from "react";

// On-brand placeholder art: pairs of v3 accents + a faint dot texture,
// cycled per slot so neighboring wells don't look identical.
const GRADIENTS = [
  "radial-gradient(130% 90% at 12% 0%,var(--acc2),transparent 56%),radial-gradient(120% 100% at 92% 100%,var(--acc3),transparent 56%)",
  "radial-gradient(120% 90% at 90% 4%,var(--acc4),transparent 56%),radial-gradient(120% 100% at 6% 100%,var(--acc2),transparent 56%)",
  "radial-gradient(120% 120% at 0% 50%,var(--acc3),transparent 56%),radial-gradient(120% 120% at 100% 50%,var(--acc4),transparent 56%)",
  "radial-gradient(150% 100% at 50% 0%,var(--acc2),transparent 60%),radial-gradient(120% 90% at 50% 100%,var(--acc4),transparent 52%)",
];

type Props = {
  /** Path under public/ (e.g. "/projects/tradgent-a.webp"). Omit → placeholder art. */
  src?: string;
  alt: string;
  /** Sizing/radius come from the caller; this fills its container. */
  className?: string;
  /** Which placeholder gradient to use (cycles mod 4). */
  variant?: number;
  sizes?: string;
};

/**
 * v3 image well: renders the real image when `src` is provided, and an
 * on-brand gradient placeholder (with dot texture) when it isn't or it fails
 * to load — so layouts look finished before real shots are wired in.
 */
export default function ImageSlot({ src, alt, className, variant = 0, sizes }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-80"
        style={{ background: `${GRADIENTS[variant % GRADIENTS.length]},#0F0A16` }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {showImage && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 90vw, 40vw"}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
