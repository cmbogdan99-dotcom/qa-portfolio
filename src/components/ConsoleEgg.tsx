"use client";

import { useEffect } from "react";

export function ConsoleEgg() {
  useEffect(() => {
    const dim   = "color:#4a5362;font-family:monospace;font-size:12px";
    const mid   = "color:#697180;font-family:monospace;font-size:12px";
    const light = "color:#9aa1ad;font-family:monospace;font-size:12px";
    const white = "color:#eceef2;font-family:monospace;font-size:12px";
    const green = "color:#22c55e;font-family:monospace;font-size:12px";
    const red   = "color:#ef4444;font-family:monospace;font-size:12px";
    const rule  = "color:#242933;font-family:monospace;font-size:12px";

    console.log("%c─────────────────────────────────────────────────────", rule);
    console.log("%c  BUG-0001  ·  Severity: P0  ·  Status: WON'T FIX", white);
    console.log("%c─────────────────────────────────────────────────────", rule);
    console.log("");
    console.log("%c  Title      %cCurious developer opens DevTools", mid, light);
    console.log("%c  Reporter   %cBogdan Carcadea — Senior QA Engineer", mid, light);
    console.log("%c  Severity   %cP0 — Critical", mid, red);
    console.log("%c  Status     %c✓  RESOLVED — By Design", mid, green);
    console.log("");
    console.log("%c  STEPS TO REPRODUCE", mid);
    console.log("%c  1. Open a QA engineer's portfolio", dim);
    console.log("%c  2. Press F12 immediately", dim);
    console.log("%c  3. Read this message", dim);
    console.log("");
    console.log("%c  EXPECTED   %cNothing to see here", mid, dim);
    console.log("%c  ACTUAL     %cEaster egg discovered", mid, light);
    console.log("");
    console.log("%c  NOTES      If you're reading this, you're probably a developer.", mid);
    console.log("%c             That means we're colleagues. Say hi.", dim);
    console.log("");
    console.log("%c  ↳  bogdan.carcadea@gmail.com", light);
    console.log("%c     bogdan-carcadea.ro", dim);
    console.log("");
    console.log("%c  OTHER SECRETS", mid);
    console.log("%c  · Triple-click the name in the hero", dim);
    console.log("%c  · Shift+B to spawn a bug", dim);
    console.log("%c  · ↑↑↓↓←→←→BA for something else", dim);
    console.log("");
    console.log("%c─────────────────────────────────────────────────────", rule);
  }, []);

  return null;
}
