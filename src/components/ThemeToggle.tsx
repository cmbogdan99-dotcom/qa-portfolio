"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

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

  // Avoid hydration mismatch — render nothing on the server.
  if (!mounted) return <span className="w-14" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="select-none rounded px-1.5 py-1 font-mono text-[11px] tracking-wide text-faint transition-colors hover:text-muted"
    >
      <span className="opacity-40">&lt;</span>
      {theme}
      <span className="opacity-40"> /&gt;</span>
    </button>
  );
}
