# Rontee — Project Record

> Living source of truth for the product, design system, decisions and progress.
> Loaded automatically via `CLAUDE.md`. **Update this file whenever a decision is
> made or a screen changes status** (add a Change log entry at the bottom).

## Product

**Rontee** — personal memory assistant. Promise: **"Never forget what matters."**
Remembers important dates (birthdays, anniversaries, renewals, subscriptions,
deadlines) and nudges by email + web push. Not a calendar, not a to-do app.

Product rules (from `docs/product-plan/*.pdf`, gitignored — still binding):
- **Guest-first**: create the first reminder before signing up; the draft must survive auth (no loss, no duplicates).
- **Exactly three creation steps**: 1 Remember (what) → 2 When (date, repeat) → 3 Remind me (advance offsets). Show "Step N of 3 · X left". Back never loses data. No channel picker in the flow (channels live in Settings).
- **View ≠ Edit**: Reminder Details (read) and Edit Reminder are separate screens.
- **Dashboard answers "What do I need to remember?"** — no KPI cards/analytics.
- Free + Pro planned (5 active reminders proposed for Free); upgrade prompts contextual + dismissible. Plan & Billing lives under Settings/account menu, not primary nav.
- Primary app nav: Dashboard, Reminders, Calendar, Settings.
- Categories: Personal, Financial, Documents, Work/Education (+ custom).

## Design ownership & direction

Claude owns the design (since 2026-10-25). The old Stitch screens and the **visual**
parts of the PDF brief (teal, Manrope) are overridden. `docs/product-design-inspo/`
(26 images, gitignored — never put them back in `public/`) was the first reference,
but most of it is AI/SaaS sites — **don't drift back to that look**.

**Current direction (2026-10-25, v2 — user feedback "too SaaS"):**
**Friendly, warm, simple, personal.** It should feel like a kind friend with a good
memory, not a productivity tool.
- Warm cream paper + soft ink, **five pastels** that each mean a category, tomato for "today/urgent".
- **Paper objects instead of tech visuals**: sticky notes, tear-off calendar, handwritten notes, doodles. Interactive (drag, tear, wiggle), playful springs.
- **Show people's moments, not software.** At most *one* small product moment per section (e.g. a friendly notification).
- **Fewer sections, less going on.** No dark cinematic sections, no scroll-jacking/pinning, no WebGL/particles, no mono "001 • LABEL" eyebrows, no bento of UI mocks.
- **Friendly copy**: plain words, warm, a bit of humour ("That free trial you'll *definitely* forget to cancel"). Avoid product-speak ("use cases", "handled", "seamless").
- Theme: light by default everywhere; Dark and System are designed options (ThemeMenu). Dark = warm, lamp-lit "evening" charcoal (not near-black — user found the first dark too dark); pastels slightly softened; white paper tinted cream (`dark:bg-[#ece3d2]`).

## Design system

### Color (tokens in `app/globals.css`; mirror in `lib/design-tokens.ts`)

| Token | Light | Dark |
|---|---|---|
| background (cream paper) | `#F7F2E8` | `#27231E` (warm evening) |
| surface | `#FFFDF8` | `#302B25` |
| surface-subtle | `#EFE8DA` | `#3A342D` |
| foreground / ink | `#1E1B16` | `#F5EFE4` |
| muted | `#6B6358` | `#BDB3A4` |
| faint (decorative/placeholder only) | `#A69D8F` | `#857B6D` |
| border / border-strong | `#E6DDCC` / `#D6CBB6` | `#423B33` / `#554C41` |
| primary (buttons) | ink `#1E1B16` | `#F5EFE4` |
| ember (tomato) / ember-subtle | `#E8573A` / `#FBE3DA` | `#F2735A` / `#4A2C22` |
| butter / sage / sky / blush | `#F6D86B` / `#A8C3A0` / `#A9C9E8` / `#F2B8B0` | `#E6CA62` / `#9AB493` / `#9DBCD9` / `#E2AAA2` |

- **Colour = category** (`lib/categories.ts`): Personal → blush, Financial → sage, Documents → sky, Work & study → butter. Use the same mapping on every screen (notes, chips, dots, lists).
- Text on a pastel is always `text-ink` (stays dark in both themes).
- Tomato (`ember`) = small dots, "today", urgency, squiggles. Never a large fill.
- **Legacy alias:** `accent*` tokens map to neutral ink (were teal). New code uses `primary` / `ember` / pastels, never `accent`.
- Shadows: `shadow-subtle`, `shadow-elevated`, `shadow-float`, **`shadow-paper`** (paper objects). Radii 8/12/16/24/32; cards ~28px, big panels 36px, buttons pill.

