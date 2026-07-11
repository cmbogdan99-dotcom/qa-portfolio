# Phase 1 — Portfolio Strategy, Information Architecture, Wireframes

## 1. Positioning strategy

**One-line positioning:** Senior QA Engineer who owns quality end-to-end across platforms, currently building automation depth.

**The 30-second impression we engineer for:**

A recruiter or engineering manager landing on the site should conclude, in order:

1. *Senior* — the hero states scope (5+ years, AAA-scale releases, five platforms) as facts, not adjectives.
2. *Owner, not executor* — the first project shown (Sugar Madness) is a sole-QA, end-to-end ownership story. Ubisoft strike-team rotation reads as "trusted to parachute into any project."
3. *Technical trajectory* — automation and AI-assisted workflows appear as an active, evidenced investment (~50% manual-effort reduction), never as an aspiration.

**What we deliberately avoid:**

- "Gaming tester" framing. Games appear as *evidence of complexity* (multi-platform, live-ops scale, 5–10 builds/day), never as identity. The word "gamer" never appears.
- Job-seeking signals. No availability, no "open to", no CTA pressure. The contact section is a professional directory, which itself signals confidence.
- Automation overstatement. The phrase used consistently: "building expertise in automation." Claims are backed by the one number we can defend (≈50% reduction of repetitive manual testing).

**Narrative budget** (enforced across all copy):
- ~40–45% quality ownership / process / strategy
- ~30–35% automation journey
- ~20–25% AI-assisted workflows

## 2. Audience analysis

| Audience | What they scan for | Where the site answers it |
|---|---|---|
| HR recruiter (30s scan) | Title, years, companies, platforms | Hero + experience timeline headers |
| Engineering manager | Ownership, scale, communication, risk thinking | Key projects + expertise categories |
| QA lead | Process maturity, defect volume, methodology | Technical deep-dive accordions |
| Founder | "Can this person be my whole QA function?" | Sugar Madness case study |

The site is layered: everything a recruiter needs is above the fold or in headers; everything an engineer needs is one click deeper (expandable details). This is why there is **one page**, not five.

## 3. Information architecture

Single-page, anchor-navigated, in this order:

```
/                    (single route)
├─ Hero              identity + positioning + platforms strip
├─ About             quality philosophy, 3 short paragraphs
├─ Experience        timeline: Avantaj Play → Ubisoft → EA
├─ Projects          Sugar Madness (lead) · AC Shadows · SW Outlaws · AC Valhalla · WD Legion
├─ Expertise         7 categories, prose-first, not tag clouds
├─ Deep dive         optional <details> accordions (process, release validation, automation, KPI)
└─ Contact           LinkedIn · email · GitHub · CV download
```

**Why single-page:** the content volume doesn't justify routes; recruiters won't click through; Lighthouse and maintenance both benefit; a sticky nav gives the "site" feel without navigation cost. Multi-page is a Phase-future option if a blog/case-study library ever appears (it shouldn't, per brief).

**Order rationale:** Experience *before* Projects because titles/companies are the recruiter's anchor; projects then substantiate. Deep dive sits after Expertise so the default scroll experience stays light — accordions are closed by default and invisible to skimmers.

## 4. Wireframe (desktop; mobile stacks 1-col)

```
┌──────────────────────────────────────────────┐
│ BC ▪ nav: About Experience Projects Contact  │  sticky, blurred bg
├──────────────────────────────────────────────┤
│                                              │
│  Bogdan Carcadea                             │
│  Senior QA Engineer                          │
│  2-line positioning statement                │
│  [portrait, right side, subtle treatment]    │
│  desktop · console · mobile · browser · VR   │  quiet platform strip
├──────────────────────────────────────────────┤
│  ABOUT — 3 short paragraphs, 60ch measure    │
├──────────────────────────────────────────────┤
│  EXPERIENCE — vertical line, 3 entries       │
│  ● Avantaj Play — QA Engineer (sole QA)      │
│  ● Ubisoft — QA Expert/Analyst (strike team) │
│  ● EA — QA (FIFA 20 demo contact)            │
│  each: 3–4 ownership bullets, no game logos  │
├──────────────────────────────────────────────┤
│  PROJECTS — 1 featured card + 2×2 grid       │
│  [Sugar Madness — full-width case study]     │
│  [AC Shadows][SW Outlaws][Valhalla][Legion]  │
├──────────────────────────────────────────────┤
│  EXPERTISE — 7 category cards, 2-col         │
├──────────────────────────────────────────────┤
│  DEEP DIVE — 4 closed accordions             │
├──────────────────────────────────────────────┤
│  CONTACT — one line + 4 links + CV button    │
└──────────────────────────────────────────────┘
```

## 5. What each audience will perceive

- **Recruiters:** clean seniority signal, scannable in under a minute, CV one click away.
- **Engineers:** restraint (no fake dashboards), defensible numbers, real process detail behind accordions — reads as "written by the person, not by marketing."
- **What you should learn from this phase:** IA is a hierarchy of *questions visitors arrive with*, not a list of things you want to say. Every ordering decision above traces to who reads first and what they need soonest.

## ⚠ Content requiring your CV / confirmation

Marked `[CONFIRM]` in the codebase. Needed before publishing:
- Exact employment dates and official titles at EA, Ubisoft, Avantaj Play
- Location line (e.g., "Bucharest, Romania")
- LinkedIn URL, GitHub username, CV PDF file, portrait photo
