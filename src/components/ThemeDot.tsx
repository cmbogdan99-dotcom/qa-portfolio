"use client";
import { useEffect, useState } from "react";

/**
 * The · separator between role and location in the hero eyebrow.
 * It is also the theme toggle. Nobody told you that.
 */
export function ThemeDot() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") setTheme(t);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
    setTimeout(() => document.documentElement.classList.remove("theme-transition"), 350);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      suppressHydrationWarning
      aria-label="Toggle theme"
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(); }}
      className="cursor-pointer select-none transition-opacity duration-300 hover:opacity-50 focus:outline-none"
    >
      ·
    </span>
  );
}
