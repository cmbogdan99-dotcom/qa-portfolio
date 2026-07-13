"use client";

import { useEffect, useRef } from "react";

export function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const W = 250, H = 250;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = ctx.createImageData(W, H);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);

    if (ref.current) {
      ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundRepeat: "repeat",
        backgroundSize: "250px 250px",
        opacity: 0.038,
        pointerEvents: "none",
        zIndex: 9000,
        mixBlendMode: "screen",
      }}
    />
  );
}
