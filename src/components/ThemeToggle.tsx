"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 350);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        type="button"
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="flex items-center gap-1 font-mono text-[11px] text-faint/60 transition-colors hover:text-faint"
      >
        <span className="text-faint/30">$</span>
        <span>theme --{theme}</span>
        <span
          className="ml-0.5 inline-block w-[7px] overflow-hidden transition-all duration-100"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          ▌
        </span>
      </button>
    </div>
  );
}
