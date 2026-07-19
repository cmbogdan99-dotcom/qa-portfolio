"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { links } from "@/content/site";

type Cmd = {
  id: string;
  label: string;
  hint: string;
  action: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const goTo = useCallback(
    (hash: string) => {
      if (pathname !== "/") {
        router.push(`/${hash}`);
      } else {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [pathname, router],
  );

  const commands = useMemo<Cmd[]>(
    () => [
      { id: "about", label: "Go to About", hint: "section", action: () => goTo("#about") },
      { id: "work", label: "Go to Case studies", hint: "section", action: () => goTo("#work") },
      { id: "experience", label: "Go to Experience", hint: "section", action: () => goTo("#experience") },
      { id: "expertise", label: "Go to Expertise", hint: "section", action: () => goTo("#expertise") },
      { id: "deep-dive", label: "Go to Field notes", hint: "section", action: () => goTo("#deep-dive") },
      { id: "contact", label: "Go to Contact", hint: "section", action: () => goTo("#contact") },
      { id: "projects", label: "Open all projects", hint: "page", action: () => router.push("/projects") },
      { id: "cv", label: "Download CV", hint: "action", action: () => { window.location.href = links.cv; } },
      { id: "email", label: "Copy email address", hint: "action", action: () => { navigator.clipboard?.writeText(links.email); } },
      { id: "linkedin", label: "Open LinkedIn", hint: "link", action: () => window.open(links.linkedin, "_blank", "noopener") },
      { id: "github", label: "Open GitHub", hint: "link", action: () => window.open(links.github, "_blank", "noopener") },
      {
        id: "theme",
        label: "Toggle theme",
        hint: "action",
        action: () => {
          const cur = document.documentElement.getAttribute("data-theme");
          const next = cur === "light" ? "dark" : "light";
          document.documentElement.classList.add("theme-transition");
          document.documentElement.setAttribute("data-theme", next);
          localStorage.setItem("theme", next);
          setTimeout(() => document.documentElement.classList.remove("theme-transition"), 350);
        },
      },
      {
        id: "bug",
        label: "Release a bug",
        hint: "?",
        action: () => window.dispatchEvent(new CustomEvent("qa-bug-spawn")),
      },
    ],
    [goTo, router],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setActive(0);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const run = (cmd: Cmd) => {
    setOpen(false);
    cmd.action();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 pt-[18vh] backdrop-blur-[2px]"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4">
          <span className="font-mono text-[13px] text-faint">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && filtered[active]) {
                run(filtered[active]);
              }
            }}
            placeholder="Type a command or search…"
            className="w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-faint"
            spellCheck={false}
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">
            esc
          </kbd>
        </div>
        <ul className="max-h-[300px] overflow-y-auto py-1.5">
          {filtered.length === 0 && (
            <li className="px-4 py-3 font-mono text-[12px] text-faint">
              no results — bug filed as WONTFIX
            </li>
          )}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => run(c)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                  i === active ? "bg-background text-foreground" : "text-muted"
                }`}
              >
                <span>{c.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                  {c.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
