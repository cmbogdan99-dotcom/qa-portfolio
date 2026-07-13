<!-- refreshed: 2026-07-13 -->
# Architecture

**Analysis Date:** 2026-07-13

## System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                  Next.js App Router (RSC-first)                 │
├────────────────────────┬────────────────────────────────────────┤
│   / (Home page)        │   /projects (Gallery page)             │
│  `src/app/page.tsx`    │  `src/app/projects/page.tsx`           │
└────────────┬───────────┴────────────────┬───────────────────────┘
             │  imports                   │  imports
             ▼                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Section Components (Server RSC)                 │
│  Hero · Projects · Experience · Expertise · DeepDive · Contact  │
│  `src/components/*.tsx`  (no "use client" directive)            │
└────────────┬────────────────────────────────────────────────────┘
             │  wraps with
             ▼
┌─────────────────────────────────────────────────────────────────┐
│             Interactive / Client Components                     │
│  Reveal · Nav · ThemeToggle · GalleryCard · QaBug · CountUp    │
│  DefectCounter · BackToTop · ConsoleEgg · Secrets · PortraitDrag│
│  `src/components/*.tsx`  ("use client" at top of file)         │
└────────────┬────────────────────────────────────────────────────┘
             │  reads
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer (static TS)                       │
│  `src/content/site.ts` — single exported object/array per type  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| RootLayout | HTML shell, fonts, metadata, global overlays | `src/app/layout.tsx` |
| Home | Page composition, section order | `src/app/page.tsx` |
| ProjectsPage | Full gallery grouped by studio, build-time image check | `src/app/projects/page.tsx` |
| NotFound | Themed 404 in bug-report format | `src/app/not-found.tsx` |
| Nav | Fixed header, scroll-progress bar, mobile menu | `src/components/Nav.tsx` |
| Hero | Name, tagline, portrait, animated stats grid | `src/components/Hero.tsx` |
| Section | Reusable section shell (label + h2 + children) | `src/components/Section.tsx` |
| Reveal | IntersectionObserver scroll-reveal wrapper | `src/components/Reveal.tsx` |
| Projects | Case studies list from `caseStudies[]` | `src/components/Projects.tsx` |
| Experience | Employment history from `experience[]` | `src/components/Experience.tsx` |
| Expertise | Skill categories from `expertise[]` | `src/components/Expertise.tsx` |
| DeepDive | Long-form perspective pieces from `deepDives[]` | `src/components/DeepDive.tsx` |
| Contact | Links to email / LinkedIn / GitHub / CV download | `src/components/Contact.tsx` |
| GalleryCard | Project tile with image, DLC tooltip, external link | `src/components/GalleryCard.tsx` |
| ThemeToggle | Lightbulb + pull-cord UI, persists to localStorage | `src/components/ThemeToggle.tsx` |
| BackToTop | Scroll-to-top button (client) | `src/components/BackToTop.tsx` |
| CountUp | Animated number counter on scroll into view | `src/components/CountUp.tsx` |
| DefectCounter | Defect count stat with animated display | `src/components/DefectCounter.tsx` |
| QaBug | Animated crawling "bug" easter egg, duplicates on 404 | `src/components/QaBug.tsx` |
| PortraitDrag | Draggable portrait image | `src/components/PortraitDrag.tsx` |
| ConsoleEgg | Hidden console easter egg | `src/components/ConsoleEgg.tsx` |
| Secrets | Hidden keyboard-shortcut easter eggs | `src/components/Secrets.tsx` |
| ThemeDot | Animated theme-aware dot separator in Hero | `src/components/ThemeDot.tsx` |
| PrintExpand | Print-mode layout helper | `src/components/PrintExpand.tsx` |

## Pattern Overview

**Overall:** Next.js App Router, RSC-first with selective client components

