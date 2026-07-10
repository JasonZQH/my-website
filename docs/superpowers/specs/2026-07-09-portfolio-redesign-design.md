# Portfolio redesign — design spec

## Goal

Replace the current multi-page Next.js site with the single-page portfolio designed in the claude.ai/design project "Portfolio website redesign" (`Portfolio.dc.html`), ship it as one PR against `main` on `JasonZQH/my-website`, ready to merge. Deployment to the live Lightsail server happens separately — the user runs `npm run deploy` themselves after reviewing the merged result.

## Decisions from brainstorming

- **Full replace**, not a restyle: `/about`, `/experience`, `/project` stop existing as routes; their content becomes anchor sections (`#about`, `#stack`, `#experience`, `#work`, `#contact`) on a single scrolling `/`.
- **`/suggestion` is dropped.** Its Express+Mongo backend (`server/`) is left in the repo untouched but becomes unused by the site.
- **Contact form must be real, not decorative.** The mockup's submit handler is local-state-only (`setState({submitted:true})`, no network call) — that's inherent to how claude.ai/design mockups work, not a deliberate choice for this project. The existing `/suggestion` form was already broken in production (hardcoded `fetch("http://localhost:4000/...")`, unreachable from a visitor's browser). Fix: a same-origin Next.js API route backed by the existing MongoDB Atlas cluster, replacing reliance on the separate Express process.
- **Hero variant: Aurora only** (the mockup's own default). The Constellation variant and the props-driven toggle between them are a design-tool preview affordance, not something the shipped site needs.
- **Deploy execution is out of scope for me** — I prepare the branch/PR only; the user deploys.

## Architecture

Single Next.js App Router page (`src/app/page.tsx`) composing section components in order:

`Navbar → Hero (Aurora) → Marquee → About → Stack → Experience → Work → Contact → Footer`

All sections are new/rewritten components under `src/components/`, ported from the mockup's inline HTML/CSS/vanilla-JS into React + Tailwind + `framer-motion` (already a project dependency), following the existing component-per-file convention.

Effect ports (vanilla JS → React idioms already used in this repo):
- Scroll-reveal (`data-reveal` + hand-rolled `IntersectionObserver` in the mockup) → `framer-motion`'s `whileInView`, since framer-motion is already the project's animation library.
- Hover-tilt on cards/avatar → a small shared `useTilt` hook (pointer-move → rotateX/rotateY transform), used in 2–3 places.
- Canvas particle background + logo "drop-in" animation → ported close to 1:1 into a `Hero` component using `useRef`/`useEffect`, since these are genuinely custom canvas/DOM logic with no existing project idiom to reuse.
- Marquee, gradient text, blob backgrounds → pure CSS, ported as-is into `globals.css` keyframes + Tailwind utility classes.
- Fonts: Bricolage Grotesque / Space Grotesk / JetBrains Mono via `next/font/google` in `layout.tsx`, replacing the current Geist fonts sitewide (the redesign becomes the entire site, so this is a sitewide swap, not scoped to one page).

Global chrome staying as-is: `MouseGlow` (harmless over both light and dark sections). `PageTransition` is already unused today (not wired into `layout.tsx`) — left alone.

## Data flow: Contact form

`Contact.tsx` (client component) → `POST /api/contact` (new Next.js route handler, `src/app/api/contact/route.ts`) → `src/lib/mongodb.ts` (cached-client helper, standard Next.js+MongoDB pattern to avoid connection-per-request in dev) → same MongoDB Atlas cluster already used by `server/`, new `contacts` collection in the existing `suggestionsInfoDB` database.

Requires adding `MONGODB_URI` to `personal-website/.env` (copied from the existing `server/.env` value, never printed to the conversation) and adding `mongodb` as a dependency in `personal-website/package.json` (currently only present under `server/`). Since `rsync` in `npm run deploy` copies the whole project including `.env`, no extra deploy-step changes are needed once the value is in place locally.

## Other changes

- **Redirects for old URLs** (`next.config.ts`): `/about → /#about`, `/experience → /#experience`, `/project → /#work`, `/suggestion → /#contact`, so any existing bookmarks/inbound links (LinkedIn, resume PDFs, search results) don't dead-end in a 404.
- **Assets**: pull the 9 company-logo PNGs and the avatar image from the claude.ai/design project's `assets/` via `DesignSync` into `public/assets/logos/`.
- **Footer.tsx**: rewritten in place to match the new design's footer (large gradient wordmark, pill social links) — currently a small `fixed bottom-0` bar; becomes a normal in-flow end-of-page section instead.
- **Navbar.tsx**: rewritten in place — icon-based multi-page nav becomes the anchor-link nav from the mockup (About/Stack/Experience/Work + "Let's talk" CTA).

## Testing / verification

No test suite exists in this repo today (no Jest/Playwright config), so verification is:
1. `npm run lint` and `npm run build` must pass clean — this is the "mergeable" bar given there's no CI.
2. Start the dev server and drive it in a real browser (Playwright): scroll through every section, confirm nav anchors work, submit the Contact form and confirm a 200 response (proves the Mongo write succeeded). This will write one real test document into the production Atlas cluster's new `contacts` collection — harmless, but flagged here rather than silently done.
3. Confirm the four old routes now redirect instead of 404.

## Explicitly out of scope

- Any CI/CD pipeline setup (the repo has none today; not introducing one here).
- Running `npm run deploy` / touching the live Lightsail server, Nginx, or PM2 config.
- Deleting the `server/` Express app.
- Merging the PR (opened for review; user merges).
