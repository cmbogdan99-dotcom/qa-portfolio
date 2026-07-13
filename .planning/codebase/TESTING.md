# Testing Patterns

**Analysis Date:** 2026-07-13

## Test Framework

**Runner:** None — no test runner is installed or configured.

**Assertion Library:** None.

**Test Files:** None detected across `src/`, `test/`, or project root.

**Run Commands:**
```bash
# No test command exists in package.json scripts
npm run dev       # Start dev server
npm run build     # Production build (type-check + compile)
npm run start     # Serve production build
npm run lint      # ESLint (eslint-config-next/core-web-vitals + typescript)
```

## Quality Gates (in lieu of tests)

**TypeScript (`tsconfig.json`):**
- `strict: true` enforces the full strict suite: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc.
- `noEmit: true` — `tsc --noEmit` can be run as a type-check gate without emitting output
- `next build` runs `tsc` internally; a type error will fail the build

**Linting (`eslint.config.mjs`):**
- ESLint 9 flat config with `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- `core-web-vitals` adds rules for: React hooks, accessibility (`jsx-a11y`), Next.js best practices, performance
- `npm run lint` invokes `eslint` directly (no path scoping — lints all configured files)
- No `--max-warnings` flag set; lint exits non-zero only on errors, not warnings

**Build verification:**
- `next build` serves as the integration smoke test: resolves all imports, validates TypeScript, tree-shakes, generates static pages
- No CI configuration detected (no `.github/workflows/`, no `vercel.json` with lint/test steps)

## What Is Verified Today

| Check | Tool | How to run |
|-------|------|------------|
| Type correctness | TypeScript strict | `npx tsc --noEmit` or `npm run build` |
| React/Next.js rules | ESLint core-web-vitals | `npm run lint` |
| TypeScript lint rules | eslint-config-next/typescript | `npm run lint` |
| Import resolution | `next build` | `npm run build` |
| Static page generation | `next build` | `npm run build` |
| Accessibility lint | `jsx-a11y` (via core-web-vitals) | `npm run lint` |

## What Is Not Verified

- **Unit logic** — animation math in `CountUp.tsx` (easing curve, rAF loop), `Reveal.tsx` IntersectionObserver logic, theme persistence in `ThemeToggle.tsx`
- **Component rendering** — no snapshot or render tests
- **Interactivity** — no E2E coverage for theme toggle, mobile nav open/close, scroll progress bar, QaBug interactions
- **Content integrity** — `src/content/site.ts` values are not validated against schema or required fields
- **Accessibility runtime** — `jsx-a11y` is static; no automated axe or Playwright accessibility checks

## Adding Tests (Recommended Approach)

This codebase is a good candidate for a lightweight test setup with no framework migration required.

**Recommended stack:**
- **Vitest** — zero-config with Vite-compatible module resolution, fast for unit tests
- **@testing-library/react** — RSC-compatible component render tests
- **Playwright** — E2E for nav, theme toggle, scroll behaviors, QaBug

**Suggested `package.json` additions:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

**Highest-value test targets (priority order):**
1. `src/components/CountUp.tsx` — pure animation math, testable without DOM
2. `src/content/site.ts` — schema validation (all required fields present and typed)
3. `src/components/Nav.tsx` — mobile menu toggle, active link detection (`isActive`)
4. `src/components/ThemeToggle.tsx` — localStorage read/write, `data-theme` attribute mutation
5. `src/components/Reveal.tsx` — IntersectionObserver callback, `is-visible` class toggling

**Vitest config location if added:** `vitest.config.ts` at project root

**Test file location convention to adopt:** Co-locate with source
```
src/
  components/
    CountUp.tsx
    CountUp.test.tsx   ← co-locate here
```

## Coverage

**Current coverage:** 0% — no tests exist.

**Recommended minimum targets:**
- Utility/logic functions: 90%
- Interactive client components: 70%
- Server components / layout: build verification sufficient

---

*Testing analysis: 2026-07-13*
