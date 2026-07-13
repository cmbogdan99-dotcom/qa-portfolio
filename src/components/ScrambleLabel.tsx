"use client";

import { useEffect, useRef } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#@01";

function scrambleTo(el: HTMLElement, target: string, duration = 700) {
  const start = performance.now();
  let frame: number;

  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    let out = "";
    for (let i = 0; i < target.length; i++) {
      // Each char resolves left-to-right as t progresses
      if (t >= (i + 1) / target.length) {
        out += target[i];
      } else if (target[i] === " ") {
        out += " ";
      } else {
        out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
    el.textContent = out;
    if (t < 1) frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export function ScrambleLabel({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancel: (() => void) | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cancel?.();
          cancel = scrambleTo(el, text);
        } else {
          cancel?.();
          el.textContent = text;
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancel?.();
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
