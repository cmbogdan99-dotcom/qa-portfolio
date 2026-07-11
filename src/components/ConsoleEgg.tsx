"use client";

import { useEffect } from "react";

export function ConsoleEgg() {
  useEffect(() => {
    const s = (css: string) => `color:${css};font-family:monospace`;
    console.log(
      "%c\n  BUG-0001 · Severity: P0 · Status: Won't Fix\n",
      s("#9aa1ad"),
    );
    console.log(
      "%c  You opened DevTools. That's either curiosity or a problem.\n  Either way: welcome to the test environment.\n",
      s("#697180"),
    );
    console.log(
      "%c  Steps to reproduce:\n  1. Open a QA Engineer's portfolio\n  2. Immediately open DevTools\n  3. Find this message\n",
      s("#697180"),
    );
    console.log(
      "%c  Expected: nothing to see here.\n  Actual:   you found the Easter egg.\n",
      s("#eceef2"),
    );
    console.log(
      "%c  Resolution: by design.  —  Bogdan Carcadea · bogdan.carcadea@gmail.com\n",
      s("#697180"),
    );
  }, []);

  return null;
}
