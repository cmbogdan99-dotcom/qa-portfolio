# Phase 3 — Architecture Decisions (and what to learn from each)

## Folder structure

```
src/
├─ app/                  App Router: routing, metadata, global CSS
│  ├─ layout.tsx         fonts, <html> shell, SEO metadata
│  ├─ page.tsx           the single route — composes sections
│  ├─ globals.css        design tokens + the few global styles
│  ├─ sitemap.ts         generated /sitemap.xml
│  └─ robots.ts          generated /robots.txt
├─ components/           one file per section + 3 primitives
└─ content/site.ts       ALL copy, typed
public/
├─ portrait.jpg          (you add — hero shows it automatically)
└─ cv/…pdf               (you add — download button target)
```

## Decisions and why

**1. Content lives in `src/content/site.ts`, not in components.**
Components describe *how* things look; the content file describes *what they say*. When you rewrite a bullet, you touch one file with zero JSX in it, and TypeScript types (`Experience`, `Project`…) stop you from breaking the layout with a malformed entry. This is the same separation a test framework makes between test data and test logic — you already think this way.

**2. Server components by default; `"use client"` only three times.**
`Nav` (menu state), `Reveal` (IntersectionObserver), `PrintExpand` (print events). Everything else renders to static HTML at build time — that's why the build output says `○ (Static)`. Less JavaScript shipped = faster loads = Lighthouse ≥95. *Lesson: in the App Router, "client component" is an opt-in exception, not the default unit of building.*

**3. No state management library, no UI library, zero runtime dependencies beyond React/Next.**
The page has exactly two pieces of state (mobile menu, accordion open/closed) and the accordion uses the native `<details>` element — keyboard support, screen-reader semantics, and no-JS fallback for free. *Lesson: reach for the platform before reaching for a package.*

**4. Single route, anchor navigation.**
See docs/01. Practically, this also means the whole site is one prerendered HTML document — nothing to code-split, no loading states, no layout shift between "pages."

**5. Accessibility choices baked in, not bolted on.**
Skip link before the nav; one `<h1>`, sections labelled via `aria-labelledby`; `prefers-reduced-motion` disables reveal animations *in CSS*, so even if JS never runs, nothing is hidden; contrast ratios chosen at token level (docs/02); decorative marks carry `aria-hidden`.

**6. Performance choices.**
Self-hosted variable fonts via `next/font` (no external requests, no FOUT); `next/image` with `priority` for the portrait (the only image); no third-party scripts; static prerender. There is genuinely nothing left for Lighthouse to complain about except your hosting headers.

**7. The hero checks whether `public/portrait.jpg` exists at build time.**
So the site is complete today and upgrades itself when you drop the photo in. `fs.existsSync` in a component is normally a smell — it works here only because this is a server component evaluated at build. *Lesson: know which code runs where (build server vs. browser); it's the central mental model of Next.js.*

## Trade-offs accepted

- No light theme (docs/02) — revisit only if analytics ever justify it.
- No CMS — content changes require a rebuild. Correct for a site edited a few times a year by a developer-adjacent owner.
- No animation library — CSS transitions cap the ceiling of what motion can do here. Intentional.
