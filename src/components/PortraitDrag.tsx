"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { links } from "@/content/site";

const MAX_DRAG = 76; // px — how far left the portrait can slide

export function PortraitDrag({ src, alt }: { src: string; alt: string }) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const startCx = useRef(0);
  const startOff = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bugSpawned = useRef(false);

  const revealed = offsetX > 24;

  const begin = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    setIsDragging(true);
    startCx.current = e.clientX;
    startOff.current = offsetX;
    if (timer.current) clearTimeout(timer.current);
    if (!bugSpawned.current) {
      bugSpawned.current = true;
      window.dispatchEvent(new CustomEvent("qa-bug-spawn"));
    }
  };

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const delta = startOff.current + (startCx.current - e.clientX);
    setOffsetX(Math.max(0, Math.min(MAX_DRAG, delta)));
  };

  const release = () => {
    if (!dragging.current) return;
    dragging.current = false;
    // isDragging→false enables the spring transition for this render
    setIsDragging(false);
    // Give 2s to click the CV button, then spring back
    timer.current = setTimeout(() => setOffsetX(0), 2000);
  };

  return (
    <div className="relative z-10 hidden md:block" data-bug-hide>
      {/* CV button — lives at the right edge, revealed as portrait slides left */}
      <a
        href={links.cv}
        download="bogdan-carcadea-cv.pdf"
        tabIndex={revealed ? 0 : -1}
        aria-hidden={!revealed}
        onClick={() => { if (timer.current) clearTimeout(timer.current); }}
        className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-surface/80 py-4 transition-opacity duration-200"
        style={{
          width: MAX_DRAG - 6,
          zIndex: 0,
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? "auto" : "none",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-muted">
          <path d="M10 3v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6.5 9L10 13l3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">CV</span>
      </a>

      {/* Portrait — draggable, slides left to reveal CV button */}
      <div
        className="relative w-fit shrink-0 cursor-grab rounded-full bg-background p-1.5 ring-1 ring-line active:cursor-grabbing"
        style={{
          transform: `translateX(-${offsetX}px)`,
          // No transition while dragging; spring-back when released
          transition: isDragging ? "none" : "transform 1.5s cubic-bezier(0.34, 1.4, 0.64, 1)",
          zIndex: 1,
          userSelect: "none",
          touchAction: "none",
        }}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={release}
        onPointerCancel={release}
      >
        <Image
          src={src}
          alt={alt}
          width={568}
          height={621}
          priority
          draggable={false}
          className="h-48 w-48 rounded-full object-cover object-top grayscale md:h-64 md:w-64"
        />
      </div>
    </div>
  );
}
