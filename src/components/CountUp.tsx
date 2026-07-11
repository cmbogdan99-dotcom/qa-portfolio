"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  to: number;
  from?: number;
  suffix?: string;
  duration?: number;
}

export function CountUp({ to, from = 0, suffix = "", duration = 1100 }: Props) {
  const [val, setVal] = useState(from);
  const spanRef = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || triggered.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        obs.disconnect();

        const start = performance.now();
        const range = to - from;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(from + ease * range));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, from, duration]);

  return (
    <span ref={spanRef}>
      {val.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
