"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Beetles that live in the hero. Per-frame simulation, per-bug state machine:
 *
 * - roam:  ambles with a breathing rhythm, prefers the text side, sometimes
 *          slips UNDER the text or portrait (z-index), where it also slows
 *          down. Scaring it while hidden pops it back in front.
 * - flee:  panics when the cursor rushes at it; brief lingering fear, but
 *          catchable — this is a toy, not a boss fight.
 * - hide:  chased for a while? It walks to the portrait's edge, posts a
 *          "could not be reproduced" report, then slides underneath.
 * - stat:  very rarely (and only if the counter is on screen) sprints to
 *          the defects counter and adds one.
 *
 * The whole simulation pauses when the hero is off screen or the tab is in
 * the background. They multiply every minute, up to five. Clicking one
 * fades it out and files a tiny retro bug report. Counter resets on refresh.
 */

type Mode = "roam" | "flee" | "hide" | "hidden" | "stat";

type BugState = {
  id: number;
  x: number;
  y: number;
  heading: number;
  speed: number;
  targetSpeed: number;
  tx: number;
  ty: number;
  mode: Mode;
  modeUntil: number;
  pauseUntil: number;
  chaseMs: number;
  lastBother: number;
  phase: number;
  under: boolean;
  el: HTMLButtonElement | null;
  inner: HTMLSpanElement | null;
};

type Report = { id: number; x: number; y: number; title: string; text: string };
type Ghost = { id: number; x: number; y: number; angle: number };
type Splat = { id: number; x: number; y: number; r: number };

let nextId = 1;
let nextNoteId = 1;

const killMessages = [
  "no longer reproducible on latest build",
  "fix confirmed — closing ticket",
  "regression check passed",
  "retested. clean.",
  "dev fix accepted — closing",
  "cannot reproduce after patch",
  "verified fixed in HEAD",
];

function makeBug(w: number, h: number, now: number): BugState {
  return {
    id: nextId++,
    x: 20 + Math.random() * Math.max(w - 40, 20),
    y: 10 + Math.random() * Math.max(h - 20, 20),
    heading: Math.random() * Math.PI * 2,
    speed: 0,
    targetSpeed: 20,
    tx: w / 2,
    ty: h / 2,
    mode: "roam",
    modeUntil: 0,
    pauseUntil: 0,
    chaseMs: 0,
    lastBother: now,
    phase: Math.random() * 10,
    under: false,
    el: null,
    inner: null,
  };
}

