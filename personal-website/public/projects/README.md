# Project images — current wiring

The Projects section (`src/components/Work.tsx`) shows Jason's three real
projects (CURATOR / EmojiCam / YourPassenger). Each panel is a coded React
component (`src/components/projects/*Panels.tsx`), so no image files are
needed. Setting a visual's `asset` path overrides the coded panel with an
`ImageSlot` image instead.

## Overriding a panel with an image

Each entry in `PROJECTS` (Work.tsx) is a `ProjectCardData` whose `visuals`
array holds exactly three panels:

```ts
visuals: [
  { id: "workbench", type: "product", alt: "...", asset: "/projects/curator-workbench.webp" },
  // asset omitted → the coded panel renders (the default for all three projects)
]
```

Drop files in this folder and point `asset` at them. Panel geometry:

- `visuals[0]` — small landscape well (top-left)
- `visuals[1]` — landscape/square well (bottom-left)
- `visuals[2]` — tall well (right, fills the card height)

`ImageSlot` renders an on-brand gradient placeholder behind every image, so a
missing/broken file degrades gracefully instead of showing a broken-image icon.
Prefer AVIF/WebP under ~300 KB per still, exported at ~2× rendered size.

## Local media inventory

No remote/template assets remain. Hero portrait:
`public/assets/portrait/jason-hero-wink-smirk-v7.webp`; About decorations:
`public/assets/about/*.png`; marquee tiles and project panels are coded
components (`src/components/capability/`, `src/components/projects/`).
