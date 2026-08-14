# EMBARC — Project Context for Claude Code

Read this file first before exploring the codebase. It tells you what exists, why it exists, and what's next — so you don't waste tokens re-discovering decisions that are already made.

## What this project is

EMBARC is a portfolio piece: a digital agency landing page built to be dramatically more visually impressive than any existing competitor site (specifically epicstonemedia.com and blackmatrix.in — both real agencies). The end goal is a live site the founder (Karan) can point to in freelance pitches and job applications as proof of frontend/motion-design skill. This is not a real operating agency yet — it's a portfolio flagship project.

Non-negotiable creative direction: **new-age Gen-Z tech studio, not a legacy luxury agency.** Early iterations that felt "old money / established boomer agency" were explicitly rejected mid-build. Push toward bold, technical, cinematic — think Awwwards site of the year, not a law firm.

## Brand identity (locked in, do not re-litigate)

- **Name:** EMBARC (renamed from an earlier placeholder "Tyrian" — some code/comments may still say `tyrian-*`, that's intentional, just legacy class naming, not a bug)
- **Tagline:** "Where the new era begins."
- **Services line:** AI · SaaS · Web Engineering · Automation
- **Positioning line:** "Digital Agency" (eyebrow text above hero wordmark)
- **Location signals used in footer/corners:** Ahmedabad · Global, coordinates 23°01′N · 72°35′E, "Est. MMXXV"

### Color tokens (Tailwind v4 `@theme`, in `globals.css`)
```
--color-tyrian-night:     #1A0A2E
--color-tyrian-void:      #0D0618   (primary bg)
--color-tyrian-purple:    #6B21A8
--color-tyrian-gold:      #C9A84C   (accent/CTA color)
--color-tyrian-parchment: #F5F0E8   (primary text on dark)
```
Class names retain `tyrian-` prefix — this is deliberate, not a rename job.

### Typography
- **Cormorant Garamond** (serif, via `next/font/google`) — headlines, wordmark, italic taglines. CSS var: `--font-cormorant-garamond`, exposed as Tailwind `font-cormorant`.
- **Satoshi** (sans, via Fontshare `<link>` tag in `layout.tsx` `<head>`, NOT a CSS `@import` — that broke Tailwind parsing once, don't reintroduce it) — body, nav, labels, UI text. Tailwind `font-satoshi`.
- Convention: uppercase tracked-out labels (`tracking-[0.2em]` to `[0.5em]`) for all UI chrome/nav/eyebrow text. Cormorant for anything emotional/brand-voice.

## Tech stack

- **Next.js 14/16 App Router**, TypeScript, `src/` directory, `@/*` import alias
- **Tailwind CSS v4** — no `tailwind.config.ts` file exists or should exist. All theming lives in `@theme {}` block inside `src/app/globals.css`. If you're tempted to create a config file, stop — that's the v3 pattern and will conflict.
- **Lenis** — smooth scroll, wrapped via `src/components/providers/LenisProvider.tsx`, mounted once in root layout around `{children}`
- **GSAP** (+ SplitText plugin, registered via `gsap.registerPlugin(SplitText)`) — all entrance/scroll animations. Always wrapped in `gsap.context(() => {...}, scopeRef)` with `ctx.revert()` cleanup in `useEffect` — this project had real bugs from React 18 double-invoke before this pattern was adopted, don't skip it.
- **Three.js** — used directly (not react-three-fiber) inside a `useEffect` in `Hero.tsx` for a WebGL background scene (rotating star fields, animated nebula plane, atmosphere sphere, scroll+mouse-reactive camera). Custom GLSL shaders are inline template literals inside `ShaderMaterial` calls.
- `reactStrictMode: false` in `next.config.ts` — intentional, GSAP/Three fight StrictMode's double-mount in dev.
- Dev server must run **without Turbopack** (`npm run dev`, not `--turbopack`) — Turbopack was observed mangling inline GLSL template literals during a live debugging session. If Turbopack becomes default in a newer Next version, watch for this specifically.

## File structure so far

```
src/
├── app/
│   ├── globals.css       — Tailwind v4 @theme tokens, noise grain overlay, custom cursor CSS, keyframes for orbital rings/orb float (some of this is from an earlier design iteration — see "Known cruft" below)
│   ├── layout.tsx        — fonts, metadata, mounts LenisProvider + CustomCursor around children
│   └── page.tsx          — composes Navbar + Hero (+ Footer, if added — check current file)
├── components/
│   ├── providers/
│   │   └── LenisProvider.tsx
│   ├── layout/
│   │   ├── Navbar.tsx        — fixed centered glass pill nav, NOT a traditional left-logo/right-CTA layout (explicitly redesigned away from that)
│   │   └── CustomCursor.tsx  — gold dot + trailing ring replacing default cursor sitewide (`cursor: none !important` globally)
│   └── sections/
│       ├── Hero.tsx      — full-viewport hero: Three.js WebGL background + scramble-text EMBARC wordmark (custom scramble() function, not SplitText, for the main heading) + GSAP entrance timeline + magnetic CTA button + corner metadata + scroll indicator
│       └── Footer.tsx    — "Ruixen gradient footer" pattern: SVG blurred gradient bars pinned to viewport bottom, revealed via scroll-driven scaleY as user approaches page end. Adapted to brand palette (void→purple→gold→parchment).
```

## Known cruft / things to reconcile, not necessarily bugs

- `globals.css` may still contain orbital-ring and gradient-orb keyframes (`ring-spin-1/2/3`, `orb1/2/3`) and cursor styles from an intermediate design (CSS-only 3D rings + custom cursor) that was **partially superseded** when Three.js was added to Hero.tsx. Check whether both systems are still running simultaneously (CSS rings + WebGL scene) — that may be intentional layering or leftover redundancy worth asking about before removing.
- Some class names and comments still say "Tyrian" — this is the pre-rename brand name. Cosmetic only, doesn't affect function, but rename opportunistically if editing those files anyway.

## Debugging history worth knowing (so you don't reintroduce these)

1. Tailwind v4 has no config file — theming is CSS-only via `@theme`.
2. Fontshare font must load via `<link>` in `<head>`, not `@import` in CSS — the `@import` broke the whole stylesheet parse once.
3. GSAP `.from()` animations went permanently invisible (stuck at opacity:0) under React StrictMode double-invoke — fixed via `gsap.context()` + `ctx.revert()` pattern, plus disabling StrictMode.
4. React inline `style` prop doesn't accept GSAP-only properties like `scaleX` — TypeScript will correctly reject it. Set transform initial states via `gsap.set()` in JS, not in the JSX `style` attribute.
5. Three.js `ShaderMaterial` + `vertexColors: true` auto-injects its own `attribute vec3 color` — if your custom shader also manually declares `attribute vec3 color`, you get a GLSL redefinition compile error and the canvas silently fails to render (page looks like blank/default Next.js page with no visible error unless you check console). Fix pattern used: rename the custom attribute to something unreserved (`starColor`) and drop `vertexColors: true` since color is being piped through manually anyway.
6. `THREE.Clock` is deprecated in favor of `THREE.Timer` (`.update()` then `.getElapsed()` instead of `.getElapsedTime()`).

## Design philosophy / taste calibration

- Sharp corners on primary CTAs (not rounded) — deliberate, reads as "authoritative," not "friendly SaaS."
- Restraint over decoration: single hairline gold rules, not heavy dividers. Low-opacity parchment text for secondary info (often `/12` to `/30` opacity).
- Everything entrance-animates with GSAP timelines using staggered, sequenced delays (not everything fading in at once) — hero sequence currently runs roughly t=0.8s through t=2.7s before settling into idle/looping states (scroll dot bounce, etc).
- Corner metadata (coordinates, "Est. MMXXV", service tags) is a recurring editorial/luxury-fashion-site device used to fill dead space with brand texture rather than leaving it empty.

## What's NOT built yet (as of this context file)

- Services section
- Work/case studies section (was planned as a GSAP pinned horizontal scroll track, inspired by epicstonemedia.com's work section — not yet started)
- About section
- Contact section/form
- Mobile responsive pass (everything so far has been built and screenshotted at desktop viewport only)
- Any actual content/copy beyond the hero and footer nav links (footer link labels are currently placeholder/generic)

## How to work on this project going forward

- Don't re-propose Tailwind v3 config patterns, CSS `@import` for fonts, or `vertexColors: true` alongside a custom `color` attribute — these are known dead ends, see above.
- Preserve the `gsap.context()` + cleanup pattern for any new animated component.
- Match existing typography/color/spacing conventions rather than introducing new ones — check `Hero.tsx` and `Footer.tsx` as the reference implementations for "house style."
- Screenshots have been the primary feedback loop so far (founder is learning, not just directing) — when explaining changes, brief plain-language reasoning alongside code is valued, not just code dumps.
