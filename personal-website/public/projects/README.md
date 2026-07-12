# Project images — current wiring

The Projects section (`src/components/Work.tsx`) shows Jason's three real
projects (CURATOR / EmojiCam / YourPassenger). Their visual panels render
`ImageSlot` placeholder art until the Stage-2 artwork lands.

## Adding the panel art

Each entry in `PROJECTS` (Work.tsx) is a `ProjectCardData` whose `visuals`
array holds exactly three panels:

```ts
visuals: [
  { id: "workbench", type: "product", alt: "...", asset: "/projects/curator-workbench.webp" },
  // asset omitted → on-brand gradient placeholder renders instead
]
```

Drop files in this folder and point `asset` at them. Panel geometry:

- `visuals[0]` — small landscape well (top-left)
- `visuals[1]` — landscape/square well (bottom-left)
- `visuals[2]` — tall well (right, fills the card height)

`ImageSlot` renders an on-brand gradient placeholder behind every image, so a
missing/broken file degrades gracefully instead of showing a broken-image icon.
Prefer AVIF/WebP under ~300 KB per still, exported at ~2× rendered size.

## Remaining hotlinked template assets

- Marquee belts: 21 GIFs from `motionsites.ai` (`src/components/Marquee.tsx`) —
  replaced by the 12 capability loops in Stages 2–3.
- Hero portrait: local — `public/assets/portrait/jason-hero-wink-smirk-v7.png`
- About decorations: local — `public/assets/about/*.png`
