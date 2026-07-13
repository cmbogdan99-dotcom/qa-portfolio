# Codebase Concerns

**Analysis Date:** 2026-07-13

## Tech Debt

**Module-level mutable state in QaBug:**
- Issue: `let nextId = 1` and `let nextNoteId = 1` are module-level mutable counters (`src/components/QaBug.tsx` lines 32–33). In React 19 Strict Mode (double-invocation in dev), or if the component ever mounts more than once per page load, IDs continue from the previous mount rather than resetting. This is invisible in production but could produce duplicate keys during dev hot-reload.
- Files: `src/components/QaBug.tsx`
- Impact: Stale IDs if component unmounts and remounts; React key collisions possible in dev.
- Fix approach: Move counters into a `useRef` initialised to 1 inside the component, or use a module-scoped factory that resets on demand.

**`window.setTimeout` / `window.setInterval` instead of bare `setTimeout`:**
- Issue: All timer calls are prefixed with `window.` (`src/components/QaBug.tsx` lines 110, 181, 439, 443, 451). This works in browsers but is a stylistic inconsistency from the rest of the codebase and would break in any SSR/test environment that stubs the global.
- Files: `src/components/QaBug.tsx`
- Impact: Low in production; blocks unit-testing the component in a Node environment.
- Fix approach: Use bare `setTimeout`/`setInterval`; Next.js already guards client-only code with `"use client"`.

**Hard-coded production URL in layout metadata:**
- Issue: `const siteUrl = "https://qa-portfolio-six-psi.vercel.app"` is hard-coded in `src/app/layout.tsx` line 20 rather than driven by an environment variable. The `metadataBase` and all OG URLs resolve to the Vercel preview domain, not a canonical custom domain if one is ever attached.
- Files: `src/app/layout.tsx`
- Impact: OG cards and canonical tags will point to the wrong URL after a domain change. Also means `NEXT_PUBLIC_SITE_URL` is never read, so environment-based overrides are impossible.
- Fix approach: `const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qa-portfolio-six-psi.vercel.app";`

**`projects/page.tsx` reads filesystem at render time without caching:**
- Issue: `fs.readdirSync(galleryDir)` runs on every server render (`src/app/projects/page.tsx` line 27). The comment acknowledges this is intentional for dev-server UX, but on the Vercel serverless runtime this means a filesystem call per request.
- Files: `src/app/projects/page.tsx`
- Impact: Negligible latency at low traffic; becomes a concern if the page is not statically generated (ISR or force-dynamic).
- Fix approach: Confirm the page is statically generated at build time (`output: 'export'` or no `revalidate` override). If dynamic rendering is ever needed, memoize with `React.cache`.

**`DefectCounter` hard-codes animation start at 9950:**
- Issue: The count-up animation always starts from `9950` and ends at `10000` (`src/components/DefectCounter.tsx` lines 21–22), mirroring the `stats` array value in `src/content/site.ts`. If the stat copy ever changes, the animation range must be manually updated in a second file.
- Files: `src/components/DefectCounter.tsx`, `src/content/site.ts`
- Impact: Silent desync — the counter animation would show the wrong range without any build error.
- Fix approach: Export the numeric value from `site.ts` and import it into `DefectCounter`.

---

## Known Bugs

**`PortraitDrag` spring-back timer leaks on fast unmount:**
- Symptoms: A `setTimeout` set in `release()` (`src/components/PortraitDrag.tsx` line 40) is stored in `timer.current` but the component has no `useEffect` cleanup to clear it on unmount. If the component unmounts before the 2 s timeout fires, it calls `setOffsetX` on an unmounted component.
- Files: `src/components/PortraitDrag.tsx`
- Trigger: Navigate away from the page within 2 s of releasing the portrait drag.
- Workaround: React 19 suppresses the setState-after-unmount warning, but the dangling timer still executes.

