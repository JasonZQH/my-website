# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current multi-page Next.js site with the single-page portfolio from the claude.ai/design mockup (`Portfolio.dc.html`, Aurora hero variant), with a real (non-decorative) contact form, ready to open as one PR.

**Architecture:** One scrolling `/` route composing new section components (`Hero → Marquee → About → Stack → Experience → Work → Contact → Footer`) in `src/app/page.tsx`. The contact form posts to a new same-origin Next.js API route backed by the existing MongoDB Atlas cluster. Old multi-page routes are deleted and redirected to anchors on `/`.

**Tech Stack:** Next.js 15.1.7 (App Router), React 19, TypeScript 5, Tailwind CSS 3.4.1, framer-motion 12, mongodb driver (new dependency).

## Global Constraints

- Full spec: `docs/superpowers/specs/2026-07-09-portfolio-redesign-design.md`.
- Repo root is `/Users/zqh980802/Desktop/personal/website`; the Next.js app lives in `personal-website/`. Run all `npm`/`node` commands from `personal-website/`. File paths below are given relative to `personal-website/` unless stated otherwise.
- Node v22.22.3, npm 11.17.0 (confirmed in this environment).
- **No test framework exists in this repo** (no Jest/Vitest/Playwright config, no prior test files). Do not add one — it's out of scope. Every task's "test" step is `npm run lint` + `npm run build` (this is the mergeability bar given there's no CI) plus a concrete manual check (curl or browser) — not a unit test. This deviates from the usual TDD step template on purpose; do not treat the absence of a `- [ ] Write the failing test` step as an omission.
- Follow existing conventions: one component per file under `src/components/`, `"use client"` only on files that need hooks/state/browser APIs/framer-motion (Server Components otherwise), Tailwind utility classes as the default styling mechanism (arbitrary-value syntax `[...]` for one-off values, inline `style={{}}` only for genuinely dynamic/computed values).
- **Never write the actual `MONGODB_URI` value into any file that gets committed to git** (including this plan, source files, or commit messages). It only ever goes into the gitignored `personal-website/.env`, copied via a shell command that doesn't print the value to the terminal.
- Palette used throughout: `#0B0711` (bg), `#F4EEE3` (cream text / light-section bg), `#EFE8DB` (Stack section bg), `#1A1220` (dark text on light sections), `#08050C` (footer bg), `#130C1F` (dark card bg), gradient stops `#FF5A3C` → `#FF2E93` → `#7B5CFF` → `#24D3EE`, accent `#B8FF39`.
- Fonts: Bricolage Grotesque (`font-display`, headings), Space Grotesk (`font-body`, default body), JetBrains Mono (`font-mono`, labels/mono text) — set up in Task 3.
- The branch `redesign/portfolio-v2` already exists (checked out) with one commit (the spec doc). Do all work on this branch. Commit at the end of every task.

---

### Task 1: Fetch design assets from claude.ai/design

**Files:**
- Create: `public/assets/logos/apple.png`, `public/assets/logos/github.png`, `public/assets/logos/google.png`, `public/assets/logos/meta.png`, `public/assets/logos/microsoft.png`, `public/assets/logos/notion.png`, `public/assets/logos/openai.png`, `public/assets/logos/s.png`, `public/assets/logos/tiktok.png`, `public/assets/logos/youtube.png`
- Modify: `public/avatar.jpeg` (replace with the design project's version)

**Interfaces:**
- Produces: `/assets/logos/<name>.png` (10 files) and `/avatar.jpeg`, consumed by the `Hero` component in Task 7.

- [ ] **Step 1: Fetch each logo via the `DesignSync` tool**

For each of the 10 logo names (`apple`, `github`, `google`, `meta`, `microsoft`, `notion`, `openai`, `s`, `tiktok`, `youtube`), call:

```
DesignSync({ method: "get_file", projectId: "9871c578-afc8-44a3-8172-85f159625a66", path: `assets/logos/${name}.png` })
```

Each response is JSON with a `content` field. If `isBase64` is `true`, write `content` verbatim (it's already a base64 string) to a scratch file, e.g. `/tmp/logo-apple.b64`, using the Write tool. Then decode it with:

```bash
base64 -D -i /tmp/logo-apple.b64 -o public/assets/logos/apple.png
```

(macOS `base64` uses `-D`/`-i`/`-o`; do not use GNU `-d` flags.) Repeat for all 10 names. If any response has `isBase64: false`, write its `content` directly to the target `.png` path instead (skip the decode step for that one file).

- [ ] **Step 2: Fetch and replace the avatar**

```
DesignSync({ method: "get_file", projectId: "9871c578-afc8-44a3-8172-85f159625a66", path: "assets/avatar.jpeg" })
```

Decode the same way into `public/avatar.jpeg`, overwriting the existing file. If this call errors because the file exceeds the tool's 256 KiB cap, skip this step and keep the existing `public/avatar.jpeg` — note that in your task summary, don't block on it.

- [ ] **Step 3: Verify all 11 files exist and are valid images**

```bash
file public/assets/logos/*.png public/avatar.jpeg
```

Expected: each line reports a PNG or JPEG image type (not "ASCII text" or "data" — that would mean the base64 decode step was skipped or failed).

- [ ] **Step 4: Commit**

```bash
git add public/assets public/avatar.jpeg
git commit -m "assets: pull redesign logos and avatar from claude.ai/design"
```

---

### Task 2: Contact form backend — MongoDB helper and API route

**Files:**
- Create: `src/lib/mongodb.ts`
- Create: `src/app/api/contact/route.ts`
- Modify: `package.json` (add `mongodb` dependency, via `npm install`)
- Modify (not committed — gitignored): `.env` (add `MONGODB_URI`)

**Interfaces:**
- Produces: `clientPromise: Promise<MongoClient>` (default export of `src/lib/mongodb.ts`), and `POST /api/contact` accepting `{ field: string, email: string, message: string, canRefer: boolean, isRecruiter: boolean }`, returning `{ message: string, id: string }` on success (200) or `{ message: string }` on validation failure (400). Consumed by the `Contact` component in Task 13.

- [ ] **Step 1: Add the MongoDB driver**

```bash
npm install mongodb
```

- [ ] **Step 2: Create the cached-client helper**

Create `src/lib/mongodb.ts`:

```ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;
```

- [ ] **Step 3: Create the API route**

Create `src/app/api/contact/route.ts`:

```ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface ContactPayload {
  field: string;
  email: string;
  message: string;
  canRefer: boolean;
  isRecruiter: boolean;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactPayload>;

  if (!body.email || !body.message) {
    return NextResponse.json(
      { message: "email and message are required" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("suggestionsInfoDB");
  const result = await db.collection("contacts").insertOne({
    field: body.field ?? "Other",
    email: body.email,
    message: body.message,
    canRefer: Boolean(body.canRefer),
    isRecruiter: Boolean(body.isRecruiter),
    submittedAt: new Date(),
  });

  return NextResponse.json({ message: "Message received", id: result.insertedId });
}
```

- [ ] **Step 4: Add `MONGODB_URI` to the local `.env` without exposing its value**

Run this from `personal-website/` — it copies the line directly between files without printing the secret to the terminal:

```bash
grep MONGODB_URI server/.env >> .env
```

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: build succeeds (the route compiles; it isn't called yet so there's nothing to exercise here beyond compilation).

- [ ] **Step 6: Manual functional check**

In one terminal: `npm run dev`. In another:

```bash
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"field":"AI / ML","email":"test@example.com","message":"plan verification test","canRefer":false,"isRecruiter":true}'
```

Expected: a JSON response like `{"message":"Message received","id":"<24-char hex string>"}`. This writes one real document into the `contacts` collection of the existing Atlas cluster — that's expected and fine (it's the same database the site already uses), not a bug.

Stop the dev server (Ctrl-C) before moving on.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/lib/mongodb.ts src/app/api/contact/route.ts
git commit -m "feat: add contact form API route backed by MongoDB Atlas"
```

(`.env` is gitignored and intentionally not staged.)

---

### Task 3: Design tokens — fonts, Tailwind config, global keyframes

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: Tailwind utilities `font-display`, `font-body`, `font-mono` (usable by every component from Task 5 onward), and global `@keyframes` (`gradShift`, `blobA`, `blobB`, `marquee`, `letterUp`, `spinRing`, `floatY`, `cueDot`, `blink`, `pulseGlow`, `riseIn`, `dropIn`) referenced via Tailwind's `animate-[name_...]` arbitrary syntax.

- [ ] **Step 1: Replace the fonts and body chrome in `layout.tsx`**

Replace the full contents of `src/app/layout.tsx`:

```tsx
import { Metadata } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MouseGlow from "@/components/MouseGlow";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: "Jason Zhang — AI/ML Software Engineer",
  description: "Portfolio of Jason Zhang: agentic AI systems, computer vision, and full-stack products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-body antialiased bg-[#0B0711] text-[#F4EEE3] min-h-screen overflow-x-hidden`}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <MouseGlow />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

If `next/font/google` errors that `Bricolage_Grotesque`, `Space_Grotesk`, or `JetBrains_Mono` isn't an exported font, fall back to loading them via a `<link>` tag in a `<head>` block instead (same approach the original mockup used): add
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```
inside `<html><head>`, and set the CSS variables (`--font-display`, `--font-body`, `--font-mono`) directly in `globals.css` to the plain font-family strings instead of the `next/font` variables.

- [ ] **Step 2: Wire the fonts into Tailwind**

In `tailwind.config.ts`, add a `fontFamily` block inside `theme.extend` (keep the existing `keyframes`/`animation` entries as-is):

```ts
// tailwind.config.js
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/slider.js",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        gradientFlow: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
        breathe: {
          '0%, 100%': {color: '#ffffff'},
          '50%': {color: '#000000'}
        }
      },
      animation: {
        gradientText: "gradientFlow 5s ease infinite",
        breathe: "breathe 2s ease-in-out infinite"
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require('daisyui'),],
};
```

- [ ] **Step 3: Add global keyframes**

Replace the full contents of `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

