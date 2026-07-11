"use client";

import { useEffect, useState } from "react";

/**
 * The "defects reported" stat. Very rarely a hero bug walks over and adds
 * one to the count. Session-only: resets on refresh.
 */
export function DefectCounter() {
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    const onDefect = () => setExtra((e) => e + 1);
    window.addEventListener("qa-bug-defect", onDefect);
    return () => window.removeEventListener("qa-bug-defect", onDefect);
  }, []);

  return (
    <span key={extra} className={extra > 0 ? "stat-pop inline-block" : undefined}>
      {(10000 + extra).toLocaleString("en-US")}+
    </span>
  );
}
