# Phase 5 — Deployment, Workflow, Maintenance

## Before first deploy — content checklist

Search the codebase for `[CONFIRM]` and resolve every hit:

- [ ] Employment dates + official titles (src/content/site.ts) — from your CV
- [ ] LinkedIn URL and GitHub username (src/content/site.ts)
- [ ] Location city (src/content/site.ts)
- [ ] Final domain (src/app/layout.tsx, sitemap.ts, robots.ts)
- [ ] Add `public/portrait.jpg` (square, ≥800px) — hero picks it up automatically
- [ ] Add `public/cv/bogdan-carcadea-cv.pdf`

## GitHub workflow

```powershell
cd F:\qa-portfolio
git init
git add -A
git commit -m "Initial portfolio"
gh repo create qa-portfolio --private --source . --push
```

Day-to-day: work on branches (`content/update-experience`, `feat/...`), open a PR, let Vercel's preview deployment be your staging environment, merge to `main` to ship. Even solo, PRs give you deployment previews and a change history you can reason about.

## Vercel deployment

1. vercel.com → Add New Project → import the GitHub repo.
2. Framework preset: Next.js. No configuration needed — defaults are correct.
3. Every push to `main` deploys production; every PR gets a preview URL.
4. Domain: Project → Settings → Domains → add your domain, point DNS (CNAME → `cname.vercel-dns.com`). Then update the `[CONFIRM]` domain constants and redeploy.

Why Vercel: zero-config Next.js hosting, global CDN for a static page, free tier fully covers this site, preview deployments per PR.

## Generating the PDF portfolio (Phase 6)

The site has a dedicated print stylesheet (light palette, accordions auto-expanded, link URLs printed, nav removed):

1. Open the production site in Chrome.
2. Ctrl+P → Destination: *Save as PDF* → Margins: Default → **Background graphics: on**.
3. Save as `bogdan-carcadea-portfolio.pdf`.

Regenerate after any content change — the PDF is always a projection of the site, never maintained separately.

## Maintenance

- **Content edits:** only ever touch `src/content/site.ts`. Commit, push, done.
- **Dependency updates:** quarterly, `npm outdated` → update → `npm run build` → eyeball the preview deployment. The dependency surface is deliberately tiny, so this stays a 10-minute task.
- **Verification before shipping:** `npm run build` must pass; run Lighthouse (Chrome DevTools) against the preview URL; keep all categories ≥95.

## Future expansion roadmap (only if a real need appears)

1. **Automation case studies** — when your Playwright/CI work produces a public repo worth showing, add a second route `/automation` and link it from the Expertise section.
2. **Light theme toggle** — tokens are CSS variables, so this is an afternoon, not a redesign.
3. **Localization (RO)** — the content file structure makes a `site.ro.ts` straightforward if you ever target Romanian companies that expect it.
4. **Analytics** — Vercel Analytics (cookie-free) only if you actually want the data; it's the only third-party script that would ever be justified.

What NOT to add: a blog, testimonials, animated skill meters, a chatbot. Each would dilute the positioning the site was built to create.
