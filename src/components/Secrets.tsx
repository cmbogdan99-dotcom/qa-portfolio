"use client";

import { useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

function glitchElement(el: HTMLElement) {
  if (el.dataset.glitching) return;
  el.dataset.glitching = "1";
  const original = el.textContent ?? "";
  const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
  let frame = 0;
  const TOTAL = 52;
  let nonSpaceCount = 0;
  for (const ch of original) if (ch !== " ") nonSpaceCount++;

  const id = window.setInterval(() => {
    frame++;
    if (frame >= TOTAL) {
      el.textContent = original;
      delete el.dataset.glitching;
      clearInterval(id);
      return;
    }
    const resolved = Math.floor((frame / TOTAL) * nonSpaceCount);
    let r = 0;
    el.textContent = original
      .split("")
      .map((ch) => {
        if (ch === " ") return " ";
        const shouldResolve = r < resolved;
        r++;
        return shouldResolve ? ch : POOL[Math.floor(Math.random() * POOL.length)];
      })
      .join("");
  }, 16);
}

export function Secrets() {
  const nameClicks = useRef<number[]>([]);

  useEffect(() => {
    let seq: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "B") {
        window.dispatchEvent(new CustomEvent("qa-bug-spawn"));
        return;
      }
      seq = [...seq.slice(-9), e.key];
      if (seq.join(",") === KONAMI.join(",")) {
        seq = [];
        window.dispatchEvent(new CustomEvent("qa-bug-konami"));
      }
    };

    const onNameClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-secret-name]")) return;
      const now = Date.now();
      nameClicks.current = [...nameClicks.current.filter((t) => now - t < 2000), now];
      if (nameClicks.current.length >= 3) {
        nameClicks.current = [];
        const el = document.querySelector("[data-secret-name]") as HTMLElement | null;
        if (el) glitchElement(el);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onNameClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onNameClick);
    };
  }, []);

  return null;
}
