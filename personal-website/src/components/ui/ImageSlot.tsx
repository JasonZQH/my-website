"use client";

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
};

/**
 * Image well: renders a supplied image over a subtle placeholder treatment.
 * A native image is intentional here: these reference assets live on several
 * different hosts, and this avoids routing GIFs and remote artwork through
 * Next's image optimizer.
 */
export default function ImageSlot({ src, alt, className, variant = 0 }: Props) {
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
