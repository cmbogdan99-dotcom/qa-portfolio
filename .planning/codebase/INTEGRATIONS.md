# External Integrations

**Analysis Date:** 2026-07-13

## APIs & External Services

**Font Loading:**
- Google Fonts (via `next/font/google`) — Geist Sans and Geist Mono
  - SDK/Client: `next/font/google` (built-in Next.js module, self-hosted at build time)
  - Subsets: `latin`
  - CSS variables: `--font-geist-sans`, `--font-geist-mono`
  - Source: `src/app/layout.tsx` lines 10–17

**No other external API integrations detected.**

## Data Storage

**Databases:**
- None — static site; content sourced from `src/content/site.ts`

**File Storage:**
- Local filesystem via `public/` directory (images, OG image)

**Caching:**
- Next.js built-in static generation cache

## Authentication & Identity

**Auth Provider:**
- None — public portfolio site, no authentication layer

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Browser console only; `ConsoleEgg` component (`src/components/ConsoleEgg`) writes an easter egg message to `console`

## CI/CD & Deployment

**Hosting:**
- Vercel — production URL `https://qa-portfolio-six-psi.vercel.app` (hardcoded in `src/app/layout.tsx`)

**CI Pipeline:**
- Not detected in repository (no `.github/`, `.gitlab-ci.yml`, or `vercel.json` found)
- Vercel likely auto-deploys on push via Git integration

## Environment Configuration

**Required env vars:**
- None detected — no `.env` files present, no `process.env` references found in scanned files

**Secrets location:**
- Not applicable

## Image Optimization

**Provider:**
- Next.js built-in image optimization (`next/image`)
- `sharp` ^0.35.3 used as the underlying optimizer
- Custom quality presets `[25, 75, 90]` configured in `next.config.ts`
- OG image: `public/og.png` (1200×630) referenced in metadata

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Theme Persistence

**Storage:**
- `localStorage` key `theme` — values `'light'` or `'dark'`
- Inline script injected in `<head>` to read and apply theme before first paint (avoids flash)
- Source: `src/app/layout.tsx` lines 53–57

---

*Integration audit: 2026-07-13*
