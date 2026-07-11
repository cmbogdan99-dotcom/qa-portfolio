"use client";

import { useEffect } from "react";

/** Opens all accordions before printing so the PDF export is complete,
 *  then restores their previous state. */
export function PrintExpand() {
  useEffect(() => {
    let touched: HTMLDetailsElement[] = [];
    const before = () => {
      touched = Array.from(
        document.querySelectorAll<HTMLDetailsElement>("details:not([open])"),
      );
      touched.forEach((d) => (d.open = true));
    };
    const after = () => {
      touched.forEach((d) => (d.open = false));
      touched = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return null;
}
