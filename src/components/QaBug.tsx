"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Beetles that live in the hero. They amble, get curious, and panic only
 * if the cursor rushes at them — approach slowly and you can catch one.
 * Clicking splats it and closes a ticket. A new one wanders in later,
 * and if left alone they multiply (up to three).
 *
 * Movement is a per-frame simulation (not CSS transitions): each bug
 * always walks along the direction it is facing, turning gradually, so
 * there is no ice-skating or sideways dashing.
 */

type BugState = {
  id: number;
  x: number;
  y: number;
  heading: number; // radians, direction of travel
  speed: number;
  targetSpeed: number;
  tx: number;
  ty: number;
  pauseUntil: number;
  lastBother: number; // last time the cursor bothered it
  phase: number; // personal rhythm offset
  el: HTMLButtonElement | null;
  inner: HTMLSpanElement | null;
};

type Splat = { id: number; x: number; y: number; n: number };

let nextId = 1;

function makeBug(w: number, h: number): BugState {
  return {
    id: nextId++,
    x: 20 + Math.random() * Math.max(w - 40, 20),
    y: 10 + Math.random() * Math.max(h - 20, 20),
    heading: Math.random() * Math.PI * 2,
    speed: 0,
    targetSpeed: 20,
    tx: w / 2,
    ty: h / 2,
    pauseUntil: 0,
    lastBother: performance.now(),
    phase: Math.random() * 10,
    el: null,
    inner: null,
  };
}

