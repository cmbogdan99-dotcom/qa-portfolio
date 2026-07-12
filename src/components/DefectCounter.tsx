"use client";

import { useEffect, useRef, useState } from "react";

export function DefectCounter() {
  const [display, setDisplay] = useState(9950);
  const [extra, setExtra] = useState(0);
  const triggered = useRef(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Count up from 9950 → 10000 when the stat enters the viewport.
  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        obs.disconnect();
        const start = performance.now();
        const from = 9950, to = 10000, dur = 900;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(from + ease * (to - from)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onDefect = () => setExtra((e) => e + 1);
    const onHunting = () => {
      const el = spanRef.current;
      if (!el) return;
      el.classList.remove("stat-hunting");
      void el.offsetWidth;
      el.classList.add("stat-hunting");
      setTimeout(() => el.classList.remove("stat-hunting"), 2200);
    };
    window.addEventListener("qa-bug-defect", onDefect);
    window.addEventListener("qa-bug-hunting", onHunting);
    return () => {
      window.removeEventListener("qa-bug-defect", onDefect);
      window.removeEventListener("qa-bug-hunting", onHunting);
    };
  }, []);

  const count = display + extra;
  return (
    <span ref={spanRef} key={extra} className={extra > 0 ? "stat-pop inline-block" : undefined}>
      {count.toLocaleString("en-US")}+
    </span>
  );
}
