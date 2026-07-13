# Technology Stack

**Analysis Date:** 2026-07-13

## Languages

**Primary:**
- TypeScript 5.x - All source files (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- CSS - Global styles and design tokens (`src/app/globals.css`)

## Runtime

**Environment:**
- Node.js (LTS) — Next.js server-side rendering and build

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.2.10 - App Router, SSR, image optimization, font loading
- React 19.2.4 - UI component model
- React DOM 19.2.4 - DOM rendering

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS via `@import "tailwindcss"` in `src/app/globals.css`
- Configured via `@theme inline` block in globals.css (Tailwind v4 CSS-first config — no `tailwind.config.*` file)

**Build/Dev:**
- `@tailwindcss/postcss` ^4 - PostCSS integration for Tailwind v4
- TypeScript 5.x - Type checking and compilation
- ESLint 9 + `eslint-config-next` 16.2.10 - Linting
- `sharp` ^0.35.3 - Image optimization pipeline (used by Next.js image component)

## Key Dependencies

**Critical:**
- `next` 16.2.10 - Framework core: routing, SSR, API, image optimization, font subsetting
- `react` / `react-dom` 19.2.4 - UI layer

**Infrastructure:**
- `sharp` ^0.35.3 - Required for `next/image` optimization at build/runtime

## Configuration

**Build:**
- `next.config.ts` - Image quality presets: `[25, 75, 90]` (non-default; 25 for blurred backdrop, 90 for gallery photos)
- `tsconfig.json` - Target ES2017, strict mode, `@/*` path alias → `./src/*`, bundler module resolution
- `postcss.config.mjs` - Single plugin: `@tailwindcss/postcss`
- `eslint.config.mjs` - ESLint flat config

**TypeScript:**
- Strict mode enabled
- Path alias: `@/*` → `./src/*`
- `isolatedModules: true`
- `incremental: true`

**Tailwind v4 Design Tokens (in `src/app/globals.css`):**
- `--color-background`, `--color-surface`, `--color-line`, `--color-foreground`, `--color-muted`, `--color-faint`
- `--font-sans` → Geist Sans variable, `--font-mono` → Geist Mono variable
- Dark (default) and `[data-theme="light"]` variants both defined

## Platform Requirements

**Development:**
- Node.js with npm
- Run: `npm run dev` → `next dev`

**Production:**
- Run: `npm run build` → `next build`, then `npm start` → `next start`
- Deployed to Vercel (`https://qa-portfolio-six-psi.vercel.app` in `src/app/layout.tsx`)

---

*Stack analysis: 2026-07-13*
