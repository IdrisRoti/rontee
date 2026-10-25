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

## Design ownership & direction (since 2026-10-25)

Claude owns the design. The old Stitch screens and the **visual** parts of the PDF
design brief (teal, Manrope, "no glass / no parallax / subtle motion only") are
**overridden**. Visual reference: `docs/product-design-inspo/` (26 images, gitignored — never put them back in `public/`).
Motion references: sooft.work, useaccrue.com, bdsn.club, eszterbial.com, apple.com,
unseen.co, lusion.co.

Principles: visually rich + simple to use ("simple" ≠ empty). Editorial type,
monochrome surfaces, textured generative visuals (dot-matrix, halftone, particles,
grain), live UI previews instead of illustrations, advanced but purposeful motion.

**Theme strategy (option C):** Light is the default everywhere. The landing page
alternates in **dark cinematic sections** (`.scheme-dark`) for drama. The app is
light by default; Dark and System are fully designed options (ThemeMenu).

## Design system

### Color (tokens in `app/globals.css`; mirror in `lib/design-tokens.ts`)
Monochrome + **one tiny warm accent ("ember")**. Ember is for urgency, notification
dots, one highlight per view — never large fills.

| Token | Light | Dark |
|---|---|---|
| background | `#F5F4F0` (warm paper) | `#0B0B0A` |
| surface | `#FFFFFF` | `#141413` |
| surface-subtle | `#EDECE7` | `#1B1B19` |
| foreground | `#0F0F0E` | `#EDEBE5` |
| muted | `#67665F` | `#96948D` |
| faint (decorative/placeholder only) | `#A3A19A` | `#5C5B56` |
| border / border-strong | `#E3E1DB` / `#D1CFC8` | `#262624` / `#363531` |
| primary (buttons) | ink `#0F0F0E` | bone `#EDEBE5` |
| ember / ember-subtle | `#E8572A` / `#FBE8DF` | `#FF6A3D` / `#2B1810` |

- `.scheme-dark` forces dark tokens on a subtree regardless of theme (cinematic sections). Inside it, avoid `dark:` variants — use tokens.
- **Legacy alias:** `accent*` tokens now map to neutral ink (were teal) so un-redesigned screens are neutral. New code uses `primary` / `ember`, never `accent`.
- Shadows: `shadow-subtle`, `shadow-elevated`, `shadow-float`. Radii 8/12/16/24/32; cards ~28px, buttons pill (`rounded-full`).

### Typography (next/font in `app/layout.tsx`)
- **Geist Sans** — UI + headlines (`font-sans`). Headlines weight 500, tight tracking.
- **Instrument Serif italic** — accent words only (`.type-serif`), e.g. "what *matters.*"
- **Geist Mono** — eyebrows, dates, counters, step numbers (`font-mono`, `.type-eyebrow`).
- Scale classes: `.type-display` (to 108px), `.type-h1`, `.type-h2`, `.type-h3`, `.type-body-lg`, `.type-body`, `.type-body-small`, `.type-caption`, `.type-label`, `.type-eyebrow`.
- Pattern: two-tone headlines (faint line → ink line), mono eyebrow pill `001 • SECTION` (`<Eyebrow>`).

### Motion (`lib/motion.ts`, `components/shared/kinetic.tsx`)
- Eases: `EASE.outExpo` (entrances), `outQuart`, `inOutQuart` (sheets/wipes). Tailwind: `ease-out-expo` etc.
- Springs: `SPRING.snappy` (controls, sliding highlights via `layoutId`), `soft` (panels/menus), `magnetic`.
- Primitives: `MaskReveal` (word-by-word masked rise, supports serif segments), `FadeIn` (rise + blur-in), `Magnetic`, `SpotlightCard` (cursor light + border glint), `Eyebrow`.
- Scroll: **Lenis** (`components/providers/smooth-scroll.tsx`, marketing pages only) driven by the GSAP ticker; **GSAP ScrollTrigger** for pinned/scrubbed scenes (`useGSAP` + `gsap.matchMedia`).
- WebGL: raw **three.js** (no R3F). Helpers in `lib/webgl.ts` (theme-aware colors, simplex noise, renderer). Every canvas pauses offscreen/hidden tab and renders a static frame under reduced motion.
- Everything respects `prefers-reduced-motion` (framer `MotionConfig reducedMotion="user"`, matchMedia branches, CSS kill-switch).
- Legacy primitives in `components/shared/motion.tsx` (FadeUp, Stagger, Typewriter, Meter) are still used by old screens; prefer kinetic.tsx for new work.

