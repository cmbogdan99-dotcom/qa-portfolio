# Codebase Structure

**Analysis Date:** 2026-07-13

## Directory Layout

```
qa-portfolio/
├── src/
│   ├── app/                    # Next.js App Router — routes, layouts, metadata
│   │   ├── layout.tsx          # Root layout (HTML shell, fonts, global overlays)
│   │   ├── page.tsx            # Home page (/)
│   │   ├── not-found.tsx       # 404 page — themed bug-report format
│   │   ├── globals.css         # Tailwind v4 + CSS custom property design tokens
│   │   ├── icon.png            # Favicon
│   │   ├── robots.ts           # Generated robots.txt
│   │   ├── sitemap.ts          # Generated sitemap.xml
│   │   └── projects/
│   │       └── page.tsx        # Full project gallery page (/projects)
│   ├── components/             # All React components (server + client)
│   │   ├── Section.tsx         # Reusable section chrome wrapper (server)
│   │   ├── Reveal.tsx          # Scroll-reveal animation wrapper (client)
│   │   ├── Nav.tsx             # Fixed navigation bar (client)
│   │   ├── Hero.tsx            # Name/tagline/stats header section (server)
│   │   ├── Projects.tsx        # Case studies section (server)
│   │   ├── Experience.tsx      # Employment history section (server)
│   │   ├── Expertise.tsx       # Skill categories section (server)
│   │   ├── DeepDive.tsx        # Long-form perspectives section (server)
│   │   ├── Contact.tsx         # Contact links section (client)
│   │   ├── GalleryCard.tsx     # Project tile with image/DLC tooltip (client)
│   │   ├── ThemeToggle.tsx     # Lightbulb theme switcher (client)
│   │   ├── BackToTop.tsx       # Scroll-to-top button (client)
│   │   ├── CountUp.tsx         # Animated counter (client)
│   │   ├── DefectCounter.tsx   # Defect stat counter (client)
│   │   ├── QaBug.tsx           # Crawling bug easter egg (client)
│   │   ├── PortraitDrag.tsx    # Draggable portrait (client)
│   │   ├── ConsoleEgg.tsx      # Console easter egg (client)
│   │   ├── Secrets.tsx         # Keyboard shortcut easter eggs (client)
│   │   ├── ThemeDot.tsx        # Animated separator dot (client)
│   │   └── PrintExpand.tsx     # Print layout helper (client)
│   └── content/
│       └── site.ts             # Single source of truth — all copy and typed data
├── public/
│   ├── portrait.jpg            # Hero portrait photo
│   ├── og.png                  # Open Graph image (1200×630)
│   ├── cv/
│   │   └── bogdan-carcadea-cv.pdf  # Downloadable CV
│   └── projects/               # Gallery images — one file per project slug
│       ├── ac-shadows.avif
│       ├── ac-valhalla.jpg
│       └── …                   # Named exactly after `slug` in site.ts gallery[]
├── .planning/
│   └── codebase/               # GSD codebase analysis documents
├── package.json
├── tsconfig.json
└── next.config.*               # Next.js configuration
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router routes and configuration
- Contains: Pages (`page.tsx`), layout (`layout.tsx`), special files (`not-found.tsx`, `sitemap.ts`, `robots.ts`), global styles (`globals.css`)
- Key files: `layout.tsx` (root shell), `page.tsx` (home), `projects/page.tsx` (gallery)

**`src/components/`:**
- Purpose: All React components — both Server Components and Client Components live here flat (no subdirectories)
- Contains: Section-level components, UI primitives, interactive overlays, easter eggs
- Key files: `Section.tsx` (layout primitive), `Reveal.tsx` (animation primitive), `Nav.tsx` (navigation)

**`src/content/`:**
- Purpose: Data layer — all site copy, typed structures, and configuration
- Contains: One file: `site.ts`
- Key files: `site.ts` — edit this file to update any text, links, stats, or project data

**`public/`:**
- Purpose: Static assets served at root URL
- Contains: Portrait, OG image, CV PDF, project gallery images
- Key convention: Gallery images must be named exactly `{slug}.{ext}` matching `slug` fields in `site.ts gallery[]`

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents consumed by plan/execute commands
- Generated: Yes (by GSD mapping commands)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML shell, applied to all routes
- `src/app/page.tsx`: Home page composition
- `src/app/projects/page.tsx`: Gallery page

**Configuration:**
- `src/app/globals.css`: Design tokens, Tailwind v4 import, reveal animation classes
- `tsconfig.json`: TypeScript config; defines `@/` path alias → `./src/`

**Core Logic:**
- `src/content/site.ts`: All content data — the only file to edit for copy changes
- `src/components/Section.tsx`: Layout primitive used by every content section
- `src/components/Reveal.tsx`: Animation primitive used throughout

**Static Assets:**
- `public/portrait.jpg`: Hero portrait (grayscale treatment applied in CSS)
- `public/og.png`: Social sharing image
- `public/cv/bogdan-carcadea-cv.pdf`: Linked from Contact and `links.cv` in `site.ts`
- `public/projects/*.{jpg,jpeg,png,webp,avif,gif}`: Gallery images

## Naming Conventions

**Files:**
- Components: PascalCase matching the exported function name — `GalleryCard.tsx` exports `GalleryCard`
- Pages: `page.tsx` (Next.js convention)
- Content: `site.ts` (lowercase, singular)
- All component files: `.tsx` extension

**Directories:**
- Route segments: lowercase — `projects/`
- Component directory: `components/` (flat, no subdirectories)

**Exports:**
- Components: named exports only — `export function Hero()`, not default
- Pages: default exports (Next.js convention) — `export default function Home()`
- Content: named exports per data type — `export const identity`, `export const gallery`, etc.

**CSS classes (Tailwind tokens):**
- `bg-background`, `bg-surface` — background levels
- `text-foreground`, `text-muted`, `text-faint` — text hierarchy
- `border-line` — border color
- These map to CSS custom properties in `globals.css`

## Where to Add New Code

**New content section on Home page:**
1. Add data to `src/content/site.ts` (define a type and export)
2. Create `src/components/NewSection.tsx` — server component; use `Section` wrapper
3. Import and place in `src/app/page.tsx`
4. Add nav anchor to items array in `src/components/Nav.tsx`

**New gallery project:**
1. Add entry to `gallery[]` in `src/content/site.ts` with a unique `slug`
2. Drop image as `public/projects/{slug}.{ext}` — any of jpg, jpeg, png, webp, avif, gif

**New client-only interactive component:**
1. Create `src/components/MyComponent.tsx` with `"use client"` as first line
2. Place in whichever server component or page needs it

**New page/route:**
1. Create `src/app/{route}/page.tsx` with a default export
2. Add `export const metadata` for SEO
3. Add to `src/app/sitemap.ts`

**Shared layout changes:**
- Edit `src/app/layout.tsx` — affects all routes
- Global styles: edit `src/app/globals.css`

## Special Directories

**`public/projects/`:**
- Purpose: Gallery tile images resolved at build time by `src/app/projects/page.tsx`
- Generated: No (manually added)
- Committed: Yes
- Convention: filename base must exactly match `slug` field (case-insensitive match, any supported image extension)

**`.planning/`:**
- Purpose: GSD planning system — phases, codebase maps, decisions
- Generated: Partially (codebase docs generated; phases human-authored)
- Committed: Yes

---

*Structure analysis: 2026-07-13*