**Key Characteristics:**
- All pages and most section components are React Server Components (no `"use client"`)
- Client components are isolated to interactive concerns: animation, scroll state, theme, drag, browser APIs
- All content lives in a single TypeScript module (`src/content/site.ts`) — no CMS, no API calls, no database
- Theme (`dark`/`light`) stored in `localStorage`, applied before first paint via inline `<script>` in `<head>` to avoid FOUC
- Tailwind v4 with CSS custom property design tokens; token bridge via `@theme inline` in `globals.css`

## Layers

**Pages:**
- Purpose: Route entry points, metadata exports, page-level composition
- Location: `src/app/`
- Contains: `layout.tsx`, `page.tsx`, `projects/page.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`
- Depends on: components, content
- Used by: Next.js router

**Section Components (Server):**
- Purpose: Render static content sections; no browser API usage
- Location: `src/components/`
- Contains: `Hero.tsx`, `Projects.tsx`, `Experience.tsx`, `Expertise.tsx`, `DeepDive.tsx`, `Contact.tsx`, `Section.tsx`
- Depends on: `src/content/site.ts`, client sub-components wrapped inside
- Used by: `src/app/page.tsx`

**Client Components:**
- Purpose: Interactivity, animations, browser APIs, scroll/resize events
- Location: `src/components/`
- Contains: `Nav.tsx`, `Reveal.tsx`, `ThemeToggle.tsx`, `GalleryCard.tsx`, `CountUp.tsx`, `DefectCounter.tsx`, `BackToTop.tsx`, `QaBug.tsx`, `PortraitDrag.tsx`, `ConsoleEgg.tsx`, `Secrets.tsx`, `ThemeDot.tsx`, `PrintExpand.tsx`
- Depends on: React hooks, browser globals (`localStorage`, `IntersectionObserver`, `window`)
- Used by: server components and layout

**Data Layer:**
- Purpose: Single source of truth for all site copy and structured data
- Location: `src/content/site.ts`
- Contains: Named exports — `identity`, `stats`, `links`, `about`, `caseStudies`, `experience`, `expertise`, `deepDives`, `gallery`, `philosophyLine`, `availability`
- Depends on: nothing (plain TypeScript, no imports)
- Used by: pages and components directly via `import { … } from "@/content/site"`

## Data Flow

### Primary Request Path

1. Browser hits `/` → Next.js matches `src/app/page.tsx` (RSC)
2. `page.tsx` imports sections; each section imports from `src/content/site.ts` at build time
3. RSC renders HTML; client components hydrate in browser
4. `Reveal` components attach `IntersectionObserver` on mount → scroll-driven class toggling

### Gallery Page Path

1. Browser hits `/projects` → `src/app/projects/page.tsx` (RSC)
2. `imageFor(slug)` calls `fs.readdirSync` at request time to check `public/projects/`
3. `GalleryCard` receives `img: string | null` prop — renders `<Image>` or typographic fallback
4. `GalleryCard` is a client component; hover/touch state manages DLC tooltip visibility

### Theme Initialization

1. Inline `<script>` in `<head>` reads `localStorage('theme')` and sets `data-theme` on `<html>` before hydration
2. `ThemeToggle` (client) reads `localStorage` on mount, then writes back on toggle
3. CSS custom properties under `[data-theme="light"]` provide the light palette; default `:root` is dark

**State Management:**
- No global state library. Theme is `localStorage` + `data-theme` HTML attribute. All other UI state is local component `useState`.

## Key Abstractions

**`Section` wrapper:**
- Purpose: Consistent section chrome (label + h2 + max-width container + padding)
- Examples: wraps `About`, `Projects`, `Experience`, `Expertise`, `DeepDive`, `Contact`
- Pattern: accepts `id`, `label`, `title`, `children` — always renders a `<section>` with `aria-labelledby`

**`Reveal` wrapper:**
- Purpose: Scroll-reveal animation via `IntersectionObserver`; no-JS / reduced-motion safe
- Examples: used inside every section and in `GalleryCard` grids
- Pattern: client component wrapping any children in a `<div class="reveal">`, toggling `is-visible`