**`QaBug` outer container is `aria-hidden="true"` but contains interactive buttons:**
- Symptoms: The wrapping `<div aria-hidden="true">` (`src/components/QaBug.tsx` line 469) hides all child buttons from the accessibility tree, including the dismiss `×` button on report cards that has `aria-label="Dismiss"` (line 542). Screen-reader users cannot interact with or dismiss the floating report popups.
- Files: `src/components/QaBug.tsx`
- Trigger: Always — any assistive technology session.
- Workaround: None for the user; the UX intent is purely decorative, so making the whole layer aria-hidden is defensible, but the dismiss button inside is then silently unreachable.

---

## Security Considerations

**`dangerouslySetInnerHTML` inline script in layout:**
- Risk: The theme-flash prevention script in `src/app/layout.tsx` (lines 53–57) uses `dangerouslySetInnerHTML`. The payload is a static string defined at module load time — no user input is interpolated — so the actual XSS risk is zero. However, if a future developer extracts the script content into a variable constructed from runtime values, the guard is invisible.
- Files: `src/app/layout.tsx`
- Current mitigation: Static string only; no interpolation.
- Recommendations: Add an inline comment warning against interpolating dynamic values into this script. Alternatively, move to an external `public/theme-init.js` loaded with `<script src>` and a `nonce` CSP header.

**`target="_blank"` without `rel="noopener noreferrer"` audit:**
- Risk: All external links in `src/components/Contact.tsx` (lines 38, 44) already include `rel="noopener noreferrer"`. Check passes. No action needed, but any future external link addition must follow this pattern.
- Files: `src/components/Contact.tsx`
- Current mitigation: Correct on existing links.

---

## Performance Bottlenecks

**`QaBug` runs `requestAnimationFrame` continuously even when not animating:**
- Problem: The `step` function unconditionally reschedules itself (`raf = requestAnimationFrame(step)`) and only returns early if `!activeRef.current || document.hidden` (`src/components/QaBug.tsx` line 205). The rAF loop is always running — even when zero bugs are on screen — from mount until unmount.
- Files: `src/components/QaBug.tsx`
- Cause: The loop is used for the physics tick; there is no pause-when-idle path, only a skip that burns a rAF slot per frame (60 empty callbacks/s).
- Improvement path: Cancel the rAF when `bugsRef.current.length === 0` and restart it in `spawn()`. Gate also on `document.hidden` via a `visibilitychange` listener that stops/restarts the loop.

**`visibleRectOf` calls `document.querySelector` inside the rAF loop:**
- Problem: `visibleRectOf` (called up to 3 times per bug per frame) runs `document.querySelector(selector)` on every invocation (`src/components/QaBug.tsx` line 118). With multiple bugs this is multiple selector queries per frame (60 fps).
- Files: `src/components/QaBug.tsx`
- Cause: No caching or ref — always re-queries the DOM.
- Improvement path: Cache the queried element in a ref after first resolution; invalidate only on resize/mutation.

**`portrait.jpg` loaded at full 568×621 resolution in mobile layout:**
- Problem: `src/components/Hero.tsx` line 83 renders a portrait image at `h-48 w-48` (192 × 192 px on mobile) but the source is the same `portrait.jpg` (568×621 px native). The mobile `<img>` element below the `PortraitDrag` component does not use Next.js `<Image>`, so no automatic resizing occurs.
- Files: `src/components/Hero.tsx`
- Cause: The mobile portrait is rendered as a plain element (inspect `Hero.tsx` around line 83).
- Improvement path: Use `<Image>` with `sizes="192px"` for the mobile portrait as well, matching the desktop usage.

---

## Fragile Areas

**`QaBug` state–ref split is load-bearing and easy to break:**
- Files: `src/components/QaBug.tsx`
- Why fragile: Bug positions and physics state live in `bugsRef.current` (mutable ref array), while rendered IDs live in `bugIds` state. These two must stay in sync manually. Every spawn/kill must update both. A missed `setBugIds` call would render stale buttons with no matching physics state, causing silent `undefined` access on `bug.el`.
- Safe modification: Always pair `bugsRef.current.push(bug)` with `setBugIds((ids) => [...ids, bug.id])` and `bugsRef.current = bugsRef.current.filter(...)` with `setBugIds((ids) => ids.filter(...))`. No single-sided mutations.
- Test coverage: Zero — no tests exist for this component.

