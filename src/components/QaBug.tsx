"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Beetles that live in the hero. Per-frame simulation with a small state
 * machine per bug:
 *
 * - roam:     ambles with a breathing speed rhythm, prefers hanging around
 *             the text (sometimes UNDER it, via z-index), pauses when idle.
 * - flee:     genuine panic when the cursor rushes at it; fear lingers
 *             after the threat stops. Approach slowly to catch one.
 * - hide:     chased too long without being caught? It slips under the
 *             portrait and the note reads "could not be reproduced".
 * - playdead: very rarely plays dead... then "issue is still present".
 * - stat:     very rarely sprints to the defects counter and adds one.
 *
 * They multiply every minute, up to five. Clicking one closes it with a
 * quiet expanding ring. Counter starts at #1 and resets on refresh.
 */

type Mode = "roam" | "flee" | "hide" | "hidden" | "playdead" | "stat";

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

type Note = { id: number; x: number; y: number; text: string; ring: boolean };

let nextId = 1;
let nextNoteId = 1;

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

  const [bugIds, setBugIds] = useState<number[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = useCallback((x: number, y: number, text: string, ring = false) => {
    const note: Note = { id: nextNoteId++, x, y, text, ring };
    setNotes((n) => [...n, note]);
    window.setTimeout(() => setNotes((n) => n.filter((v) => v.id !== note.id)), 2600);
  }, []);

  const spawn = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const { width, height } = area.getBoundingClientRect();
    const bug = makeBug(width, height, performance.now());
    bugsRef.current.push(bug);
    setBugIds((ids) => [...ids, bug.id]);
  }, []);

  // Rect of an element, in area coordinates. Used for the portrait
  // hiding spot and the defects counter.
  const rectOf = useCallback((selector: string) => {
    const area = areaRef.current;
    const el = document.querySelector(selector);
    if (!area || !el) return null;
    const a = area.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - a.left, y: r.top - a.top, w: r.width, h: r.height };
  }, []);

  useEffect(() => {
    spawn();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      if (bugsRef.current.length > 0 && bugsRef.current.length < 5) spawn();
    }, 60000);

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
      const stale = now - m.t > 120;

      for (const bug of bugsRef.current) {
        const dxm = bug.x - m.x;
        const dym = bug.y - m.y;
        const distM = Math.hypot(dxm, dym);
        const closing = stale ? 0 : (-(m.vx * dxm) - m.vy * dym) / Math.max(distM, 1);

        // A cursor rushing in causes real panic.
        const threatened = distM < 200 && closing > 260;
        if (threatened && bug.mode !== "hidden" && bug.mode !== "stat") {
          bug.mode = "flee";
          bug.modeUntil = now + 1100 + Math.random() * 700; // fear lingers
          bug.lastBother = now;
          bug.pauseUntil = 0;
        }

        if (bug.mode === "flee") {
          bug.chaseMs += dt * 1000;
          // Keep re-aiming directly away from the cursor while afraid.
          const away = Math.atan2(dym, dxm) + (Math.random() - 0.5) * 0.4;
          bug.tx = Math.min(Math.max(bug.x + Math.cos(away) * 240, 12), w - 12);
          bug.ty = Math.min(Math.max(bug.y + Math.sin(away) * 240, 8), h - 8);
          bug.targetSpeed = 300;
          bug.under = false;
          if (now > bug.modeUntil) {
            // Chased for ages and never caught? Slip under the portrait.
            const portrait = rectOf("[data-bug-hide]");
            if (bug.chaseMs > 4500 && now > hideCooldown.current && portrait) {
              hideCooldown.current = now + 25000;
              bug.mode = "hide";
              bug.tx = portrait.x + portrait.w / 2;
              bug.ty = portrait.y + portrait.h / 2;
              bug.targetSpeed = 260;
            } else {
              bug.mode = "roam";
              bug.chaseMs = Math.max(0, bug.chaseMs - 1500);
            }
          }
        } else if (bug.mode === "hide") {
          if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 10) {
            bug.mode = "hidden";
            bug.modeUntil = now + 3200 + Math.random() * 1500;
            bug.under = true;
            bug.targetSpeed = 0;
            const portrait = rectOf("[data-bug-hide]");
            if (portrait) {
              addNote(
                Math.max(8, Math.min(portrait.x, w - 230)),
                portrait.y + portrait.h + 8,
                "issue could not be reproduced",
              );
            }
          }
        } else if (bug.mode === "hidden") {
          bug.targetSpeed = 0;
          if (now > bug.modeUntil) {
            bug.mode = "roam";
            bug.chaseMs = 0;
            bug.pauseUntil = 0;
            bug.tx = 12 + Math.random() * (w - 24);
            bug.ty = 8 + Math.random() * (h - 16);
          }
        } else if (bug.mode === "playdead") {
          bug.targetSpeed = 0;
          if (bug.inner)
            bug.inner.style.transform = `rotate(${(bug.heading * 180) / Math.PI + 90}deg) scaleY(-0.9)`;
          if (now > bug.modeUntil) {
            bug.mode = "roam";
            addNote(
              Math.max(8, Math.min(bug.x + 20, w - 260)),
              bug.y,
              "issue is still present · reopening",
            );
            if (bug.inner)
              bug.inner.style.transform = `rotate(${(bug.heading * 180) / Math.PI + 90}deg)`;
          }
        } else if (bug.mode === "stat") {
          bug.under = false;
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
            // Rare stunts, only when the cursor is far away.
            const roll = Math.random();
            const statRect = rectOf("#defect-stat");
            if (!uneasy && roll < 0.012 && now > statCooldown.current && statRect) {
              statCooldown.current = now + 90000;
              bug.mode = "stat";
              bug.tx = statRect.x + statRect.w / 2;
              bug.ty = statRect.y + statRect.h / 2;
              bug.targetSpeed = 150;
              continue;
            }
            if (!uneasy && roll < 0.035) {
              bug.mode = "playdead";
              bug.modeUntil = now + 2400 + Math.random() * 1800;
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
            // Drifts away from a slowly approaching cursor.
            if (Math.hypot(bug.tx - bug.x, bug.ty - bug.y) < 20) {
              const away = Math.atan2(dym, dxm) + (Math.random() - 0.5);
              bug.tx = Math.min(Math.max(bug.x + Math.cos(away) * 90, 12), w - 12);
              bug.ty = Math.min(Math.max(bug.y + Math.sin(away) * 90, 8), h - 8);
            }
            bug.targetSpeed = 60 + Math.random() * 25;
          } else {
            const base = idle > 12 ? 10 : 26;
            const breathe = 0.65 + 0.5 * Math.sin(now / 1400 + bug.phase * 3);
            bug.targetSpeed = now < bug.pauseUntil ? 0 : base * breathe + 4;
          }
          bug.chaseMs = Math.max(0, bug.chaseMs - dt * 400);
        }

        // Physics: accelerate, turn gradually, walk forward only.
        bug.speed += (bug.targetSpeed - bug.speed) * Math.min(dt * 4, 1);
        if (bug.speed > 1) {
          const want = Math.atan2(bug.ty - bug.y, bug.tx - bug.x);
          let turn = want - bug.heading;
          while (turn > Math.PI) turn -= Math.PI * 2;
          while (turn < -Math.PI) turn += Math.PI * 2;
          const maxTurn = (bug.mode === "flee" ? 10 : 3.4) * dt;
          bug.heading += Math.max(-maxTurn, Math.min(maxTurn, turn));
          bug.x += Math.cos(bug.heading) * bug.speed * dt;
          bug.y += Math.sin(bug.heading) * bug.speed * dt;
          bug.x = Math.min(Math.max(bug.x, 6), w - 6);
          bug.y = Math.min(Math.max(bug.y, 4), h - 4);
        }

        if (bug.el) {
          bug.el.style.transform = `translate(${bug.x}px, ${bug.y}px)`;
          bug.el.style.zIndex = bug.under ? "1" : "20";
        }
        if (bug.inner && bug.mode !== "playdead")
          bug.inner.style.transform = `rotate(${(bug.heading * 180) / Math.PI + 90}deg)`;
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(breeder);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [spawn, rectOf, addNote]);

  const kill = (id: number) => {
    const bug = bugsRef.current.find((b) => b.id === id);
    if (!bug) return;
    bugsRef.current = bugsRef.current.filter((b) => b.id !== id);
    setBugIds((ids) => ids.filter((i) => i !== id));
    killsRef.current += 1;
    addNote(bug.x + 16, bug.y - 6, `bug #${killsRef.current} · closed`, true);
    if (bugsRef.current.length === 0) window.setTimeout(spawn, 4000);
  };

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
            className="block transition-transform duration-300"
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

      {notes.map((n) => (
        <div
          key={n.id}
          className="absolute z-30"
          style={{ left: 0, top: 0, transform: `translate(${n.x}px, ${n.y}px)` }}
        >
          {n.ring && (
            <span className="bug-ring absolute -left-7 top-0 block h-5 w-5 rounded-full border border-faint" />
          )}
          <p className="splat-label whitespace-nowrap rounded bg-background/85 px-1.5 py-0.5 font-mono text-[12px] text-faint">
            {n.text}
          </p>
        </div>
      ))}
    </div>
  );
}
