"use client";

import { useState } from "react";

// A pull-cord light switch hanging from under the nav (desktop only).
// Pulling it toggles the theme — the discoverable sibling of the hidden
// ThemeDot in the hero eyebrow.
export function LightSwitch() {
  const [pulling, setPulling] = useState(false);

  const pull = () => {
    if (pulling) return;
    setPulling(true);
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
    }, 160);
    setTimeout(() => setPulling(false), 420);
  };

  return (
    <button
      type="button"
      onClick={pull}
      aria-label="Toggle light"
      title="Lights"
      className={`light-cord fixed right-10 top-16 z-40 hidden md:block ${pulling ? "light-cord-pulled" : ""}`}
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
