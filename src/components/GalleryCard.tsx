"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import type { GalleryItem } from "@/content/site";

interface Props {
  item: GalleryItem;
  img: string | null;
}

export function GalleryCard({ item, img }: Props) {
  const [open, setOpen] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasDlc = item.dlc && item.dlc.length > 0;

  const startPress = useCallback(() => {
    if (!hasDlc) return;
    pressTimer.current = setTimeout(() => setOpen(true), 500);
  }, [hasDlc]);

  const cancelPress = useCallback(() => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => hasDlc && setOpen(true)}
      onMouseLeave={() => { hasDlc && setOpen(false); cancelPress(); }}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
    >
      {/* DLC tooltip: floats ABOVE the card so it never overlaps the row below */}
      {hasDlc && (
        <div
          aria-hidden="true"
          className={`absolute bottom-full left-0 z-50 mb-2 min-w-[180px] max-w-full rounded-xl border border-line bg-surface/95 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-150 ${
            open ? "pointer-events-none translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
          }`}
        >
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-faint">
            Expansions
          </p>
          <ul className="space-y-1.5">
            {item.dlc!.map((d) => (
              <li key={d.slug} className="flex items-center gap-2">
                <span className="h-px w-3 shrink-0 bg-faint/50" />
                <span className="text-[13px] text-muted">{d.name}</span>
              </li>
            ))}
          </ul>
          {/* downward arrow */}
          <div className="absolute -bottom-[5px] left-5 h-[9px] w-[9px] rotate-45 border-b border-r border-line bg-surface/95" />
        </div>
      )}

      <article className="group rounded-2xl border border-line bg-surface transition duration-300 hover:z-20 hover:-translate-y-1 hover:border-faint hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.5)]">
        <div className="relative aspect-[16/9] [perspective:700px]">
          {img ? (
            <>
              <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
                <Image
                  src={img}
                  alt=""
                  aria-hidden="true"
                  fill
                  quality={25}
                  sizes="400px"
                  className="scale-110 object-cover blur-xl brightness-50 grayscale transition duration-500 group-hover:grayscale-0"
                />
              </div>
              <Image
                src={img}
                alt={item.name}
                fill
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="rounded-t-2xl object-contain grayscale transition-all duration-500 ease-out group-hover:[transform:translateZ(70px)] group-hover:[filter:grayscale(0)_drop-shadow(0_8px_14px_rgba(0,0,0,0.45))]"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-surface to-background p-6 transition duration-500 group-hover:scale-105">
              <p className="text-center font-mono text-sm uppercase tracking-[0.2em] text-faint transition-colors duration-300 group-hover:text-muted">
                {item.name}
              </p>
            </div>
          )}
        </div>

        <div className="flex min-h-[72px] items-center justify-between gap-3 border-t border-line p-5">
          <div>
            <h3 className="text-[15px] font-medium tracking-tight text-foreground">
              {item.name}
            </h3>
            <p className="mt-1 text-[13px] text-faint">{item.detail}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {hasDlc && (
              <span className="rounded-md border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-faint">
                +DLC
              </span>
            )}
            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-line px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-faint hover:text-foreground"
              >
                {item.hrefLabel ?? "Visit"} ↗
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