**`site.ts` content contract:**
- Purpose: Typed data shape that components depend on; changing types here is the only place to update content
- Pattern: named TypeScript exports with inline types (`CaseStudy`, `Experience`, `GalleryItem`, etc.)

## Entry Points

**Root layout:**
- Location: `src/app/layout.tsx`
- Triggers: every page render
- Responsibilities: HTML/head, font variables, FOUC-prevention script, global overlays (ThemeToggle, BackToTop, ConsoleEgg, Secrets)

**Home page:**
- Location: `src/app/page.tsx`
- Triggers: route `/`
- Responsibilities: skip link, Nav, single-page section composition

**Projects page:**
- Location: `src/app/projects/page.tsx`
- Triggers: route `/projects`
- Responsibilities: full gallery by studio, build-time filesystem image resolution

## Rendering Strategy

| Route | Strategy | Notes |
|-------|----------|-------|
| `/` | Static (SSG) | All data from `site.ts` — no dynamic data |
| `/projects` | Static (SSG) | `fs.readdirSync` runs at build; dev server re-reads on each request |
| `/not-found` | Static | Served by Next.js 404 mechanism |
| `sitemap.ts` | Generated | `MetadataRoute.Sitemap`, hardcoded URLs |
| `robots.ts` | Generated | Standard robots file |

## Architectural Constraints

- **No API routes:** Zero `src/app/api/` routes — this is a purely static site
- **No database:** Content is compiled TypeScript; no runtime data fetching
- **Global state:** Theme only, via `localStorage` + DOM attribute. No React context, no Zustand, no Redux
- **Client boundary:** Components using `window`, `localStorage`, `IntersectionObserver`, or event listeners must carry `"use client"` — server components cannot
- **Image handling:** `public/projects/` images resolved at build by slug matching in `src/app/projects/page.tsx`; `next/image` used throughout with `fill` for responsive gallery tiles
- **User-select disabled globally:** `body { user-select: none }` in `globals.css` — deliberate content protection

## Anti-Patterns

### Mixing server filesystem access with client rendering

**What happens:** `Hero.tsx` calls `fs.existsSync` at module level to decide whether to render the portrait — this works only because `Hero` is a server component. If `Hero` were ever marked `"use client"`, this would crash at runtime.
**Why it's wrong:** `fs` is unavailable in the browser bundle.
**Do this instead:** Keep any `fs.*` call in a server component or in `generateStaticParams`/`generateMetadata`. Never add `"use client"` to `Hero.tsx` or `src/app/projects/page.tsx`.

### Hardcoded production URL in two places

**What happens:** `siteUrl` in `src/app/layout.tsx` and `sitemap.ts` both hardcode the production domain as a string literal.
**Why it's wrong:** Dev/staging previews get incorrect canonical URLs and OG metadata.
**Do this instead:** Read from `process.env.NEXT_PUBLIC_SITE_URL` with a fallback.

## Error Handling

**Strategy:** Minimal — static site with no async operations.

**Patterns:**
- `fs.existsSync` guard before `fs.readdirSync` in `src/app/projects/page.tsx`
- `not-found.tsx` handles all unmatched routes via Next.js convention
- No try/catch patterns needed; no network calls at runtime

## Cross-Cutting Concerns

**Accessibility:** Skip link on home page; `aria-labelledby` on all sections; `aria-hidden` on decorative SVGs; `aria-current="page"` on active nav link; `prefers-reduced-motion` respected in CSS and `scroll-behavior`
**Theme:** `data-theme` attribute on `<html>`, CSS custom properties, FOUC prevented via inline script
**Animation:** `Reveal` (scroll-reveal) + CSS classes in `globals.css`; `cord-pulling` animation on ThemeToggle

---

*Architecture analysis: 2026-07-13*
