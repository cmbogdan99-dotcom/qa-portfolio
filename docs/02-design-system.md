# Phase 2 — Visual System

## Design principles

1. **Type does the design.** No illustrations, no icons except where functional. Hierarchy comes from size, weight, and spacing.
2. **One accent, used rarely.** A single warm off-white for emphasis on near-black; no brand color competing with content.
3. **Depth via borders, not shadows.** Hairline borders (`zinc-800`) define surfaces; this ages better than glassmorphism/shadows and keeps dark mode clean.
4. **Motion only for comprehension.** Scroll-reveal fades (respecting `prefers-reduced-motion`), accordion transitions. Nothing loops, nothing floats.

## Color system (dark, single theme)

| Token | Value | Use |
|---|---|---|
| `--background` | `#0a0a0b` | page |
| `--surface` | `#111113` | cards, accordions |
| `--border` | `#26262a` | hairlines |
| `--foreground` | `#ededf0` | headings, key copy |
| `--muted` | `#a1a1a8` | body text |
| `--faint` | `#6b6b73` | metadata, labels |

Contrast: foreground on background ≈ 15.9:1, muted ≈ 7.5:1, faint ≈ 4.6:1 (faint used ≥ 14px only) — all WCAG AA.

**Why one theme, not a toggle:** the brief mandates dark-by-default premium; a light theme doubles design/QA surface for near-zero audience value on a portfolio. Trade-off documented; toggle can be added later since colors are CSS variables.

## Typography

- **Single family: Geist Sans** (variable, self-hosted via `next/font`) — one font file, no serif pairing, no FOUT, strong for a "minimal + technical" read. Geist Mono for small labels/metrics.
- Scale: 13 (labels, mono, uppercase, tracked) · 15 body-small · 16.5 body · 20 card titles · 28 section titles · 44–56 hero (clamped).
- Measure capped at ~65ch for all prose.

## Spacing & layout

- Content max-width `72rem`, prose `42rem`.
- Section rhythm: `py-24 md:py-32`. Generosity of whitespace *is* the premium signal.
- 4px base grid via Tailwind defaults.

## Component inventory

| Component | Role |
|---|---|
| `Section` | consistent section shell: anchor id, label, title, spacing |
| `Nav` | sticky, backdrop-blur, anchor links, mobile menu |
| `Hero` | name, role, positioning, platform strip, portrait slot |
| `TimelineItem` | company, role, period, ownership bullets |
| `ProjectCard` / `FeaturedProject` | grid card / full-width case study |
| `ExpertiseCard` | category title + 2–3 prose lines + quiet tag row |
| `Accordion` | native `<details>/<summary>` styled — free accessibility, zero JS |
| `ContactLink` | icon + label external link |

**What recruiters perceive:** expensive restraint — reads like Linear/Vercel-era engineering sites without cloning them.
**What engineers perceive:** CSS variables, native elements, one font, no UI library — someone who values simplicity.
**What to learn here:** a design system is mostly *decisions removed* — one font, one theme, one accent. Every removed option is future consistency for free.
