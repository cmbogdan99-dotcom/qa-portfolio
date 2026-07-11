# Bogdan Carcadea — QA Engineer Portfolio

Personal portfolio: a single-page, statically prerendered Next.js site. Dark, minimal, content-first.

## Stack

Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · zero other runtime dependencies.

## Commands

```bash
npm run dev     # local dev at http://localhost:3000
npm run build   # production build (must pass before shipping)
npm run lint
```

## Where things live

- **All site copy:** `src/content/site.ts` — edit content here, nowhere else.
- **Design tokens:** `src/app/globals.css`
- **Section components:** `src/components/`

## Documentation

- `docs/01-strategy-and-ia.md` — positioning, information architecture, wireframes
- `docs/02-design-system.md` — colors, type, spacing, components
- `docs/03-architecture-decisions.md` — every technical decision, explained
- `docs/04-deployment-and-maintenance.md` — GitHub/Vercel workflow, PDF export, roadmap

## Before publishing

Grep for `[CONFIRM]` — every hit is a fact that must be verified against the real CV (dates, titles, URLs, domain) or an asset to add (`public/portrait.jpg`, `public/cv/*.pdf`).