### Typography (next/font in `app/layout.tsx`)
- **Bricolage Grotesque** (variable, optical sizing) — UI + headlines (`font-sans`). Headlines weight 600, tight tracking. Warm and characterful at display sizes.
- **Instrument Serif italic** — accent words only (`.type-serif`), e.g. "what *matters.*", "a *friend.*"
- **Caveat** — handwriting on paper notes / annotations only (`font-hand`, `.type-hand`).
- No mono font (system mono fallback only).
- Scale: `.type-display`, `.type-h1`, `.type-h2`, `.type-h3`, `.type-body-lg`, `.type-body`, `.type-body-small`, `.type-caption`, `.type-label`, `.type-eyebrow` (small sans label).
- Patterns: solid ink headline + one serif-italic phrase; tomato hand-drawn `<Squiggle>` under the key word; `<Eyebrow dot="sky">` pill with a pastel dot.

### Paper toolkit (`components/landing/paper.tsx`)
`PaperNote` (category colour, tape, folded corner), `Polaroid` (photo print + handwritten caption), `Draggable` (drop-in spring, drag within constraints on fine pointers only — touch keeps native scroll; tap = wiggle), `useFinePointer`, `TearOffCalendar` (auto/tap tears the sheet; real 2026 weekdays), `Squiggle`, `DoodleArrow`. Reuse these in the app (empty states, onboarding, confirmations).

### Motion (`lib/motion.ts`, `components/shared/kinetic.tsx`)
- Playful, physical, light: springs with a little overshoot for paper, expo-out for text.
- Primitives: `MaskReveal` (word-by-word rise; supports serif segments + `lineClassName="text-balance"`), `FadeIn`, `Magnetic`, `SpotlightCard`, `Eyebrow`.
- **Lenis** smooth scroll on marketing pages only (`components/providers/smooth-scroll.tsx`, autoRaf). No GSAP / three.js (removed).
- Everything respects `prefers-reduced-motion`.
- Legacy primitives in `components/shared/motion.tsx` (FadeUp, Stagger, Typewriter, Meter) are still used by old screens.

