"use client";

import { useRef } from "react";

// A pull-cord light switch hanging from under the nav (desktop only).
// Pulling it toggles the theme — the discoverable sibling of the hidden
// ThemeDot in the hero eyebrow. The pull is animated with WAAPI so no CSS
// specificity or re-render timing can swallow it.
export function LightSwitch() {
  const busy = useRef(false);

  const pull = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (busy.current) return;
    busy.current = true;

    e.currentTarget.animate(
      [
        { transform: "scaleY(1)" },
        { transform: "scaleY(1.35)", offset: 0.35 },
        { transform: "scaleY(0.97)", offset: 0.75 },
        { transform: "scaleY(1)" },
      ],
      { duration: 520, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)" },
    );

    // Flip the theme at the bottom of the pull
    setTimeout(() => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "light" ? "dark" : "light";
      document.documentElement.classList.add("theme-transition");
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      setTimeout(
        () => document.documentElement.classList.remove("theme-transition"),
        350,
      );
    }, 180);

    setTimeout(() => {
      busy.current = false;
    }, 520);
  };

  return (
    <button
      type="button"
      onClick={pull}
      aria-label="Toggle light"
      title="Lights"
      className="light-cord fixed right-10 top-16 z-40 hidden md:block"
    >
      <svg width="14" height="72" viewBox="0 0 14 72" fill="none" aria-hidden="true">
        {/* cord */}
        <line x1="7" y1="0" x2="7" y2="58" stroke="var(--faint)" strokeWidth="1.2" />
        {/* knot */}
        <circle cx="7" cy="58" r="1.6" fill="var(--faint)" />
        {/* handle ring */}
        <circle cx="7" cy="64" r="4.4" stroke="var(--faint)" strokeWidth="1.4" fill="none" />
      </svg>
    </button>
  );
}
