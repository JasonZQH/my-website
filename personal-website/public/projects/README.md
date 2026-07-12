# Project screenshots — drop-in manifest

The v3 Projects section shows 3 image wells per project. Until a file is wired in,
each well renders on-brand gradient placeholder art, so missing images never look broken.

## Expected files (15 total)

| Project | Slot a (top-left) | Slot b (bottom-left) | Slot c (right, tall) |
|---|---|---|---|
| Tradgent | `tradgent-a.webp` | `tradgent-b.webp` | `tradgent-c.webp` |
| EmojiCamera | `emojicamera-a.webp` | `emojicamera-b.webp` | `emojicamera-c.webp` |
| Flight Subscription Service | `flight-subscription-a.webp` | `flight-subscription-b.webp` | `flight-subscription-c.webp` |
| Advanced Car Bidding System | `car-bidding-a.webp` | `car-bidding-b.webp` | `car-bidding-c.webp` |
| Vaccine Stock Forecast | `vaccine-forecast-a.webp` | `vaccine-forecast-b.webp` | `vaccine-forecast-c.webp` |

- **a** — small landscape (~16:10), displayed ~84–150 px tall
- **b** — landscape/square, displayed ~112–205 px tall
- **c** — tall portrait (~3:4), fills the right column

`.png` / `.jpg` also fine — just match the name you wire up. Source ~1280 px wide is plenty.

## Wiring a shot in

Each project in `src/components/Work.tsx` has an `images: { a?, b?, c? }` field.
Drop the file here, then set the path, e.g.:

```ts
images: { a: "/projects/tradgent-a.webp" }
```

Any subset works — unset slots keep their placeholder art.

## Optional: About-section decorations

4 small square PNG renders (transparent bg) at `public/decor/1.png` … `4.png`,
wired the same way in `src/components/About.tsx`. Omitted → gradient shapes.