### Transitions — nothing should hard-cut (user requirement, 2026-10-25)
Every change of page, step, state or component must flow.
- **Pages:** React `<ViewTransition>` (bundled with Next 16). Wrap each page's content in `<PageTransition>` (`components/shared/page-transition.tsx`) **in page.tsx, not a layout**. Tag links/pushes with `transitionTypes={["nav-forward"]}` / `["nav-back"]` for directional slides; untyped navigations get a blur-crossfade (`page-fade`). CSS lives at the end of `globals.css`.
- **Shared elements:** `<Shared name={SHARED.x}>` morphs an element across pages (logo; hero capture field → wizard writing card). One instance per name per page. The destination must render **in the same commit** as the navigation: no `useSearchParams` + Suspense fallback on the destination (read `searchParams` in the server page and pass props instead).
- **Theme switch:** `transitionTheme()` (`lib/theme-transition.ts`) — circular reveal from the click point via `document.startViewTransition`; applies the theme class synchronously (next-themes only applies it in an effect, too late for the snapshot); `html.theme-vt` scopes the CSS. Instant fallback without support / reduced motion.
- **In-page states:** framer-motion. Direction-aware slides with blur (`STEP_VARIANTS` in the wizard), `AutoHeight` for panel height, `layoutId` sliding highlights (chips, calendar day, repeat thumb, theme menu), `AnimatePresence mode="popLayout"` for text swaps, shared `layoutId` objects across states (the wizard's `draft-note`).
- Don't animate CSS variables with framer (use class transitions). Don't define components inside render (remounts kill animations).

### Brand
- Logo: `components/shared/logo.tsx` — **R mark** (ink rounded tile, lowercase "r" reaching for a **tomato dot** = the thing remembered) + lowercase **"rontee"** wordmark (real text, inherits Bricolage).
- Favicon set: `app/icon.svg` (adapts to dark tab bars), `app/favicon.ico` (16/32/48, generated from the mark with sharp), `app/apple-icon.tsx` (180px).
- Voice: warm, plain, a little playful. "Mum's birthday is in 7 days 🎂 Maybe order that scarf she liked?"

### Photos (`public/images/photos/`)
CC0 photos from StockSnap (via the Openverse API, `license=cc0`), smart-cropped to 640×640 WebP. Shown only as polaroids. No attribution legally required; credits kept here:
- `mum-hug.webp` — "Mother Daughter", Candace McDaniel — https://stocksnap.io/photo/mother-daughter-6BLG9YCQ2D
- `birthday-cake.webp` — "Birthday Cake", Altered Reality — https://stocksnap.io/photo/birthday-cake-W7T1J6B7DM
- `grandma.webp` — "Mother Generation", Candace McDaniel — https://stocksnap.io/photo/mother-generation-PEFKCYN1NY
- `passport.webp` — "Passport Table", Kristin Hardwick — https://stocksnap.io/photo/passport-table-VZTYVVUYZB
- `roses.webp` — "Flowers Bouquet", Kelly Ishmael — https://stocksnap.io/photo/flowers-bouquet-CNEX3ZDN3G
- `mum-child.webp` — "Mother Child", Family First — https://stocksnap.io/photo/mother-child-HE2S42Y7QG

New photos: warm, bright, real-life moments; avoid seasonal (Christmas) and dark/moody shots; CC0 only.

## SEO
- Site constants: `lib/site.ts` (`NEXT_PUBLIC_SITE_URL` overrides `https://rontee.vercel.app`).
- Root metadata + viewport/theme-color in `app/layout.tsx`; per-page `title`, `description`, `alternates.canonical`. **Never put canonical/openGraph.url in the root layout** (children inherit it). Page-level `openGraph` replaces the parent object wholesale — don't set partial OG on pages.
- `app/opengraph-image.tsx` (default share card), `app/robots.ts` (app routes + reset flow disallowed; `/reminders/new` explicitly allowed), `app/sitemap.ts` (public routes), `app/manifest.ts`.
- Landing JSON-LD: WebSite, Organization, WebApplication, FAQPage (FAQ copy in `components/landing/faq-data.ts`).
- forgot/reset-password are `noindex`.

## Stack
Next.js 16.3.6 (App Router, Turbopack) · React 19.2 · TS strict · Tailwind v4 (CSS-first `@theme`) ·
shadcn-pattern UI + Radix · next-themes (class, default **light**) · framer-motion · **lenis** ·
lucide-react · date-fns.
Still deliberately absent: backend, DB, auth backend, notifications, billing, TanStack Query, RHF/Zod, Zustand.

Read `node_modules/next/dist/docs/` before using Next APIs (see AGENTS.md).

## Workflow
- **One screen at a time.** Build Desktop Light → Dark → Mobile, verify, then get the user's approval before the next screen.
- Verify: `npx tsc --noEmit` · `npm run lint` · `npm run build`; visually at 1440×900 and 390×844, light + dark, no horizontal overflow.
- No browser extension here: screenshots via `puppeteer-core` driving system Edge (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`), installed in the session scratchpad, not the project. Launch with `--disable-gpu` (swiftshader leaves unpainted 256px tile bands in dark screenshots — a renderer artifact, not a page bug). Scroll in small steps so in-view animations play.
- User usually has `next dev` running on :3000 — reuse it.
- Files are CRLF on disk after git checkouts — scripted edits must handle `\r\n` (prefer the Edit/Write tools).
- Commit only when asked; user is fine with work landing on `main` (previously merged via fast-forward).

## Screen status

| # | Screen | Route | Status |
|---|---|---|---|
| 0 | Foundation (tokens, type, motion, logo, favicon, SEO) | — | ✅ v2 (friendly) 2026-10-25 |
| 1 | Landing | `/` | 🟡 v2 friendly rebuild 2026-10-25 — awaiting user review |
| 2 | Create reminder (3 steps) | `/reminders/new` | 🟡 Built 2026-10-25 — awaiting user review |
| 3 | Reminder ready (guest / saved) | `/reminders/new` states | 🟡 Built with screen 2 (needed for continuous transitions) — awaiting review |
| 4 | Auth: sign up, log in, forgot, reset | `/signup` `/login` `/forgot-password` `/reset-password` | 🟡 Rebuilt 2026-10-26 — awaiting user review |
| 5 | Dashboard | `/dashboard` | ⬜ Not built |
| 6 | Reminders list | `/reminders` | ⬜ |
| 7 | Reminder details | `/reminders/[id]` | ⬜ |
| 8 | Edit reminder | `/reminders/[id]/edit` | ⬜ |
| 9 | Calendar | `/calendar` | ⬜ |
| 10 | Settings (profile, notifications, appearance, security) | `/settings/*` | ⬜ |
| 11 | Plan & Billing | `/settings/billing` | ⬜ |

### Landing composition (`app/page.tsx`) — v2
1. **Navbar** — transparent → floating capsule on scroll; hides on scroll-down; sliding hover pill; mobile full-screen sheet (pauses Lenis). CTA "Start a reminder".
2. **Hero** (v3, 2026-10-26) — one centred stage, no pill, no two columns. "Never forget" + a sticky note slapped on beneath it that cycles in category colours (Mum’s birthday → the rent → your passport → that deadline) and rests on a cream "what *matters.*" note with the tomato squiggle (`SlapNote`; sr-only "what matters." in the h1; static under reduced motion). Copy, centred `QuickCapture` (`center`), ticks. Desktop (lg+): polaroid, tear-off calendar and three notes scattered round the edges of a faint dotted desk, draggable across the whole hero; "psst… move us around" (xl, fine pointer). Mobile: a small strip of paper under the capture.
3. **How it works** — "As easy as telling *a friend.*" Three cards with pastel art areas: note writes itself → 12th gets circled → friendly notification pops in (the one product moment).
4. **What to remember** — "Big dates, little dates, and everything *in between.*" Category legend + wall of 12 items: 8 handwritten notes + 4 polaroids (cake, passport, roses, grandma) (colour = category), springy pop-in, hover straightens, draggable on desktop.
5. **FAQ** — friendly accordion (+ FAQPage JSON-LD).
6. **Final CTA** — butter-yellow panel "Go on, what don't *you want to forget?*" + QuickCapture; a polaroid + a note tucked in the corners (lg).
7. **Footer** — simple, light, handwritten tagline, theme menu.

### Create-reminder flow (`components/reminders/`) — v2
- `wizard.tsx` orchestrates: steps 1–3 + ready/saved, direction, friendly guesses, AutoHeight, draft persistence. Page (`app/reminders/new/page.tsx`) is dynamic and passes `initialWhat` (`?q=`) and `recovered` (`?recovered=1`); the held draft is read from localStorage after hydration via `useSyncExternalStore` and adopted during render.
- `draft-note.tsx`: **the draft note** — one `layoutId` object: desktop sidebar (aside), mobile strip (compact), confirmation centrepiece (hero). Writes the title live in handwriting, takes the category colour, pins date/repeat and (from step 3) the nudges; parts are tappable to jump back to that step. `PaperConfetti` burst on ready/saved; "Saved ✓" stamp.
- Step 1 `step-what.tsx`: writing card (shared with hero capture), example chips, optional category (auto-guessed via `guessCategory` until touched).
- Step 2 `step-when.tsx`: date auto-picked if mentioned (`guessDate`, next occurrence), repeat auto-guessed (`guessRepeat`) until touched; quick picks; Monday-first calendar with sliding months + sliding day pill; repeat segmented control.
- Step 3 `step-timings.tsx`: sqrt-scaled lead-up timeline; toggle cards with drawn checks; nudges that would land in the past are disabled and filtered out when entering the step.
- `ready-guest.tsx` (sign up with Google/email, log in, change something) and `ready-saved.tsx` (lists nudge dates; add another / home).
- Header: `flow-header.tsx` + `step-progress.tsx` (filling segments, crossfading label, "All done").
- Draft model gained `category`; `EMPTY_DRAFT.timings` = [7, 1].

### Auth screens (`components/auth/`) — v2
- `auth-layout.tsx`: calm header (shared logo, context link, theme, close), form left (max 440), "paper corner" right (lg+), small footer. Pages wrap it in `<PageTransition>`.
- `auth-art.tsx`: per-page dotted desk of draggable paper (signup: Mum polaroid + 3 notes; login: tear-off calendar + roses + "Welcome back!"; forgot: "happens to the best of us" note + Gran polaroid + spam p.s.; reset: fresh-start note + cake polaroid + nudge note) with a handwritten caption.
- **Held draft travels**: signup/login read the guest draft (`useHeldDraft`, `lib/use-client.ts`) and show it instead of the desk (desktop: on the board; mobile: compact strip above the form). It shares `SHARED.draft` with the wizard's ready/saved note, so it morphs wizard → signup → back to "Saved ✓". After signup/login with a draft: "See my reminder" → `/reminders/new?recovered=1`. The wizard clears the draft once adopted (no duplicates).
- Fields (`auth-widgets.tsx`): 52px rounded inputs, friendly inline errors (shown after first submit), show/hide toggle, 3-segment strength meter, pending submit (900ms pretend request), `AuthSwap` form↔done slide with auto height, heading focus on state change.
- Fields: signup = optional first name + email + password (no confirm field — toggle + meter instead); login = email + password ("Forgot it?"); forgot → "Check your inbox" with 30s resend cool-down; reset = one new password + meter → "All sorted." → log in.
- Copy: "Make yourself *at home.*" / "Let's keep it *safe.*" (with draft), "Welcome *back!*", "Forgot your *password?*", "Pick a new *password.*"

## Gotchas (keep)
- SVG coordinates computed with trig must be rounded (server vs client `Math.cos` differ in last digits → hydration mismatch).
- If you ever add GSAP pinning back: ScrollTrigger disables pin spacing when the pinned element's parent is flex — keep `<main>` block and set `pinSpacing: true`.
- ThemeMenu reads next-themes only after mount (`useSyncExternalStore` mounted flag) to avoid hydration mismatch. Keep this pattern for any theme-dependent attributes.
- framer `drag` + `touch-none` blocks page scroll on phones — only enable drag on fine pointers.
- `Draggable` uses **numeric** drag limits measured with a ResizeObserver (`useDragLimits` in `paper.tsx`), not framer ref constraints: those re-project items on every window resize from a measurement taken mid drop-in, which flung items to mirrored spots (also hit full-page screenshots).
- `html`/`body` use `overflow-x: clip` (not hidden).
- Flex `truncate` children need `min-w-0 flex-1`.
- If `tsc` fails only inside `.next/dev/types`, delete `.next` and re-run.
- Shared helpers: `useMediaQuery` / `useWide` / `useHeldDraft` in `lib/use-client.ts`; `loadDraft()` is cached by the raw localStorage string (stable `useSyncExternalStore` snapshot); `clearDraft()`.
- Wizard (old): draft held in localStorage `rontee:reminder-draft` across the signup detour; `?recovered=1` restores to saved; `?q=` prefills step 1. Step transitions scroll to top + focus `#wizard-heading`.

## Open items / to confirm with user
- Landing copy claims to verify: "Free to start", Pro "on the way", FAQ answers.
- Privacy / Terms pages don't exist (footer links are `#`).
- `npm audit` shows pre-existing advisories in `next` (16.0–16.4, critical: 'use cache' leak), `sharp`, `source-map-js`, `zod` — not addressed yet; upgrading Next needs a deliberate pass.
- Final production domain (update `NEXT_PUBLIC_SITE_URL`).

## Change log
- **2026-10-25** — Redesign kickoff. Claude takes over design; teal/Manrope/Stitch dropped. Foundation: tokens, motion system, new R mark + wordmark, favicon set, full SEO (metadata, OG image, robots, sitemap, manifest, JSON-LD). Landing v1 (monochrome, WebGL orb, pinned scenes, dark cinematic sections). ThemeMenu moved to `components/shared/theme-menu.tsx`. This file supersedes the (gitignored) HANDOFF.md — don't follow it. Committed + pushed to `main` (07bce10, ebe14c5). Private docs moved to `docs/` (gitignored).
- **2026-10-25 (v2)** — User: v1 felt "SaaS-like", wanted friendlier, simpler, less chaotic, friendlier copy, more colour. New direction: warm cream + 5 category pastels + tomato; Bricolage Grotesque + Instrument Serif + Caveat (Geist/Geist Mono dropped); paper objects (sticky notes, tear-off calendar) replace WebGL/particles; landing cut to 5 sections; no dark sections, no pinning. Removed gsap, @gsap/react, three, @types/three, lib/webgl, marquee/manifesto/unburden/use-cases/visuals. Added `lib/categories.ts`, `components/landing/paper.tsx`, `remember-wall.tsx`.
- **2026-10-25 (v2.1)** — Added 6 CC0 photos as polaroids (hero, wall, CTA); `Polaroid` component. Dark mode lightened to a warm evening charcoal (#27231E) at the user's request; cream-tinted paper in dark.
- **2026-10-25 (screen 2+3)** — Create-reminder flow + ready states rebuilt in the friendly style with continuous transitions: page view transitions (crossfade/directional, logo + capture-field morph), circular theme reveal, direction-aware step slides, auto-height panel, travelling draft note, sliding highlights. `/reminders/new` now dynamic (searchParams via props) so the morph can pair.
- **2026-10-26 (screen 4)** — Auth screens rebuilt in the friendly style: shared shell with paper-desk art per page, the guest's held draft morphs wizard → signup/login → saved, friendlier fields (optional name, no confirm-password, strength meter, inline errors, pending state), forgot-password resend cool-down. Wizard now clears the held draft after adopting it. Fixed `Draggable` items jumping to mirrored positions on window resize (numeric drag limits), which also affected the landing hero.
- **2026-10-26 (hero v3)** — User didn’t like the two-column hero or the "A friendly little reminder app" pill. Hero is now a single centred stage with a cycling slapped-on sticky note under "Never forget", paper scattered round the edges of the desk.
