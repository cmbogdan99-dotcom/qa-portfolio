"use client";

import { useEffect, useRef, useState } from "react";

// Subtle fake test-run strip in the footer: types out a short Playwright
// run once when scrolled into view, then stays static. One line at a time,
// faint colors — decoration, not a centerpiece.
const lines = [
  { text: "$ npx playwright test --project=portfolio", cls: "text-faint" },
  { text: "✓ hero renders identity and platforms (312ms)", cls: "text-ok" },
  { text: "✓ CV downloads from portrait reveal (287ms)", cls: "text-ok" },
  { text: "✓ no unexpected bugs on page — only the intended ones (194ms)", cls: "text-ok" },
  { text: "3 passed (1.2s)", cls: "text-faint" },
];

export function TestRun() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = () => {
      if (started.current) return;
      started.current = true;
      window.removeEventListener("scroll", check);
      let i = 0;
      const tick = () => {
        i += 1;
        setShown(i);
        if (i < lines.length) setTimeout(tick, i === 1 ? 700 : 420);
      };
      setTimeout(tick, 300);
    };
    // Plain rect check on scroll — IntersectionObserver proved flaky with the
    // smooth-scroll setup, and this strip only needs a one-shot trigger.
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 60) start();
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="mx-auto w-full max-w-6xl px-6 pb-2 pt-8 font-mono text-[11px] leading-[1.7] select-none"
    >
      {lines.slice(0, shown).map((l) => (
        <p key={l.text} className={l.cls === "text-ok" ? "testrun-ok" : "text-faint"}>
          {l.text}
        </p>
      ))}
      {/* Reserve height so the footer doesn't jump while lines appear */}
      <div style={{ height: `${(lines.length - shown) * 1.7 * 11}px` }} />
    </div>
  );
}