### Brand
- Logo: `components/shared/logo.tsx` — **R mark** (ink rounded tile, lowercase "r" whose shoulder reaches for an **ember dot** = the thing remembered) + lowercase **"rontee"** wordmark set in Geist (real text).
- Favicon set: `app/icon.svg` (adapts to dark tab bars), `app/favicon.ico` (16/32/48, generated from the mark with sharp), `app/apple-icon.tsx` (180px).
- Voice: calm, personal, friend-like. "Mum's birthday is in 7 days. Maybe order that scarf she liked?"

## SEO
- Site constants: `lib/site.ts` (`NEXT_PUBLIC_SITE_URL` overrides `https://rontee.vercel.app`).
- Root metadata + viewport/theme-color in `app/layout.tsx`; per-page `title`, `description`, `alternates.canonical`. **Never put canonical/openGraph.url in the root layout** (children inherit it). Page-level `openGraph` replaces the parent object wholesale — don't set partial OG on pages.
- `app/opengraph-image.tsx` (default share card), `app/robots.ts` (app routes + reset flow disallowed; `/reminders/new` explicitly allowed), `app/sitemap.ts` (public routes), `app/manifest.ts`.
- Landing JSON-LD: WebSite, Organization, WebApplication, FAQPage (FAQ copy in `components/landing/faq-data.ts`).
- forgot/reset-password are `noindex`.

## Stack
Next.js 16.3.6 (App Router, Turbopack) · React 19.2 · TS strict · Tailwind v4 (CSS-first `@theme`) ·
shadcn-pattern UI + Radix · next-themes (class, default **light**) · framer-motion · **gsap + @gsap/react** ·
**lenis** · **three** · lucide-react · date-fns.
Still deliberately absent: backend, DB, auth backend, notifications, billing, TanStack Query, RHF/Zod, Zustand.

Read `node_modules/next/dist/docs/` before using Next APIs (see AGENTS.md).

