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
  el.classList.add("name-glitching");
  const onEnd = () => {
    el.classList.remove("name-glitching");
    delete el.dataset.glitching;
    el.removeEventListener("animationend", onEnd);
  };
  el.addEventListener("animationend", onEnd);
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