::selection {
  background: #FF2E93;
  color: #fff;
}

.slider-half {
  width: 50vw !important;
  max-width: none !important;
}

@keyframes gradShift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
@keyframes blobA { 0%, 100% { transform: translate(0,0) scale(1) } 33% { transform: translate(8%,-6%) scale(1.12) } 66% { transform: translate(-6%,7%) scale(.92) } }
@keyframes blobB { 0%, 100% { transform: translate(0,0) scale(1) } 50% { transform: translate(-9%,8%) scale(1.15) } }
@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
@keyframes letterUp { 0% { opacity: 0; transform: translateY(90%) rotate(8deg) } 100% { opacity: 1; transform: translateY(0) rotate(0) } }
@keyframes spinRing { 0% { transform: rotate(0) } 100% { transform: rotate(360deg) } }
@keyframes floatY { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
@keyframes cueDot { 0% { transform: translate(-50%,0); opacity: 0 } 30% { opacity: 1 } 100% { transform: translate(-50%,16px); opacity: 0 } }
@keyframes blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
@keyframes pulseGlow { 0%, 100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes riseIn { 0% { opacity: 0; transform: translateY(108%) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes dropIn {
  0% { transform: translate(var(--tx), var(--y0)) rotate(var(--r0)); opacity: 0; animation-timing-function: cubic-bezier(.5,0,.9,.45) }
  14% { opacity: 1 }
  58% { transform: translate(var(--tx), var(--yf)) rotate(var(--rf)); animation-timing-function: cubic-bezier(.28,0,.25,1) }
  76% { transform: translate(var(--tx), calc(var(--yf) - 24px)) rotate(calc(var(--rf) - 4deg)); animation-timing-function: cubic-bezier(.4,0,.45,1) }
  88% { transform: translate(var(--tx), var(--yf)) rotate(var(--rf)); animation-timing-function: cubic-bezier(.35,0,.5,1) }
  95% { transform: translate(var(--tx), calc(var(--yf) - 8px)) rotate(var(--rf)) }
  100% { transform: translate(var(--tx), var(--yf)) rotate(var(--rf)) }
}
```

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx tailwind.config.ts src/app/globals.css
git commit -m "style: swap in redesign fonts and global keyframes"
```

---

### Task 4: `useTilt` hook

**Files:**
- Create: `src/hooks/useTilt.ts`

**Interfaces:**
- Produces: `useTilt<T extends HTMLElement>(): React.RefObject<T | null>` — attach the returned ref to any element to get pointer-tilt-on-hover. Consumed by `Hero` (Task 7) and `Work` (Task 12).

- [ ] **Step 1: Create the hook**

Create `src/hooks/useTilt.ts`:

```ts
"use client";

import { useEffect, useRef } from "react";

export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transition = "transform .08s linear";
      el.style.transform = `perspective(900px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateY(-4px)`;
    };
    const handleLeave = () => {
      el.style.transition = "transform .6s cubic-bezier(.2,.7,.2,1)";
      el.style.transform = "none";
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return ref;
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed (the hook isn't consumed yet, so this only checks it compiles standalone).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useTilt.ts
git commit -m "feat: add useTilt hook for pointer-tilt hover effect"
```

---

### Task 5: Rewrite `Navbar`

**Files:**
- Modify: `src/components/Navbar.tsx` (full rewrite)

**Interfaces:**
- Produces: `<Navbar />` (no props), rendered globally by `src/app/layout.tsx` (already wired — no changes needed there).

- [ ] **Step 1: Replace the full contents of `src/components/Navbar.tsx`**

```tsx
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 sm:px-10 py-[18px] backdrop-blur-2xl bg-[#0B0711]/[.55] border-b border-white/[.07]">
      <a href="#top" className="flex items-center gap-3 text-[#F4EEE3]">
        <span
          className="w-3.5 h-3.5 rounded-full shadow-[0_0_14px_#FF2E93] inline-block"
          style={{ background: "linear-gradient(120deg,#FF5A3C,#7B5CFF)" }}
        />
        <span className="font-display font-bold text-[17px] tracking-[-.01em]">Jason Zhang</span>
      </a>
      <div className="flex items-center gap-4 sm:gap-[34px]">
        <a href="#about" className="text-xs sm:text-sm text-[#B7AFC2] font-medium hover:text-[#F4EEE3] transition-colors">About</a>
        <a href="#stack" className="text-xs sm:text-sm text-[#B7AFC2] font-medium hover:text-[#F4EEE3] transition-colors">Stack</a>
        <a href="#experience" className="hidden sm:inline text-sm text-[#B7AFC2] font-medium hover:text-[#F4EEE3] transition-colors">Experience</a>
        <a href="#work" className="text-xs sm:text-sm text-[#B7AFC2] font-medium hover:text-[#F4EEE3] transition-colors">Work</a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0B0711] px-3.5 sm:px-[18px] py-2 sm:py-2.5 rounded-full transition hover:brightness-[1.08]"
          style={{ background: "linear-gradient(120deg,#FF5A3C,#FF2E93 55%,#7B5CFF)" }}
        >
          Let&apos;s talk
        </a>
      </div>
    </nav>
  );
}
```

Note this is a Server Component on purpose (no `"use client"`, no hooks) — it's static markup with Tailwind-only hover states.

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed. (The site will look broken/incomplete in the browser at this point since the anchors don't resolve to sections yet — that's expected until Task 14; don't manually browser-check yet.)

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: replace icon nav with anchor-link nav"
```

---

### Task 6: Rewrite `Footer`

**Files:**
- Modify: `src/components/Footer.tsx` (full rewrite)

**Interfaces:**
- Produces: `<Footer />` (no props). Consumed by `src/app/page.tsx` in Task 14 (no longer consumed by `home_page.tsx` or `suggestion/page.tsx`, both deleted in Task 14 — don't worry about their imports breaking mid-plan; they still reference the old `Footer` shape only in the sense of rendering `<Footer />` with no props, which remains compatible until they're deleted).

- [ ] **Step 1: Replace the full contents of `src/components/Footer.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-[#08050C] text-[#F4EEE3] px-6 sm:px-10 pt-20 pb-11 overflow-hidden">
      <div
        className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[70%] h-[120%] opacity-[.16] blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle,#7B5CFF,transparent 60%)" }}
      />
      <div className="relative max-w-[1100px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display font-extrabold text-[clamp(44px,9vw,120px)] leading-[.9] tracking-[-.03em] bg-clip-text text-transparent [background-size:220%_220%] animate-[gradShift_8s_ease_infinite]"
          style={{ backgroundImage: "linear-gradient(115deg,#FF5A3C,#FF2E93 45%,#7B5CFF 75%,#24D3EE)" }}
        >
          Jason Zhang
        </motion.div>
        <div className="flex gap-3.5 justify-center mt-10 flex-wrap">
          <a
            href="mailto:zhang.qinha@northeastern.edu"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EEE3] border border-white/[.14] px-5 py-[11px] rounded-full bg-white/[.03] transition-colors hover:border-[#FF5A3C] hover:text-[#FF5A3C]"
          >
            Email
          </a>
          <a
            href="https://github.com/JasonZQH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EEE3] border border-white/[.14] px-5 py-[11px] rounded-full bg-white/[.03] transition-colors hover:border-[#F4EEE3]"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/qinhaozhang98/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EEE3] border border-white/[.14] px-5 py-[11px] rounded-full bg-white/[.03] transition-colors hover:border-[#24D3EE] hover:text-[#24D3EE]"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/str8up__z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EEE3] border border-white/[.14] px-5 py-[11px] rounded-full bg-white/[.03] transition-colors hover:border-[#FF2E93] hover:text-[#FF2E93]"
          >
            Instagram
          </a>
        </div>
        <div className="mt-11 font-mono text-xs text-[#6B6377]">
          © {new Date().getFullYear()} Jason Zhang · Designed &amp; built with care
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rewrite Footer to match redesign"
```

---

### Task 7: `Hero` component (Aurora variant)

**Files:**
- Create: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `useTilt` from `src/hooks/useTilt.ts` (Task 4); `/assets/logos/*.png` and `/avatar.jpeg` from `public/` (Task 1).
- Produces: `<Hero />` (no props). Consumed by `src/app/page.tsx` in Task 14.

- [ ] **Step 1: Create `src/components/Hero.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add Hero component (Aurora variant)"
```

---

### Task 8: `Marquee` component

**Files:**
- Create: `src/components/Marquee.tsx`

**Interfaces:**
- Produces: `<Marquee />` (no props). Consumed by `src/app/page.tsx` in Task 14.

- [ ] **Step 1: Create `src/components/Marquee.tsx`**

```tsx
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
```

No `"use client"` — this is static markup driven entirely by a CSS animation, so it can stay a Server Component.

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/Marquee.tsx
git commit -m "feat: add Marquee component"
```

---

### Task 9: `About` component

**Files:**
- Create: `src/components/About.tsx`

**Interfaces:**
- Produces: `<About />` (no props). Consumed by `src/app/page.tsx` in Task 14.

- [ ] **Step 1: Create `src/components/About.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const STATS = [
  { n: "5+", label: "Internships", from: "#FF5A3C", to: "#FF2E93" },
  { n: "6+", label: "Projects", from: "#FF2E93", to: "#7B5CFF" },
  { n: "1", label: "Publication", from: "#7B5CFF", to: "#24D3EE" },
  { n: "2", label: "Degrees", from: "#24D3EE", to: "#FF5A3C" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-[90px] bg-[#F4EEE3] text-[#1A1220] px-6 sm:px-10 py-[120px]">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[.8fr_1.2fr] gap-[60px] items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="font-mono text-xs tracking-[.24em] uppercase text-[#8A5CFF] mb-[18px]">/ about</div>
          <h2 className="font-display font-extrabold text-[clamp(34px,4.4vw,56px)] leading-[1.02] tracking-[-.02em]">
            Engineer at the intersection of AI &amp; product.
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-lg leading-relaxed text-[#4A4353]"
        >
          <p className="mb-[22px]">
            I&apos;m a Software Engineer and AI application developer holding an{" "}
            <strong className="text-[#1A1220]">M.S. in Computer Science</strong> from Northeastern University&apos;s
            Khoury College, with a foundation in Applied Statistics &amp; Data Science from Penn State.
          </p>
          <p className="mb-[34px]">
            My work spans software engineering, machine learning, and computer vision — with hands-on experience
            building agentic AI workflows, real-time systems, and lightweight deep learning models for
            resource-constrained environments.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="font-display font-extrabold text-4xl bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(120deg,${s.from},${s.to})` }}
                >
                  {s.n}
                </div>
                <div className="text-[13px] text-[#6B6470] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: add About component"
```

---

### Task 10: `Stack` component

**Files:**
- Create: `src/components/Stack.tsx`

**Interfaces:**
- Produces: `<Stack />` (no props). Consumed by `src/app/page.tsx` in Task 14.

- [ ] **Step 1: Create `src/components/Stack.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const GROUPS = [
  { label: "Languages", color: "#FF5A3C", items: ["Python", "TypeScript", "Java", "SQL", "C++"] },
  { label: "AI / ML", color: "#FF2E93", items: ["PyTorch", "LangChain", "Pydantic-AI", "CV", "Transformers"] },
  { label: "Backend", color: "#7B5CFF", items: ["Django", "FastAPI", "Node.js", "REST", "Microservices"] },
  {
    label: "Data & Infra",
    color: "#24D3EE",
    items: ["MongoDB", "Redis", "MySQL", "PostgreSQL", "Docker", "K8s", "GCP"],
  },
];

export default function Stack() {
  return (
    <section id="stack" className="scroll-mt-[90px] bg-[#EFE8DB] text-[#1A1220] px-6 sm:px-10 py-[110px]">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8 }}
          className="mb-[52px]"
        >
          <div className="font-mono text-xs tracking-[.24em] uppercase text-[#8A5CFF] mb-4">/ toolkit</div>
          <h2 className="font-display font-extrabold text-[clamp(32px,4vw,52px)] leading-none tracking-[-.02em]">
            The stack I build with
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
          {GROUPS.map((g, i) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="bg-white rounded-[20px] p-[26px] border border-black/[.06]"
            >
              <div className="font-display font-bold text-[19px] mb-4 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: g.color }} />
                {g.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[13px] bg-[#F4EEE3] px-3 py-1.5 rounded-full text-[#4A4353]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/Stack.tsx
git commit -m "feat: add Stack component"
```

---

### Task 11: `Experience` component

**Files:**
- Create: `src/components/Experience.tsx`

**Interfaces:**
- Produces: `<Experience />` (no props). Consumed by `src/app/page.tsx` in Task 14.

- [ ] **Step 1: Create `src/components/Experience.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const ITEMS = [
  {
    range: "2025.09 — 2025.12",
    title: "Teaching Assistant",
    org: "Northeastern University",
    desc: "TA for CS5610: Web Development.",
    from: "#FF5A3C",
    to: "#FF2E93",
  },
  {
    range: "2025.06 — 2025.08",
    title: "Backend SWE Intern",
    org: "XPerf",
    desc: "Engineered the backend of an AI-powered bookkeeping app with Django + Pydantic-AI agents — expense tracking, automated invoicing, and tax calculation.",
    from: "#FF5A3C",
    to: "#FF2E93",
  },
  {
    range: "2025.01 — 2025.04",
    title: "Software Engineering Intern",
    org: "IpserLab",
    desc: "AI-based travel management system using LangChain for Java.",
    from: "#FF2E93",
    to: "#7B5CFF",
  },
  {
    range: "2024.06 — 2024.08",
    title: "Software Engineering Intern",
    org: "SuperADS",
    desc: "Built AI-driven video deduplication workflows with ComfyUI custom nodes; introduced data-driven quality monitoring that raised self-check efficiency by 30%.",
    from: "#7B5CFF",
    to: "#24D3EE",
  },
  {
    range: "2023.09 — 2025.12",
    title: "M.S. Computer Science",
    org: "Northeastern University",
    desc: "Machine learning, deep learning, and big-data analytics.",
    from: "#B8FF39",
    to: "#24D3EE",
  },
  {
    range: "2022.05 — 2022.08",
    title: "Data Science Intern",
    org: "Surge Consulting",
    desc: "Automated voice-to-text pipelines (Wav2Vec 2.0), cutting manual work 40% and lifting transcription accuracy 30%, deployed on Docker + Kubernetes.",
    from: "#FF5A3C",
    to: "#24D3EE",
  },
  {
    range: "2018.09 — 2022.12",
    title: "B.S. Applied Statistics & Data Science",
    org: "Penn State",
    desc: "Foundation in statistical analysis, programming, and data-driven research.",
    from: "#FF2E93",
    to: "#B8FF39",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-[90px] bg-[#0B0711] text-[#F4EEE3] px-6 sm:px-10 py-[120px]">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-[70px]"
        >
          <div className="font-mono text-xs tracking-[.24em] uppercase text-[#8FE7F5] mb-4">/ journey</div>
          <h2 className="font-display font-extrabold text-[clamp(34px,4.6vw,58px)] leading-none tracking-[-.02em]">
            Experience &amp; education
          </h2>
        </motion.div>
        <div className="relative pl-[38px] border-l-2 border-white/10">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title + item.range}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.8, delay: i === 0 ? 0 : 0.06 }}
              className={`relative ${i < ITEMS.length - 1 ? "mb-[38px]" : ""}`}
            >
              <span
                className="absolute -left-[47px] top-1 w-4 h-4 rounded-full"
                style={{ background: `linear-gradient(120deg,${item.from},${item.to})` }}
              />
              <div className="font-mono text-xs text-[#8FE7F5] mb-1.5">{item.range}</div>
              <div className="font-display font-bold text-[22px]">
                {item.title} · <span className="text-[#B7AFC2] font-semibold">{item.org}</span>
              </div>
              <p className="text-[#C9C2D4] mt-2 leading-relaxed max-w-[640px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/Experience.tsx
git commit -m "feat: add Experience component"
```

---

### Task 12: `Work` component

**Files:**
- Create: `src/components/Work.tsx`

**Interfaces:**
- Consumes: `useTilt` from `src/hooks/useTilt.ts` (Task 4).
- Produces: `<Work />` (no props). Consumed by `src/app/page.tsx` in Task 14.

- [ ] **Step 1: Create `src/components/Work.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";

const FEATURED = {
  range: "May 2025 — Dec 2025",
  title: "Tradgent",
  desc: "An AI-powered trading recommendation system delivering real-time, personalized insights. Built on FastAPI + Pydantic-AI with MongoDB and Redis; a conversational AI advisor surfaces live guidance and risk alerts.",
  tags: ["FastAPI", "Pydantic-AI", "MongoDB", "Redis"],
};

const PROJECTS = [
  {
    num: "02",
    range: "Sep 2024 — Jan 2025",
    title: "EmojiCamera",
    desc: "Real-time facial-expression detection mapped to emojis. MobileNetV3 + attention hit 75% accuracy — co-authored a paper on lightweight FER models for low-cost compute.",
    tags: ["MobileNetV3", "Computer Vision", "Publication"],
    hover: "rgba(255,46,147,.4)",
  },
  {
    num: "03",
    range: "Mar 2024 — May 2024",
    title: "Flight Subscription Service",
    desc: "A flight-deal alert platform integrating real-time flight APIs. Users subscribe to deals and searches; built with React, Node.js, and MySQL for performance at scale.",
    tags: ["React", "Node.js", "MySQL"],
    hover: "rgba(123,92,255,.4)",
  },
  {
    num: "04",
    range: "Jan 2024 — Apr 2024",
    title: "Advanced Car Bidding System",
    desc: "A real-time car-auction platform with secure auth and dynamic bidding. Django + React + MySQL, Docker-deployed on GCP — improved usability, security, and scale.",
    tags: ["Django", "GCP", "Docker"],
    hover: "rgba(36,211,238,.4)",
  },
  {
    num: "05",
    range: "Sep 2022 — Dec 2022",
    title: "Vaccine Stock Forecast",
    desc: "Time-series forecasting (ARIMA / SARIMA) on Pfizer, J&J, and Moderna during COVID-19, trained on CDC data — a study in the limits of pandemic-only financial signals.",
    tags: ["ARIMA", "Time Series", "Forecasting"],
    hover: "rgba(255,90,60,.4)",
  },
];

function FeaturedCard() {
  const tiltRef = useTilt<HTMLAnchorElement>();
  return (
    <motion.a
      ref={tiltRef}
      href="#work"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.8 }}
      className="block relative rounded-[26px] overflow-hidden border border-white/10 p-8 sm:p-11 mb-6 text-[#F4EEE3] transition-colors hover:border-white/[.28]"
      style={{ background: "linear-gradient(140deg,rgba(255,90,60,.16),rgba(123,92,255,.16))" }}
    >
      <div className="relative flex justify-between items-start gap-5 flex-wrap">
        <div className="max-w-[640px]">
          <div className="flex items-center gap-3 mb-[18px]">
            <span className="font-mono text-xs text-[#0B0711] bg-[#B8FF39] px-3 py-[5px] rounded-full font-bold">
              FEATURED
            </span>
            <span className="font-mono text-xs text-[#8FE7F5]">{FEATURED.range}</span>
          </div>
          <h3 className="font-display font-extrabold text-[clamp(28px,3.4vw,42px)] leading-[1.02] tracking-[-.02em]">
            {FEATURED.title}
          </h3>
          <p className="text-[#D4CEDD] text-[17px] leading-relaxed mt-3.5">{FEATURED.desc}</p>
          <div className="flex flex-wrap gap-2 mt-[22px]">
            {FEATURED.tags.map((t) => (
              <span key={t} className="font-mono text-xs border border-white/20 px-3 py-[5px] rounded-full text-[#C9C2D4]">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="font-display font-extrabold text-[64px] text-white/[.14] leading-none">01</div>
      </div>
    </motion.a>
  );
}

function ProjectCard({ project, delay }: { project: (typeof PROJECTS)[number]; delay: number }) {
  const tiltRef = useTilt<HTMLAnchorElement>();
  return (
    <motion.a
      ref={tiltRef}
      href="#work"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.8, delay }}
      className="block relative rounded-[22px] bg-[#130C1F] border border-white/[.08] p-8 text-[#F4EEE3] overflow-hidden transition-colors hover:[border-color:var(--hover-c)]"
      style={{ "--hover-c": project.hover } as React.CSSProperties}
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-[#8FE7F5]">{project.range}</span>
        <span className="font-display font-extrabold text-[34px] text-white/[.12]">{project.num}</span>
      </div>
      <h3 className="font-display font-extrabold text-2xl mt-3.5 leading-[1.05]">{project.title}</h3>
      <p className="text-[#C9C2D4] text-[15px] leading-relaxed mt-3">{project.desc}</p>
      <div className="flex flex-wrap gap-[7px] mt-[18px]">
        {project.tags.map((t) => (
          <span key={t} className="font-mono text-[11px] border border-white/[.18] px-2.5 py-1 rounded-full text-[#B7AFC2]">
            {t}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

export default function Work() {
  return (
    <section id="work" className="scroll-mt-[90px] bg-[#0B0711] text-[#F4EEE3] px-6 sm:px-10 pt-10 pb-[130px]">
      <div className="max-w-[1160px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between gap-6 mb-14 flex-wrap"
        >
          <div>
            <div className="font-mono text-xs tracking-[.24em] uppercase text-[#FF2E93] mb-4">/ selected work</div>
            <h2 className="font-display font-extrabold text-[clamp(34px,4.8vw,60px)] leading-none tracking-[-.02em]">
              Projects &amp; publications
            </h2>
          </div>
          <div className="font-mono text-[13px] text-[#8B8397] max-w-[280px]">
            Real-time AI, computer vision, and full-stack systems.
          </div>
        </motion.div>

        <FeaturedCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={i % 2 === 1 ? 0.08 : 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/Work.tsx
git commit -m "feat: add Work component"
```

---

### Task 13: `Contact` component

**Files:**
- Create: `src/components/Contact.tsx`

**Interfaces:**
- Consumes: `POST /api/contact` from Task 2 (request body `{ field, email, message, canRefer, isRecruiter }`, response `{ message, id? }`).
- Produces: `<Contact />` (no props). Consumed by `src/app/page.tsx` in Task 14.

- [ ] **Step 1: Create `src/components/Contact.tsx`**

```tsx
"use client";

import { useState, FormEvent } from "react";

const FIELDS = ["Software Engineering", "Data Science", "AI / ML", "Web Development", "Other"];

export default function Contact() {
  const [field, setField] = useState(FIELDS[0]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [canRefer, setCanRefer] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, email, message, canRefer, isRecruiter }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
      setEmail("");
      setMessage("");
      setCanRefer(false);
      setIsRecruiter(false);
      setTimeout(() => setStatus("idle"), 4500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4500);
    }
  };

  return (
    <section id="contact" className="scroll-mt-[90px] bg-[#F4EEE3] text-[#1A1220] px-6 sm:px-10 py-[120px]">
      <div className="max-w-[920px] mx-auto">
        <div className="text-center mb-12">
          <div className="font-mono text-xs tracking-[.24em] uppercase text-[#8A5CFF] mb-4">/ contact</div>
          <h2 className="font-display font-extrabold text-[clamp(36px,5.2vw,68px)] leading-none tracking-[-.025em]">
            Let&apos;s build
            <br />
            something.
          </h2>
          <p className="text-[#6B6470] text-[17px] mt-[18px]">
            Recruiting, referrals, or just ideas — I&apos;d love to hear from you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[26px] p-6 sm:p-9 border border-black/[.06] shadow-[0_30px_70px_rgba(26,18,32,.08)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#4A4353] mb-2">Your field</label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full font-body text-[15px] text-[#1A1220] bg-[#F4EEE3] border border-black/[.08] rounded-xl px-3.5 py-3 outline-none focus:border-[#7B5CFF]"
              >
                {FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#4A4353] mb-2">Email</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full font-body text-[15px] text-[#1A1220] bg-[#F4EEE3] border border-black/[.08] rounded-xl px-3.5 py-3 outline-none focus:border-[#7B5CFF]"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-[13px] font-semibold text-[#4A4353] mb-2">Message</label>
            <textarea
              rows={4}
              required
              placeholder="Tell me about the role or idea…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full font-body text-[15px] text-[#1A1220] bg-[#F4EEE3] border border-black/[.08] rounded-xl px-3.5 py-3 outline-none focus:border-[#7B5CFF] resize-none"
            />
          </div>

          <div className="flex items-center gap-5 mt-5 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-[#4A4353] cursor-pointer">
              <input
                type="checkbox"
                checked={canRefer}
                onChange={(e) => setCanRefer(e.target.checked)}
                className="w-[17px] h-[17px] accent-[#7B5CFF]"
              />
              I can offer a referral
            </label>
            <label className="flex items-center gap-2 text-sm text-[#4A4353] cursor-pointer">
              <input
                type="checkbox"
                checked={isRecruiter}
                onChange={(e) => setIsRecruiter(e.target.checked)}
                className="w-[17px] h-[17px] accent-[#7B5CFF]"
              />
              I&apos;m a recruiter
            </label>
          </div>

          <div className="flex items-center gap-[18px] mt-7 flex-wrap">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2.5 font-body font-bold text-[15px] text-white px-[30px] py-[15px] rounded-full shadow-[0_14px_34px_rgba(255,46,147,.28)] transition hover:brightness-[1.07] hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(120deg,#FF5A3C,#FF2E93 55%,#7B5CFF)" }}
            >
              {status === "sending" ? "Sending…" : "Send message →"}
            </button>
            {status === "sent" && (
              <span className="font-mono text-sm text-[#1F9B5B]">✓ Thanks — I&apos;ll be in touch soon.</span>
            )}
            {status === "error" && (
              <span className="font-mono text-sm text-[#C0392B]">
                Something went wrong — try the email link in the footer instead.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: add Contact component wired to /api/contact"
```

---

### Task 14: Integration — compose the page, delete old routes, redirects, dependency cleanup

**Files:**
- Modify: `src/app/page.tsx` (full rewrite)
- Delete: `src/app/home_page.tsx`
- Delete (whole directories): `src/app/about/`, `src/app/experience/`, `src/app/project/`, `src/app/suggestion/`
- Delete: `src/components/ParticleBackground.tsx`, `src/components/LogoParticleBackground.tsx`, `src/components/CompanyLogos.tsx`
- Modify: `next.config.ts` (add redirects)
- Modify: `package.json` (remove now-unused dependencies)

**Interfaces:**
- Consumes: `Hero`, `Marquee`, `About`, `Stack`, `Experience`, `Work`, `Contact`, `Footer` (Tasks 5–13).

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

```tsx
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Stack from "@/components/Stack";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <span id="top" />
      <Hero />
      <Marquee />
      <About />
      <Stack />
      <Experience />
      <Work />
      <Contact />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Delete superseded routes and components**

```bash
rm -f src/app/home_page.tsx
rm -rf src/app/about src/app/experience src/app/project src/app/suggestion
rm -f src/components/ParticleBackground.tsx src/components/LogoParticleBackground.tsx src/components/CompanyLogos.tsx
```

These are confirmed dead after this change: `ParticleBackground.tsx` was only imported by `home_page.tsx`, `suggestion/page.tsx`, `experience/page.tsx`, `about/page.tsx`, `project/page.tsx` (all deleted above). `LogoParticleBackground.tsx` and `CompanyLogos.tsx` were only imported by `home_page.tsx` (also deleted). Do not delete `src/components/BrightnessOverlay.tsx` or `src/components/PageTransition.tsx` — both are pre-existing dead code unrelated to this change (confirmed unused today, before this PR), out of scope here.

- [ ] **Step 3: Add redirects for the retired routes**

Replace the full contents of `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/experience", destination: "/#experience", permanent: false },
      { source: "/project", destination: "/#work", permanent: false },
      { source: "/suggestion", destination: "/#contact", permanent: false },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Remove now-unused dependencies**

`@headlessui/react` and `@heroicons/react` were only used by `suggestion/page.tsx` and `experience/page.tsx` (both deleted in Step 2). `react-icons` was only used by the old `Navbar.tsx`/`Footer.tsx` (already rewritten without it in Tasks 5–6) and `CompanyLogos.tsx` (deleted in Step 2). Confirm before removing:

```bash
grep -rl "@headlessui/react\|@heroicons/react\|react-icons" src/
```

Expected: no output (no remaining usages). If this prints any file, stop and investigate before proceeding — do not remove a dependency that's still imported somewhere.

Then remove them:

```bash
npm uninstall @headlessui/react @heroicons/react react-icons
```

Do not remove `@heroui/react`, `daisyui`, or `rc-slider` — `@heroui/react` is still used by `src/components/BrightnessOverlay.tsx` (unused but not being deleted in this task), and `daisyui`/`rc-slider` are pre-existing and unrelated to this change.

- [ ] **Step 5: Verify**

```bash
npm run lint
npm run build
```

Expected: both succeed with no errors and no warnings about missing modules.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: compose single-page site, retire old routes, drop unused deps"
```

---

### Task 15: Local verification pass

**Files:** none (verification only).

- [ ] **Step 1: Lint and build**

```bash
npm run lint
npm run build
```

Expected: both succeed with zero errors.

- [ ] **Step 2: Start the dev server**

```bash
npm run dev
```

Expected: starts on `http://localhost:3000` (Turbopack dev server).

- [ ] **Step 3: Drive the site in a real browser with Playwright and confirm every piece works**

Using the Playwright MCP tools (`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_take_screenshot`, `browser_console_messages`, `browser_network_requests`), from a fresh subagent or this session:

1. Navigate to `http://localhost:3000/`. Take a screenshot. Confirm: Hero renders with avatar, "Jason Zhang" headline, both CTA buttons, and the meta-bar; no console errors.
2. Click the "About" nav link. Confirm the page scrolls to the About section (stats visible: 5+, 6+, 1, 2).
3. Click "Stack", "Experience", "Work" nav links in turn; screenshot each; confirm each section's content matches (toolkit cards; 7-entry timeline; Tradgent featured + 4 project cards).
4. Scroll to Contact. Fill in Email (`playwright-check@example.com`) and Message (`Verifying the redesign locally`), leave field as default, submit. Confirm the "✓ Thanks — I'll be in touch soon." message appears, and check `browser_network_requests` for a `POST /api/contact` with a `200` response.
5. Navigate to `http://localhost:3000/about`, `/experience`, `/project`, `/suggestion` one at a time — confirm each redirects (ends up back on `/` at the corresponding anchor) rather than 404ing.
6. Run `browser_console_messages` and confirm there are no uncaught errors (canvas/particle warnings aside from expected React dev-mode notices are fine; genuine `Error`-level entries are not).

If any check fails, fix the underlying component (in its own follow-up commit referencing which task's file it touches) before proceeding — do not report success with a failing check.

- [ ] **Step 4: Stop the dev server**

Stop the `npm run dev` process (Ctrl-C, or the equivalent for a background-run process).

- [ ] **Step 5: Write down the manual check-it-yourself steps**

No files change in this step — this produces the instructions to hand back to the user (used verbatim in the final chat summary and in the PR description in Task 16):

```
1. cd personal-website && npm install (only needed the first time after pulling this branch)
2. Copy your MongoDB URI into personal-website/.env if it isn't already there:
   grep MONGODB_URI server/.env >> .env
3. npm run dev
4. Open http://localhost:3000 — scroll through About/Stack/Experience/Work, click each nav link
5. Submit the Contact form with a real-looking email/message — expect the "Thanks" confirmation
6. Visit http://localhost:3000/about (and /experience, /project, /suggestion) — each should
   land you back on / at the matching section instead of a 404
```

- [ ] **Step 6: Commit (only if Step 3 required fixes)**

If Step 3 required no fixes, there's nothing to commit for this task. If fixes were needed, they should already be committed as part of fixing them — this step is a no-op safeguard, not a new commit.

---

### Task 16: Open the pull request

**Files:** none (git/GitHub operations only).

- [ ] **Step 1: Confirm the branch is current and push it**

From the repository root (`/Users/zqh980802/Desktop/personal/website`):

```bash
git fetch origin
git log origin/main..HEAD --oneline
git push -u origin redesign/portfolio-v2
```

Expected: the push succeeds; `git log origin/main..HEAD` shows all the commits from this plan (spec doc + 14 implementation commits).

- [ ] **Step 2: Open the PR**

```bash
gh pr create --title "Redesign: single-page portfolio from claude.ai/design mockup" --body "$(cat <<'EOF'
## Summary
- Replaces the multi-page site (/, /about, /experience, /project, /suggestion) with a single scrolling page matching the claude.ai/design "Portfolio website redesign" mockup (Aurora hero variant).
- Old routes redirect to their corresponding anchor on / instead of 404ing.
- The Contact form is fully functional: posts to a new same-origin /api/contact route backed by the existing MongoDB Atlas cluster (new `contacts` collection in `suggestionsInfoDB`) — this also fixes the pre-existing /suggestion form, which silently failed in production because it called a hardcoded `http://localhost:4000`.
- server/ (the old Express+Mongo app) is left in place, untouched, just no longer used by the site.

## Local verification
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Full section-by-section browser walkthrough done via Playwright, including a live Contact form submission (verified 200 response)
- [ ] All four retired routes (/about, /experience, /project, /suggestion) redirect correctly instead of 404ing

## How to check locally yourself
1. `cd personal-website && npm install`
2. Make sure `personal-website/.env` has `MONGODB_URI` (copy from `server/.env` if not: `grep MONGODB_URI server/.env >> .env`)
3. `npm run dev`, open http://localhost:3000
4. Scroll through About/Stack/Experience/Work, click each nav link
5. Submit the Contact form — expect the "Thanks" confirmation
6. Visit /about, /experience, /project, /suggestion — each should redirect back into the new page instead of 404ing

## Deploy note
Not deployed as part of this PR. After merging, run `npm run deploy` from personal-website/ as usual — make sure your local .env still has MONGODB_URI before you do, since the deploy script rsyncs .env along with the rest of the project.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Report the PR URL back to the user**

`gh pr create` prints the PR URL on success — surface it directly, don't just say "done."