**`PortraitDrag` drag state uses both a ref (`dragging`) and state (`isDragging`) for the same concept:**
- Files: `src/components/PortraitDrag.tsx`
- Why fragile: `dragging.current` (ref) controls whether pointer events are processed; `isDragging` (state) controls the CSS transition. They must always be set together. If a future change sets one but not the other, either the drag gesture breaks silently or the spring transition fires during drag.
- Safe modification: Consolidate into a single ref; drive the CSS transition by comparing `offsetX` changes rather than a separate flag.

**`Secrets` component uses `document.querySelector("[data-secret-name]")` for imperative DOM mutation (glitch effect):**
- Files: `src/components/Secrets.tsx`
- Why fragile: The glitch effect directly mutates `el.textContent` on whatever element carries `[data-secret-name]`. If the attribute is removed, renamed, or the component containing it is conditionally rendered, the effect silently fails. If React re-renders that element during the glitch interval, `textContent` will be overwritten by the virtual DOM.
- Safe modification: Expose a callback ref or context from the target component rather than querying the DOM from a sibling.

---

## Missing Critical Features

**No `twitter:card` / X meta tags:**
- Problem: `src/app/layout.tsx` metadata only sets `openGraph` properties. Twitter/X uses its own `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` meta tags. Without them, X link previews fall back to a plain URL with no card.
- Blocks: Rich link previews on X/Twitter when the portfolio is shared.

**No `not-found.tsx` metadata export:**
- Problem: `src/app/not-found.tsx` exports no `metadata`. Next.js App Router does not automatically inherit page metadata on 404 routes; the browser tab title will fall back to the root layout's title rather than showing "404 — Page Not Found".
- Files: `src/app/not-found.tsx`
- Impact: Minor UX: confusing tab title for 404 responses.

**No contact form — clipboard-only email copy:**
- Problem: `src/components/Contact.tsx` email interaction is a clipboard copy button only. If `navigator.clipboard` is unavailable (HTTP context, older browser, or user permission denied), the catch block silently does nothing (`// clipboard unavailable — fallback: do nothing`). The user has no way to obtain the email address through the UI.
- Files: `src/components/Contact.tsx`
- Blocks: Email contact for users on non-HTTPS origins or browsers that deny clipboard access.
- Fix approach: Display the email address as visible text alongside the copy button, or fall back to a `mailto:` link.

---

## Test Coverage Gaps

**Zero tests — no test framework configured:**
- What's not tested: Every component, every interaction, every data transformation. No jest, vitest, or Playwright config exists in the project root.
- Files: All of `src/` — `src/components/QaBug.tsx`, `src/components/PortraitDrag.tsx`, `src/components/DefectCounter.tsx`, `src/components/Contact.tsx`, `src/content/site.ts`
- Risk: Any refactor of `QaBug.tsx` (552 lines, complex state machine) has no safety net. The ref/state sync contract described above can be broken without any automated signal.
- Priority: High for `QaBug.tsx` logic; Medium for `PortraitDrag.tsx`; Low for static content components.

**`not-found.tsx` duplicate-bug cap is untested:**
- What's not tested: The `DUPLICATE_CAP = 14` guard in `QaBug` (`src/components/QaBug.tsx` line 69) — at cap, clicks produce a report but no new bug. This is the primary interaction on the 404 page and has no test.
- Files: `src/components/QaBug.tsx`, `src/app/not-found.tsx`
- Risk: Off-by-one or condition inversion would either allow unbounded DOM growth or silently stop duplicating before the cap.
- Priority: Medium.

---

## Scaling Limits

**`reports` state array grows unboundedly during fast bug-killing:**
- Current capacity: Each kill or hide event appends to `reports` state; each is cleaned up by a `setTimeout` after 4.2 s (`src/components/QaBug.tsx` line 111). On the 404 page (`duplicateOnKill`), rapid clicking can enqueue many reports faster than they expire.
- Limit: No cap on `reports.length`; each entry adds a DOM node and a lingering `setTimeout`. At very high click rates (unlikely but not impossible), this produces noticeable DOM bloat.
- Scaling path: Cap `reports` at a maximum of ~5 entries; drop the oldest when the cap is exceeded.

---

*Concerns audit: 2026-07-13*
