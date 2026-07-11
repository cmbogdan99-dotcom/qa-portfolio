"use client";

import { useEffect } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function Secrets() {
  useEffect(() => {
    let seq: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      // Shift+B → summon extra bugs
      if (e.shiftKey && e.key === "B") {
        window.dispatchEvent(new CustomEvent("qa-bug-spawn"));
        return;
      }

      // Konami code → all bugs do a spin
      seq = [...seq.slice(-9), e.key];
      if (seq.join(",") === KONAMI.join(",")) {
        seq = [];
        window.dispatchEvent(new CustomEvent("qa-bug-konami"));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