## Workflow
- **One screen at a time.** Build Desktop Light → Dark → Mobile, verify, then get the user's approval before the next screen.
- Verify: `npx tsc --noEmit` · `npm run lint` · `npm run build`; visually at 1440×900 and 390×844, light + dark, no horizontal overflow.
- No browser extension here: screenshots via `puppeteer-core` driving system Edge (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`, flags `--use-angle=swiftshader --enable-unsafe-swiftshader` for WebGL), installed in the session scratchpad, not the project. Scroll in small steps so ScrollTrigger scenes play.
- User usually has `next dev` running on :3000 — reuse it.

## Screen status

| # | Screen | Route | Status |
|---|---|---|---|
| 0 | Foundation (tokens, type, motion, logo, favicon, SEO) | — | ✅ Done 2026-10-25 |
| 1 | Landing | `/` | 🟡 Built 2026-10-25 — awaiting user review |
| 2 | Create reminder (3 steps) | `/reminders/new` | ⏳ Old design (neutralised by tokens) |
| 3 | Reminder ready (guest / saved) | `/reminders/new` states | ⏳ Old design |
| 4 | Auth: sign up, log in, forgot, reset | `/signup` `/login` `/forgot-password` `/reset-password` | ⏳ Old design |
| 5 | Dashboard | `/dashboard` | ⬜ Not built |
| 6 | Reminders list | `/reminders` | ⬜ |
| 7 | Reminder details | `/reminders/[id]` | ⬜ |
| 8 | Edit reminder | `/reminders/[id]/edit` | ⬜ |
| 9 | Calendar | `/calendar` | ⬜ |
| 10 | Settings (profile, notifications, appearance, security) | `/settings/*` | ⬜ |
| 11 | Plan & Billing | `/settings/billing` | ⬜ |

### Landing composition (`app/page.tsx`)
1. **Navbar** — transparent → floating capsule on scroll; hides on scroll-down; sliding hover pill; mobile full-screen clip-path sheet (pauses Lenis).
2. **Hero** — two-tone display headline (serif "matters."), `QuickCapture` (typing placeholder, suggestion chips → `/reminders/new?q=`), **MemoryOrb** (three.js dot sphere, ember "memories", pointer repel, scatters on scroll), parallax floating reminder cards (lg+).
3. **Marquee** — two counter-scrolling rows of real reminders; speed reacts to Lenis scroll velocity, slows on hover.
4. **Manifesto** — scroll-scrubbed word-by-word brightening paragraph.
5. **How it works** — pinned (lg+, +220%): scroll drives the live 3-step mock (typing, calendar pick, offset checks); steps clickable (Lenis scrollTo). Mobile: stacked cards animated in view.
6. **Unburden** (dark) — pinned (+170%): particle "noise" + floating thoughts → orderly May 2026 calendar; lit cells = May 5 + 11 (nudges) and May 12 (Mum's birthday), matching How it works.
7. **Use cases** — bento of live micro-UIs in SpotlightCards: year ring countdown, passport renewal timeline, trials list, fanning notification stack, recurring tracks.
8. **FAQ** — numbered accordion (+ FAQPage JSON-LD).
9. **Final CTA + Footer** (dark) — "Tell Rontee *once.*" + second QuickCapture; link columns; giant scroll-rising wordmark.

## Gotchas (keep)
- **ScrollTrigger disables pin spacing when the pinned element's parent is flex.** Keep `<main>` as block and set `pinSpacing: true` explicitly.
- SVG coordinates computed with trig must be rounded (server vs client `Math.cos` differ in last digits → hydration mismatch).
- ThemeMenu reads next-themes only after mount (`useSyncExternalStore` mounted flag) to avoid hydration mismatch. Keep this pattern for any theme-dependent attributes.
- `html`/`body` use `overflow-x: clip` (not hidden) so sticky/pins keep working.
- Flex `truncate` children need `min-w-0 flex-1`.
- If `tsc` fails only inside `.next/dev/types`, delete `.next` and re-run.
- Wizard (old): draft held in localStorage `rontee:reminder-draft` across the signup detour; `?recovered=1` restores to saved; `?q=` prefills step 1. Step transitions scroll to top + focus `#wizard-heading`.

## Open items / to confirm with user
- Landing copy claims to verify: "Free to start", Pro "on the way", FAQ answers (all consistent with the product plan, but marketing wording is new).
- Privacy / Terms pages don't exist (footer links are `#`).
- `npm audit` shows pre-existing advisories in `next` (16.0–16.4, critical: 'use cache' leak), `sharp`, `source-map-js`, `zod` — not addressed yet; upgrading Next needs a deliberate pass.
- Final production domain (update `NEXT_PUBLIC_SITE_URL`).

## Change log
- **2026-10-25** — Redesign kickoff. Claude takes over design; teal/Manrope/Stitch dropped. Theme strategy C. Foundation: new tokens (monochrome + ember), Geist/Instrument Serif/Geist Mono, motion system (Lenis, GSAP, three.js), new R mark + wordmark, favicon set, full SEO (metadata, OG image, robots, sitemap, manifest, JSON-LD). Landing page rebuilt (9 sections above). Old landing sections (memory-stage, mental-relief, what-to-remember) removed. ThemeMenu moved to `components/shared/theme-menu.tsx`. This file supersedes the (gitignored) HANDOFF.md, which describes the old teal/Stitch system — don't follow it.
