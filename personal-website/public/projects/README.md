# Project images — current wiring

The Projects section (`src/components/Work.tsx`) currently shows the **reference
design's placeholder projects** (Nextlevel Studio / Aura Brand Identity / Solaris
Digital) with images hotlinked from the template's CDN. That look was chosen
deliberately to match the reference template — but the content is not Jason's
work, so swap it before launch.

## Swapping in real projects

Each entry in `PROJECTS` (Work.tsx) has:

```ts
{
  category: "Client" | "Personal" | ...,   // small label above the title
  title: "...",
  href: "...",                              // Live Project link target
  slug: "...",                              // React key
  images: { a: "...", b: "...", c: "..." }, // top-left, bottom-left, right (tall)
}
```

To use local screenshots instead of hotlinks: drop files in this folder and point
the fields at them, e.g. `images: { a: "/projects/tradgent-a.webp", ... }`.

- **a** — small landscape well (top-left)
- **b** — landscape/square well (bottom-left)
- **c** — tall well (right, fills the card height)

`ImageSlot` renders an on-brand gradient placeholder behind every image, so a
missing/broken file degrades gracefully instead of showing a broken-image icon.

## Other hotlinked template assets (same caveat)

- Marquee belts: 21 GIFs from `motionsites.ai` (`src/components/Marquee.tsx`)
- About decorations: 4 3D-object PNGs from the template's Figma site
  (`src/components/About.tsx`)
- Hero portrait: local — `public/assets/portrait/jason-hero-wink-smirk-v7.png`
