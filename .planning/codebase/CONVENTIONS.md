# Coding Conventions

**Analysis Date:** 2026-07-13

## Naming Patterns

**Files:**
- React components: PascalCase `.tsx` — `Hero.tsx`, `CountUp.tsx`, `ThemeToggle.tsx`
- App route files: lowercase Next.js convention — `page.tsx`, `layout.tsx`, `not-found.tsx`
- Content/data: camelCase `.ts` — `site.ts`
- Config files: camelCase with extension — `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`

**Functions / Components:**
- Named exports only — no default exports for components (e.g., `export function Hero()`, `export function CountUp()`)
- Default exports reserved for Next.js required exports: `RootLayout` in `src/app/layout.tsx`, route pages in `src/app/**/page.tsx`
- camelCase for hooks and handlers: `updateProgress`, `toggle`, `isActive`

**Variables:**
- camelCase throughout: `spanRef`, `triggered`, `portraitPath`
- Boolean flags with descriptive names: `mounted`, `pulling`, `open`
- Module-level constants in camelCase: `items` (nav links array), `geistSans`, `geistMono`

**Types / Interfaces:**
- `interface Props` for component prop objects (used in `CountUp.tsx`)
- `type XxxProps` for more complex prop shapes with JSDoc (used in `Reveal.tsx`, `Section.tsx`)
- Explicit generics on refs: `useRef<HTMLDivElement>(null)`, `useRef<HTMLSpanElement>(null)`
- Inline union types for constrained props: `"dark" | "light"`, `"fade" | "zoom"`

## Code Style

**Formatting:**
- No Prettier config detected — formatting enforced via ESLint (eslint-config-next)
- Single quotes in JSX attribute strings, double quotes in TS/JS strings (Next.js default)
- Trailing commas in multi-line arrays and objects
- Semicolons present

**Linting:**
- ESLint 9 flat config at `eslint.config.mjs`
- Extends `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Scripts and `.next/` output directories are globally ignored

## TypeScript Patterns

**Compiler Settings (`tsconfig.json`):**
- `strict: true` — full strict mode enforced
- `noEmit: true` — tsc used for type checking only; Next.js handles compilation
- `moduleResolution: "bundler"` — modern resolution for Next.js + Turbopack
- `target: ES2017` — broad browser compatibility baseline
- Path alias `@/*` maps to `src/*`

**Usage patterns:**
- Props typed inline with `interface Props` or `type XxxProps = { ... }` — never inlined in function signature for complex props
- `ReactNode` imported from `react` for children: `import type { ReactNode } from "react"`
- `type` imports used for type-only symbols: `import type { Metadata } from "next"`, `import type { ReactNode } from "react"`
- No `any` usage observed
- Optional props use `?:` and always have defaults in destructuring: `{ variant = "fade", delay = 0 }`

## Import Organization

**Order (observed pattern):**
1. React/Next.js core: `"react"`, `"next/image"`, `"next/link"`, `"next/navigation"`
2. Node built-ins (server components only): `"node:fs"`, `"node:path"`
3. Internal absolute imports via `@/` alias: `@/content/site`, `@/components/BackToTop`
4. Relative component imports: `"./QaBug"`, `"./Reveal"`

**Path Aliases:**
- `@/` → `src/` — use for cross-directory imports
- Relative imports (`"./ComponentName"`) for same-directory component references

## Server vs Client Components

**Directive placement:**
- `"use client"` on the first line before any imports when browser APIs or React hooks are used
- No directive = Server Component (RSC) by default
- Server components can use Node.js built-ins directly (see `Hero.tsx` using `fs` and `path`)

**Pattern for avoiding hydration issues:**
- `mounted` state guard: `const [mounted, setMounted] = useState(false)` + `if (!mounted) return null`
- Used in `ThemeToggle.tsx` to prevent theme flash on SSR
- `suppressHydrationWarning` on `<html>` in `src/app/layout.tsx`

## CSS Approach

**Strategy:** Tailwind CSS v4 utility-first with CSS custom properties for design tokens

**Design tokens** defined in `src/app/globals.css` under `:root` and `[data-theme="light"]`:
- `--background`, `--surface`, `--border`, `--foreground`, `--muted`, `--faint`
- Registered as Tailwind color tokens via `@theme inline` block: `bg-background`, `text-foreground`, `text-muted`, `text-faint`, `border-line`
- Fonts: `--font-geist-sans` / `--font-geist-mono` → `font-sans` / `font-mono` Tailwind tokens

**Tailwind usage patterns:**
- Responsive prefixes: `md:` for desktop breakpoints — `md:grid-cols-4`, `md:hidden`
- Arbitrary values for precise typography: `text-[13px]`, `text-[clamp(2.5rem,6vw,3.5rem)]`, `tracking-[0.2em]`
- State variants: `hover:text-foreground`, `focus-visible:outline`, `last:border-b-0`
- Opacity modifier syntax: `bg-background/80`, `border-line/50`, `text-foreground/30`

**Global CSS usage** (`src/app/globals.css`):
- Keyframe animations: `bug-ghost-out`, `splat-fade`, `bug-report-in`, `stat-pop-kf`, `zzz-rise`, `tag-glitch`, `cord-pull`
- Stateful CSS classes toggled by JS: `.reveal` / `.is-visible`, `.cord-pulling`, `.theme-transition`, `.bug-sleeping`, `.bug-seeking`
- `@media (prefers-reduced-motion)` guards on all motion-heavy rules
- `@media print` block for PDF export support

**Inline styles** — used sparingly for values not expressible as Tailwind utilities:
- CSS variable references that need to be dynamic: `style={{ borderColor: "var(--avail-border)" }}`
- Imperative animation state: `style={{ transform: \`scaleX(\${progress})\` }}`

## Component Design

**Composition pattern:**
- Thin layout wrappers delegate animation to `<Reveal>` wrapper component (`src/components/Reveal.tsx`)
- `<Section>` (`src/components/Section.tsx`) is the standard page-section shell: provides `id`, `aria-labelledby`, max-width container, and auto-wraps heading in `<Reveal>`
- Interactive micro-components are isolated: `CountUp`, `DefectCounter`, `ThemeDot`, `PortraitDrag`

**Prop design:**
- Variant props use string unions, not enums: `variant?: "fade" | "zoom"`
- Numeric config props have sensible defaults: `duration = 1100`, `from = 0`
- JSDoc on non-obvious props (see `Reveal.tsx`)

**Accessibility:**
- `aria-label` on icon-only buttons
- `aria-hidden="true"` on decorative SVGs
- `aria-current="page"` on active nav links
- `aria-labelledby` linking sections to headings
- `sr-only` for visually hidden but screen-reader-accessible text

## Content Separation

- All copy, identity data, and statistics live in `src/content/site.ts`
- Components import from `@/content/site` — no hardcoded strings in component files

---

*Convention analysis: 2026-07-13*