export function QaBug() {
  const areaRef = useRef<HTMLDivElement>(null);
  const bugsRef = useRef<BugState[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, t: 0 });
  const killsRef = useRef(0);

  const [bugIds, setBugIds] = useState<number[]>([]);
  const [splats, setSplats] = useState<Splat[]>([]);

  const spawn = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const { width, height } = area.getBoundingClientRect();
    const bug = makeBug(width, height);
    bugsRef.current.push(bug);
    setBugIds((ids) => [...ids, bug.id]);
  }, []);

  // Simulation loop.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One static bug, still clickable.
      spawn();
      return;
    }
    spawn();

    const onMouse = (e: MouseEvent) => {
      const area = areaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const dt = Math.max(now - mouse.current.t, 8) / 1000;
      // Smoothed cursor velocity, px/s.
      mouse.current.vx = mouse.current.vx * 0.7 + ((x - mouse.current.x) / dt) * 0.3;
      mouse.current.vy = mouse.current.vy * 0.7 + ((y - mouse.current.y) / dt) * 0.3;
      mouse.current.x = x;
      mouse.current.y = y;
      mouse.current.t = now;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Bugs multiply if the colony survives long enough.
    const breeder = window.setInterval(() => {
      if (bugsRef.current.length > 0 && bugsRef.current.length < 3) spawn();
    }, 30000);

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const area = areaRef.current;
      if (!area) return;
      const { width: w, height: h } = area.getBoundingClientRect();
      const m = mouse.current;
      const stale = now - m.t > 120; // cursor idle → no velocity threat
      const mSpeed = stale ? 0 : Math.hypot(m.vx, m.vy);

      for (const bug of bugsRef.current) {
        const dxm = bug.x - m.x;
        const dym = bug.y - m.y;
        const distM = Math.hypot(dxm, dym);
        // Is the cursor heading toward the bug?
        const closing = stale
          ? 0
          : (-(m.vx * dxm) - m.vy * dym) / Math.max(distM, 1);

        if (distM < 170 && closing > 320) {
          // Startled: sprint directly away from the cursor.
          const away = Math.atan2(dym, dxm);
          bug.tx = Math.min(Math.max(bug.x + Math.cos(away) * 200, 12), w - 12);
          bug.ty = Math.min(Math.max(bug.y + Math.sin(away) * 200, 8), h - 8);
          bug.targetSpeed = 240 + mSpeed * 0.1;
          bug.pauseUntil = 0;
          bug.lastBother = now;
        } else if (distM < 100) {
          // Uneasy: keeps moving, drifts away from slow-approaching cursors.
          bug.lastBother = now;
          if (now > bug.pauseUntil && Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 20) {
            const away = Math.atan2(dym, dxm) + (Math.random() - 0.5);
            bug.tx = Math.min(Math.max(bug.x + Math.cos(away) * 90, 12), w - 12);
            bug.ty = Math.min(Math.max(bug.y + Math.sin(away) * 90, 8), h - 8);
          }
          bug.targetSpeed = 55 + Math.random() * 30;
        } else {
          // Ambient life: speed breathes with a personal rhythm, and a bug
          // ignored for a while settles into a lazy crawl.
          const idle = (now - bug.lastBother) / 1000;
          const base = idle > 12 ? 10 : 26;
          const breathe = 0.65 + 0.5 * Math.sin(now / 1400 + bug.phase * 3);
          if (now > bug.pauseUntil && Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 8) {
            // Arrived: pause, then pick somewhere new.
            bug.pauseUntil = now + 400 + Math.random() * (idle > 12 ? 3200 : 1600);
            bug.tx = 12 + Math.random() * (w - 24);
            bug.ty = 8 + Math.random() * (h - 16);
          }
          bug.targetSpeed = now < bug.pauseUntil ? 0 : base * breathe + 4;
        }

        // Ease speed toward target (acceleration), turn gradually, walk forward.
        bug.speed += (bug.targetSpeed - bug.speed) * Math.min(dt * 4, 1);
        const want = Math.atan2(bug.ty - bug.y, bug.tx - bug.x);
        let turn = want - bug.heading;
        while (turn > Math.PI) turn -= Math.PI * 2;
        while (turn < -Math.PI) turn += Math.PI * 2;
        const maxTurn = (bug.targetSpeed > 150 ? 9 : 3.4) * dt;
        bug.heading += Math.max(-maxTurn, Math.min(maxTurn, turn));
        bug.x += Math.cos(bug.heading) * bug.speed * dt;
        bug.y += Math.sin(bug.heading) * bug.speed * dt;
        bug.x = Math.min(Math.max(bug.x, 6), w - 6);
        bug.y = Math.min(Math.max(bug.y, 4), h - 4);

        if (bug.el) bug.el.style.transform = `translate(${bug.x}px, ${bug.y}px)`;
        if (bug.inner)
          bug.inner.style.transform = `rotate(${(bug.heading * 180) / Math.PI + 90}deg)`;
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(breeder);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [spawn]);

  const kill = (id: number) => {
    const bug = bugsRef.current.find((b) => b.id === id);
    if (!bug) return;
    bugsRef.current = bugsRef.current.filter((b) => b.id !== id);
    setBugIds((ids) => ids.filter((i) => i !== id));
    killsRef.current += 1;
    const splat: Splat = { id: bug.id, x: bug.x, y: bug.y, n: killsRef.current };
    setSplats((s) => [...s, splat]);
    window.setTimeout(
      () => setSplats((s) => s.filter((sp) => sp.id !== splat.id)),
      2600,
    );
    // The colony never dies out completely.
    if (bugsRef.current.length === 0) window.setTimeout(spawn, 4000);
  };

  return (
    <div
      ref={areaRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 hidden select-none md:block"
    >
      {bugIds.map((id) => (
        <button
          key={id}
          ref={(el) => {
            const bug = bugsRef.current.find((b) => b.id === id);
            if (bug) bug.el = el;
          }}
          type="button"
          tabIndex={-1}
          onClick={() => kill(id)}
          title="Report this bug"
          className="pointer-events-auto absolute -ml-[14px] -mt-[14px] cursor-pointer border-0 bg-transparent p-1.5 outline-none"
        >
          <span
            ref={(el) => {
              const bug = bugsRef.current.find((b) => b.id === id);
              if (bug) bug.inner = el;
            }}
            className="block"
          >
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="text-faint transition-colors hover:text-muted">
              <path d="M7 3.5L5.5 1.5M13 3.5l1.5-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M4.5 8L2 6.5M4.5 11H1.5M4.5 14L2 15.5M15.5 8L18 6.5M15.5 11h3M15.5 14l2.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="10" cy="11" rx="5.5" ry="7" fill="currentColor" opacity="0.85" />
              <circle cx="10" cy="4.5" r="2.2" fill="currentColor" />
              <path d="M10 5.5v12" stroke="var(--background)" strokeWidth="0.8" />
            </svg>
          </span>
        </button>
      ))}

      {splats.map((s) => (
        <div key={`splat-${s.id}`} className="absolute" style={{ left: 0, top: 0, transform: `translate(${s.x - 10}px, ${s.y - 10}px)` }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="splat text-faint">
            <path
              d="M10 4l1.2 3.1L14 5.5l-1 3 3.2.6-2.6 1.9 2 2.4-3.1-.4.3 3.1-2.8-1.7-1.6 2.7-.9-3-3 .9 1.5-2.8L3 11l3-1.4-1.8-2.5 3.1.5L7 4.5l2 2z"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
          <p
            className="splat-label absolute left-6 top-0 whitespace-nowrap rounded bg-background/85 px-1.5 py-0.5 font-mono text-[12px] text-faint"
            style={{
              transform: s.x > 260 ? "translateX(calc(-100% - 40px))" : undefined,
            }}
          >
            bug #{s.n} · closed
          </p>
        </div>
      ))}
    </div>
  );
}
