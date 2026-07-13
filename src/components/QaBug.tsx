"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  pauseStart: number;
  chaseMs: number;
  lastBother: number;
  phase: number;
  entering: boolean;
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

function makeBug(w: number, h: number, now: number, sx: number, sy: number): BugState {
  return {
    id: nextId++,
    x: sx,
    y: sy,
    heading: Math.random() * Math.PI * 2,
    speed: 0,
    targetSpeed: 70,
    // First target: left 60% of area, avoiding edges
    tx: 24 + Math.random() * Math.max(w * 0.58 - 48, 20),
    ty: 20 + Math.random() * Math.max(h - 40, 20),
    mode: "roam",
    modeUntil: 0,
    pauseUntil: 0,
    pauseStart: 0,
    chaseMs: 0,
    lastBother: now,
    phase: Math.random() * 10,
    entering: true,
    el: null,
    inner: null,
  };
}

const DUPLICATE_CAP = 14;

const duplicateMessages = [
  "duplicate — already filed",
  "cannot reproduce",
  "status: by design",
  "marked as WONTFIX",
  "closed as out of scope",
  "transferred to backlog",
  "awaiting further info",
];

export function QaBug({ duplicateOnKill = false }: { duplicateOnKill?: boolean }) {
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

  const dismissReport = useCallback((id: number) => {
    setReports((r) => r.filter((v) => v.id !== id));
  }, []);

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

  const visibleRectOf = useCallback((selector: string) => {
    const area = areaRef.current;
    const el = document.querySelector(selector);
    if (!area || !el) return null;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return null;
    const a = area.getBoundingClientRect();
    return { x: r.left - a.left, y: r.top - a.top, w: r.width, h: r.height };
  }, []);

  const spawn = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const { width: w, height: h } = area.getBoundingClientRect();

    // All bugs enter from outside the container boundary so overflow:hidden
    // keeps them invisible until they cross in — no jarring pop-in.
    let sx: number, sy: number;
    const portrait = visibleRectOf("[data-bug-hide]");

    if (portrait && Math.random() < 0.45) {
      sx = w + 20;
      sy = portrait.y + portrait.h * (0.1 + Math.random() * 0.8);
    } else {
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { sx = -20; sy = Math.random() * h; }
      else if (edge === 1) { sx = w + 20; sy = Math.random() * h; }
      else if (edge === 2) { sx = Math.random() * w; sy = -20; }
      else { sx = Math.random() * w; sy = h + 20; }
    }

    const bug = makeBug(w, h, performance.now(), sx, sy);
    bugsRef.current.push(bug);
    setBugIds((ids) => [...ids, bug.id]);
  }, [visibleRectOf]);

  // First bug: spawns inside portrait bounds, crawls out when startled by drag.
  // Invisible while inside portrait rect (opacity 0, z 1) — see step loop.
  const spawnFromPortrait = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const { width: w, height: h } = area.getBoundingClientRect();
    // Use the moving element's visual rect (accounts for CSS transform)
    const portrait = visibleRectOf("[data-portrait-moving]");
    if (!portrait) { spawn(); return; }
    const now = performance.now();
    // Start near right-center of the moving image — hidden until portrait slides left past this point
    const sx = portrait.x + portrait.w * 0.65;
    const sy = portrait.y + portrait.h * 0.55;
    const bug = makeBug(w, h, now, sx, sy);
    bug.entering = false;
    bug.x = sx;
    bug.y = sy;
    bug.speed = 6;
    bug.targetSpeed = 45;
    bug.tx = Math.max(12, portrait.x - 30 - Math.random() * 50);
    bug.ty = portrait.y + portrait.h * (0.3 + Math.random() * 0.4);
    bugsRef.current.push(bug);
    setBugIds((ids) => [...ids, bug.id]);
  }, [visibleRectOf, spawn]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // First bug spawns on portrait drag (see PortraitDrag.tsx); this is a
    // fallback for users who never interact with the portrait.
    const firstSpawn = window.setTimeout(spawn, 90000);

    const io = new IntersectionObserver(
      ([entry]) => { activeRef.current = entry.isIntersecting; },
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
      if (activeRef.current && bugsRef.current.length > 0 && bugsRef.current.length < 3)
        spawn();
    }, 60000);

    const onSpawn = () => { if (bugsRef.current.length < 3) spawn(); };
    window.addEventListener("qa-bug-spawn", onSpawn);
    const onPortraitSpawn = () => { if (bugsRef.current.length < 3) spawnFromPortrait(); };
    window.addEventListener("qa-bug-spawn-portrait", onPortraitSpawn);

    const onKonami = () => {
      for (const bug of bugsRef.current) {
        if (!bug.el) continue;
        bug.el.style.filter = "brightness(2) drop-shadow(0 0 8px rgba(236,238,242,0.8))";
        setTimeout(() => { if (bug.el) bug.el.style.filter = ""; }, 900);
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

        // Computed before mode logic so it's in scope for both the mode block and bug.el render
        const sleepingNow =
          !bug.entering &&
          bug.mode === "roam" &&
          bug.speed < 1 &&
          now < bug.pauseUntil &&
          now - bug.pauseStart > 1500;

        if (bug.entering) {
          bug.targetSpeed = 70;
          if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 14) {
            bug.entering = false;
            bug.targetSpeed = 20;
          }
        } else {

          const threatened =
            !stale &&
            distM < 130 &&
            (closing > (sleepingNow ? 420 : 260) || (!sleepingNow && distM < 55));
          if (threatened && bug.mode !== "stat") {
            bug.mode = "flee";
            bug.modeUntil = now + 650 + Math.random() * 350;
            bug.lastBother = now;
            bug.pauseUntil = 0;
          }

          if (bug.mode === "flee") {
            bug.chaseMs += dt * 1000;
            const baseAngle = Math.atan2(dym, dxm);
            const bias = (bug.id % 7 - 3) * 0.22;
            const away = baseAngle + bias + (Math.random() - 0.5) * 0.25;
            bug.tx = Math.min(Math.max(bug.x + Math.cos(away) * 220, 12), w - 12);
            bug.ty = Math.min(Math.max(bug.y + Math.sin(away) * 220, 8), h - 8);
            bug.targetSpeed = 120;
            if (now > bug.modeUntil) {
              const portrait = visibleRectOf("[data-bug-hide]");
              if (bug.chaseMs > 5000 && now > hideCooldown.current && portrait) {
                hideCooldown.current = now + 30000;
                bug.mode = "hide";
                const cx = portrait.x + portrait.w / 2;
                const edgeX = bug.x < cx ? portrait.x + 6 : portrait.x + portrait.w - 6;
                bug.tx = edgeX;
                bug.ty = portrait.y + portrait.h * (0.3 + Math.random() * 0.4);
                bug.targetSpeed = 110;
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
                bug.mode = "hidden";
                bug.modeUntil = now + 3800 + Math.random() * 1500;
                bug.tx = portrait.x + portrait.w * (0.35 + Math.random() * 0.3);
                bug.ty = portrait.y + portrait.h / 2;
                bug.targetSpeed = 40;
                addReport(
                  portrait.x - 150,
                  portrait.y + portrait.h + 10,
                  "BUG-HIDDEN",
                  "issue could not be reproduced",
                );
              } else {
                bug.mode = "roam";
              }
            }
          } else if (bug.mode === "hidden") {
            if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 8) bug.targetSpeed = 0;
            const portrait = visibleRectOf("[data-bug-hide]");
            if (now > bug.modeUntil || !portrait) {
              bug.mode = "roam";
              bug.chaseMs = 0;
              bug.pauseUntil = 0;
              bug.tx = 12 + Math.random() * (w - 24);
              bug.ty = 8 + Math.random() * (h - 16);
            }
          } else if (bug.mode === "stat") {
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
            // Sleeping bugs ignore slow cursor — only fast approach counts as bother
            const uneasy = distM < 110 && (!sleepingNow || closing > 200);
            if (uneasy) bug.lastBother = now;

            if (now > bug.pauseUntil && Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 8) {
              const statRect = visibleRectOf("#defect-stat");
              if (!uneasy && Math.random() < 0.012 && now > statCooldown.current && statRect) {
                statCooldown.current = now + 90000;
                bug.mode = "stat";
                bug.tx = statRect.x + statRect.w / 2;
                bug.ty = statRect.y + statRect.h / 2;
                window.dispatchEvent(new CustomEvent("qa-bug-hunting"));
                continue;
              }
              const cursorActive = now - m.t < 3000;
              // Longer pauses when cursor is idle so bugs feel settled, not jittery
              const maxPause = cursorActive ? 1400 : (idle > 12 ? 5200 : 3200);
              bug.pauseStart = now;
              bug.pauseUntil = now + 700 + Math.random() * maxPause;
              // When cursor is active: bugs prefer text zone (hiding). When idle: roam open areas.
              const goText = Math.random() < (cursorActive ? 0.78 : 0.22);
              if (goText) {
                bug.tx = 12 + Math.random() * (w * 0.55);
                bug.ty = 8 + Math.random() * (h - 16);
              } else {
                // Open/background zone: right portion or bottom area
                if (Math.random() < 0.6) {
                  bug.tx = w * 0.58 + Math.random() * (w * 0.37);
                  bug.ty = 8 + Math.random() * (h - 16);
                } else {
                  bug.tx = 12 + Math.random() * (w - 24);
                  bug.ty = h * 0.6 + Math.random() * (h * 0.35);
                }
              }
            }
            if (uneasy && now > bug.pauseUntil) {
              if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 20) {
                const bias = (bug.id % 7 - 3) * 0.22;
                const away = Math.atan2(dym, dxm) + bias + (Math.random() - 0.5) * 0.3;
                bug.tx = Math.min(Math.max(bug.x + Math.cos(away) * 95, 12), w - 12);
                bug.ty = Math.min(Math.max(bug.y + Math.sin(away) * 95, 8), h - 8);
              }
              bug.targetSpeed = 55 + Math.random() * 20;
            } else {
              const base = idle > 12 ? 10 : 26;
              const breathe = 0.65 + 0.5 * Math.sin(now / 1400 + bug.phase * 3);
              bug.targetSpeed = now < bug.pauseUntil ? 0 : base * breathe + 4;
            }
            bug.chaseMs = Math.max(0, bug.chaseMs - dt * 400);
          }
        }

        // Physics
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
          if (!bug.entering) {
            bug.x = Math.min(Math.max(bug.x, 6), w - 6);
            bug.y = Math.min(Math.max(bug.y, 4), h - 4);
          }
        }

        if (bug.el) {
          bug.el.style.transform = `translate(${bug.x}px, ${bug.y}px)`;

          // While inside the MOVING portrait image rect the bug is invisible —
          // getBoundingClientRect on [data-portrait-moving] returns the visual
          // (post-transform) position, so this stays accurate as user drags.
          const pr = visibleRectOf("[data-portrait-moving]");
          const underPortrait = !!pr &&
            bug.x > pr.x + 8 && bug.x < pr.x + pr.w - 8 &&
            bug.y > pr.y + 8 && bug.y < pr.y + pr.h - 8;

          if (bug.mode === "hidden") {
            bug.el.style.zIndex = "1";
            bug.el.style.opacity = "0.15";
          } else if (underPortrait) {
            bug.el.style.zIndex = "1";
            bug.el.style.opacity = "0";
          } else {
            bug.el.style.zIndex = "30";
            bug.el.style.opacity = "1";
          }
          if (bug.mode === "stat") bug.el.classList.add("bug-seeking");
          else bug.el.classList.remove("bug-seeking");

          if (sleepingNow && !bug.entering) {
            bug.el.classList.add("bug-sleeping");
          } else if (!sleepingNow || bug.entering) {
            bug.el.classList.remove("bug-sleeping");
          }
        }
        if (bug.inner)
          bug.inner.style.transform = `rotate(${(bug.heading * 180) / Math.PI + 90}deg)`;
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(breeder);
      clearTimeout(firstSpawn);
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("qa-bug-spawn", onSpawn);
      window.removeEventListener("qa-bug-spawn-portrait", onPortraitSpawn);
      window.removeEventListener("qa-bug-konami", onKonami);
    };
  }, [spawn, spawnFromPortrait, visibleRectOf, addReport]);

  const kill = (id: number) => {
    const bug = bugsRef.current.find((b) => b.id === id);
    if (!bug) return;

    const area = areaRef.current;
    const { width: w, height: h } = area?.getBoundingClientRect() ?? { width: 600, height: 400 };

    if (duplicateOnKill) {
      // 404 mode: bugs can't die — they duplicate instead
      const msg = duplicateMessages[Math.floor(Math.random() * duplicateMessages.length)];
      addReport(Math.min(bug.x + 16, w * 0.7), Math.max(20, bug.y - 60), `BUG-${id}`, msg);
      if (bugsRef.current.length < DUPLICATE_CAP) {
        // Spawn a sibling near the clicked bug
        const offset = 30 + Math.random() * 40;
        const angle = Math.random() * Math.PI * 2;
        const sx = Math.max(20, Math.min(w - 20, bug.x + Math.cos(angle) * offset));
        const sy = Math.max(20, Math.min(h - 20, bug.y + Math.sin(angle) * offset));
        const newBug = makeBug(w, h, performance.now(), sx, sy);
        newBug.entering = false;
        newBug.x = sx;
        newBug.y = sy;
        bugsRef.current.push(newBug);
        setBugIds((ids) => [...ids, newBug.id]);
      }
      return;
    }

    bugsRef.current = bugsRef.current.filter((b) => b.id !== id);
    setBugIds((ids) => ids.filter((i) => i !== id));
    killsRef.current += 1;

    const ghost: Ghost = { id: bug.id, x: bug.x, y: bug.y, angle: (bug.heading * 180) / Math.PI + 90 };
    setGhosts((g) => [...g, ghost]);
    window.setTimeout(() => setGhosts((g) => g.filter((v) => v.id !== ghost.id)), 400);

    const splat: Splat = { id: bug.id, x: bug.x, y: bug.y, r: 6 + Math.random() * 5 };
    setSplats((s) => [...s, splat]);
    window.setTimeout(() => setSplats((s) => s.filter((v) => v.id !== splat.id)), 5200);

    // Clamp report above the splat and within left half
    const reportX = Math.min(bug.x + 16, w * 0.50);
    const reportY = Math.max(80, Math.min(bug.y - 90, h * 0.70));
    const msg = killMessages[Math.floor(Math.random() * killMessages.length)];
    addReport(reportX, reportY, `BUG-${killsRef.current}`, msg);

    if (bugsRef.current.length === 0) window.setTimeout(spawn, 10000);
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
    // overflow-hidden clips bugs that are still outside the hero boundary,
    // so they only become visible once they've crawled inside.
    <div
      ref={areaRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
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
          {/* zzz shown when bug is sleeping — positioned above the icon */}
          <span className="bug-zzz" aria-hidden="true">z</span>
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
          className="bug-splat absolute z-40"
          width={s.r * 4}
          height={s.r * 4}
          viewBox="-10 -10 20 20"
          style={{ left: s.x - s.r * 2, top: s.y - s.r * 2 }}
          aria-hidden="true"
        >
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
            <button
              type="button"
              onClick={() => dismissReport(r.id)}
              className="pointer-events-auto font-mono text-[11px] leading-none text-faint hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >×</button>
          </div>
          <p className="px-2 py-1.5 font-mono text-[11px] leading-relaxed text-muted">
            {r.text}
          </p>
        </div>
      ))}
    </div>
  );
}