export function QaBug() {
  const areaRef = useRef<HTMLDivElement>(null);
  const bugsRef = useRef<BugState[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, t: 0 });
  const killsRef = useRef(0);
  const statCooldown = useRef(0);
  const hideCooldown = useRef(0);
  const activeRef = useRef(true);

  const [bugIds, setBugIds] = useState<number[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [splats, setSplats] = useState<Splat[]>([]);

  const addReport = useCallback((x: number, y: number, title: string, text: string) => {
    const area = areaRef.current;
    const w = area ? area.getBoundingClientRect().width : 600;
    const report: Report = {
      id: nextNoteId++,
      x: Math.max(8, Math.min(x, w - 240)),
      y: Math.max(4, y),
      title,
      text,
    };
    setReports((r) => [...r, report]);
    window.setTimeout(
      () => setReports((r) => r.filter((v) => v.id !== report.id)),
      4200,
    );
  }, []);

  const spawn = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const { width, height } = area.getBoundingClientRect();
    const bug = makeBug(width, height, performance.now());
    bugsRef.current.push(bug);
    setBugIds((ids) => [...ids, bug.id]);
  }, []);

  // Rect of an element in area coordinates, or null when it is not
  // currently visible in the viewport — stunts only happen on screen.
  const visibleRectOf = useCallback((selector: string) => {
    const area = areaRef.current;
    const el = document.querySelector(selector);
    if (!area || !el) return null;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return null;
    const a = area.getBoundingClientRect();
    return { x: r.left - a.left, y: r.top - a.top, w: r.width, h: r.height };
  }, []);

  useEffect(() => {
    spawn();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Pause the whole simulation while the hero is off screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    if (areaRef.current) io.observe(areaRef.current);

    const onMouse = (e: MouseEvent) => {
      const area = areaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const dt = Math.max(now - mouse.current.t, 8) / 1000;
      mouse.current.vx = mouse.current.vx * 0.7 + ((x - mouse.current.x) / dt) * 0.3;
      mouse.current.vy = mouse.current.vy * 0.7 + ((y - mouse.current.y) / dt) * 0.3;
      mouse.current.x = x;
      mouse.current.y = y;
      mouse.current.t = now;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const breeder = window.setInterval(() => {
      if (activeRef.current && bugsRef.current.length > 0 && bugsRef.current.length < 5)
        spawn();
    }, 60000);

    // Shift+B: spawn up to the cap immediately
    const onSpawn = () => {
      if (bugsRef.current.length < 5) spawn();
    };
    window.addEventListener("qa-bug-spawn", onSpawn);

    // Konami: all bugs briefly spin (CSS class toggle)
    const onKonami = () => {
      for (const bug of bugsRef.current) {
        if (!bug.el) continue;
        bug.el.classList.add("konami-spin");
        setTimeout(() => bug.el?.classList.remove("konami-spin"), 900);
      }
    };
    window.addEventListener("qa-bug-konami", onKonami);

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!activeRef.current || document.hidden) return;
      const area = areaRef.current;
      if (!area) return;
      const { width: w, height: h } = area.getBoundingClientRect();
      const m = mouse.current;
      const stale = now - m.t > 120;

      for (const bug of bugsRef.current) {
        const dxm = bug.x - m.x;
        const dym = bug.y - m.y;
        const distM = Math.hypot(dxm, dym);
        const closing = stale ? 0 : (-(m.vx * dxm) - m.vy * dym) / Math.max(distM, 1);

        // Only a genuinely fast lunge scares them.
        const threatened = distM < 160 && closing > 380;
        if (threatened && bug.mode !== "stat") {
          if (bug.under || bug.mode === "hidden") bug.under = false; // pops out in front
          bug.mode = "flee";
          bug.modeUntil = now + 650 + Math.random() * 350;
          bug.lastBother = now;
          bug.pauseUntil = 0;
        }

        if (bug.mode === "flee") {
          bug.chaseMs += dt * 1000;
          const away = Math.atan2(dym, dxm) + (Math.random() - 0.5) * 0.4;
          bug.tx = Math.min(Math.max(bug.x + Math.cos(away) * 200, 12), w - 12);
          bug.ty = Math.min(Math.max(bug.y + Math.sin(away) * 200, 8), h - 8);
          bug.targetSpeed = 165; // brisk, but catchable
          if (now > bug.modeUntil) {
            const portrait = visibleRectOf("[data-bug-hide]");
            if (bug.chaseMs > 5000 && now > hideCooldown.current && portrait) {
              hideCooldown.current = now + 30000;
              bug.mode = "hide";
              // Aim for the nearest edge of the portrait, not its middle,
              // so it visibly slips underneath instead of vanishing.
              const cx = portrait.x + portrait.w / 2;
              const edgeX = bug.x < cx ? portrait.x + 6 : portrait.x + portrait.w - 6;
              bug.tx = edgeX;
              bug.ty = portrait.y + portrait.h * (0.3 + Math.random() * 0.4);
              bug.targetSpeed = 110;
              // File the report as it heads over, so there is time to read.
              addReport(
                portrait.x - 150,
                portrait.y + portrait.h + 10,
                "BUG-CHASE",
                "issue could not be reproduced",
              );
            } else {
              bug.mode = "roam";
              bug.chaseMs = Math.max(0, bug.chaseMs - 1500);
            }
          }
        } else if (bug.mode === "hide") {
          bug.targetSpeed = 90;
          if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 10) {
            const portrait = visibleRectOf("[data-bug-hide]");
            if (portrait) {
              // Now slide a little way under the portrait, slowly.
              bug.under = true;
              bug.mode = "hidden";
              bug.modeUntil = now + 3800 + Math.random() * 1500;
              bug.tx = portrait.x + portrait.w * (0.35 + Math.random() * 0.3);
              bug.ty = portrait.y + portrait.h / 2;
              bug.targetSpeed = 40;
            } else {
              bug.mode = "roam";
            }
          }
        } else if (bug.mode === "hidden") {
          if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 8) bug.targetSpeed = 0;
          if (now > bug.modeUntil) {
            bug.mode = "roam";
            bug.chaseMs = 0;
            bug.pauseUntil = 0;
            bug.tx = 12 + Math.random() * (w - 24);
            bug.ty = 8 + Math.random() * (h - 16);
          }
        } else if (bug.mode === "stat") {
          bug.under = false;
          bug.targetSpeed = 140;
          if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 10) {
            window.dispatchEvent(new CustomEvent("qa-bug-defect"));
            bug.mode = "roam";
            bug.pauseUntil = now + 500;
            bug.lastBother = now;
            bug.chaseMs = 0;
          }
        } else {
          // roam
          const idle = (now - bug.lastBother) / 1000;
          const uneasy = distM < 110;
          if (uneasy) bug.lastBother = now;

          if (now > bug.pauseUntil && Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 8) {
            const statRect = visibleRectOf("#defect-stat");
            if (!uneasy && Math.random() < 0.012 && now > statCooldown.current && statRect) {
              statCooldown.current = now + 90000;
              bug.mode = "stat";
              bug.tx = statRect.x + statRect.w / 2;
              bug.ty = statRect.y + statRect.h / 2;
              continue;
            }
            // New destination: prefer the text side, where a dark bug is
            // harder to spot; sometimes dive under the text layer.
            bug.pauseUntil = now + 400 + Math.random() * (idle > 12 ? 3200 : 1600);
            const textBias = Math.random() < 0.65;
            bug.tx = textBias
              ? 12 + Math.random() * (w * 0.55)
              : 12 + Math.random() * (w - 24);
            bug.ty = 8 + Math.random() * (h - 16);
            bug.under = textBias && Math.random() < 0.5;
          }
          if (uneasy && now > bug.pauseUntil) {
            if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 20) {
              const away = Math.atan2(dym, dxm) + (Math.random() - 0.5);
              bug.tx = Math.min(Math.max(bug.x + Math.cos(away) * 90, 12), w - 12);
              bug.ty = Math.min(Math.max(bug.y + Math.sin(away) * 90, 8), h - 8);
            }
            bug.targetSpeed = 55 + Math.random() * 20;
          } else {
            const base = idle > 12 ? 10 : 26;
            const breathe = 0.65 + 0.5 * Math.sin(now / 1400 + bug.phase * 3);
            bug.targetSpeed = now < bug.pauseUntil ? 0 : base * breathe + 4;
          }
          // Under a covering element it creeps, half speed.
          if (bug.under) bug.targetSpeed *= 0.5;
          bug.chaseMs = Math.max(0, bug.chaseMs - dt * 400);
        }

        // Physics: pivot in place for sharp turns, then walk forward.
        const want = Math.atan2(bug.ty - bug.y, bug.tx - bug.x);
        let turn = want - bug.heading;
        while (turn > Math.PI) turn -= Math.PI * 2;
        while (turn < -Math.PI) turn += Math.PI * 2;
        const sharpTurn = Math.abs(turn) > 1.0;
        const effectiveTarget = sharpTurn ? Math.min(bug.targetSpeed, 8) : bug.targetSpeed;
        bug.speed += (effectiveTarget - bug.speed) * Math.min(dt * 5, 1);
        const maxTurn = (bug.mode === "flee" ? 12 : sharpTurn ? 7 : 3.4) * dt;
        bug.heading += Math.max(-maxTurn, Math.min(maxTurn, turn));
        if (bug.speed > 0.5) {
          bug.x += Math.cos(bug.heading) * bug.speed * dt;
          bug.y += Math.sin(bug.heading) * bug.speed * dt;
          bug.x = Math.min(Math.max(bug.x, 6), w - 6);
          bug.y = Math.min(Math.max(bug.y, 4), h - 4);
        }

        if (bug.el) {
          bug.el.style.transform = `translate(${bug.x}px, ${bug.y}px)`;
          // Only truly hide behind the portrait during the explicit "hidden" mode.
          // Roaming bugs marked `under` are dimmed but stay in front so they stay clickable.
          bug.el.style.zIndex = bug.mode === "hidden" ? "1" : "30";
          bug.el.style.opacity = bug.mode === "hidden" ? "0.15" : bug.under ? "0.35" : "1";
        }
        if (bug.inner)
          bug.inner.style.transform = `rotate(${(bug.heading * 180) / Math.PI + 90}deg)`;
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(breeder);
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("qa-bug-spawn", onSpawn);
      window.removeEventListener("qa-bug-konami", onKonami);
    };
  }, [spawn, visibleRectOf, addReport]);

  const kill = (id: number) => {
    const bug = bugsRef.current.find((b) => b.id === id);
    if (!bug) return;
    bugsRef.current = bugsRef.current.filter((b) => b.id !== id);
    setBugIds((ids) => ids.filter((i) => i !== id));
    killsRef.current += 1;
    // The bug fades out in place...
    const ghost: Ghost = {
      id: bug.id,
      x: bug.x,
      y: bug.y,
      angle: (bug.heading * 180) / Math.PI + 90,
    };
    setGhosts((g) => [...g, ghost]);
    window.setTimeout(() => setGhosts((g) => g.filter((v) => v.id !== ghost.id)), 400);
    // Leave a persistent splat mark that fades over 5 s.
    const splat: Splat = { id: bug.id, x: bug.x, y: bug.y, r: 6 + Math.random() * 5 };
    setSplats((s) => [...s, splat]);
    window.setTimeout(() => setSplats((s) => s.filter((v) => v.id !== splat.id)), 5200);
    // ...and a tiny report gets filed.
    const msg = killMessages[Math.floor(Math.random() * killMessages.length)];
    addReport(bug.x + 18, bug.y - 10, `BUG-${killsRef.current}`, msg);
    if (bugsRef.current.length === 0) window.setTimeout(spawn, 4000);
  };

  const bugSvg = (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className="text-faint transition-colors hover:text-muted">
      <path d="M7 3.5L5.5 1.5M13 3.5l1.5-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M4.5 8L2 6.5M4.5 11H1.5M4.5 14L2 15.5M15.5 8L18 6.5M15.5 11h3M15.5 14l2.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="10" cy="11" rx="5.5" ry="7" fill="currentColor" opacity="0.85" />
      <circle cx="10" cy="4.5" r="2.2" fill="currentColor" />
      <path d="M10 5.5v12" stroke="var(--background)" strokeWidth="0.8" />
    </svg>
  );

  return (
    <div
      ref={areaRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none"
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
            {bugSvg}
          </span>
        </button>
      ))}

      {ghosts.map((g) => (
        <span
          key={`ghost-${g.id}`}
          className="bug-ghost absolute z-50 block"
          style={{ transform: `translate(${g.x - 8}px, ${g.y - 8}px) rotate(${g.angle}deg)` }}
        >
          {bugSvg}
        </span>
      ))}

      {splats.map((s) => (
        <svg
          key={`splat-${s.id}`}
          className="bug-splat absolute z-50"
          width={s.r * 4}
          height={s.r * 4}
          viewBox="-10 -10 20 20"
          style={{ left: s.x - s.r * 2, top: s.y - s.r * 2 }}
          aria-hidden="true"
        >
          {/* organic splat: central blob + small drops */}
          <ellipse cx="0" cy="0" rx="5.5" ry="4" fill="var(--faint)" opacity="0.7" />
          <circle cx="5" cy="-3" r="1.8" fill="var(--faint)" opacity="0.5" />
          <circle cx="-5.5" cy="1.5" r="1.4" fill="var(--faint)" opacity="0.45" />
          <circle cx="1" cy="5" r="1.2" fill="var(--faint)" opacity="0.4" />
          <circle cx="-2" cy="-5" r="1" fill="var(--faint)" opacity="0.35" />
          <circle cx="6.5" cy="2" r="0.9" fill="var(--faint)" opacity="0.3" />
        </svg>
      ))}

      {reports.map((r) => (
        <div
          key={r.id}
          className="bug-report absolute z-50 w-56 overflow-hidden rounded-sm border border-faint/60 bg-surface shadow-[3px_3px_0_rgba(0,0,0,0.45)]"
          style={{ left: 0, top: 0, transform: `translate(${r.x}px, ${r.y}px)` }}
        >
          <div className="flex items-center justify-between border-b border-line bg-background/80 px-2 py-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {r.title}
            </span>
            <span className="font-mono text-[11px] leading-none text-faint">×</span>
          </div>
          <p className="px-2 py-1.5 font-mono text-[11px] leading-relaxed text-muted">
            {r.text}
          </p>
        </div>
      ))}
    </div>
  );
}
