"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import type { GalleryItem } from "@/content/site";

interface Props {
  item: GalleryItem;
  img: string | null;
}

function DlcCard({ name, img }: { name: string; img: string | null }) {
  return (
    <div className="min-w-[140px] max-w-[160px] shrink-0 rounded-xl border border-line bg-surface shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
        {img ? (
          <Image src={img} alt={name} fill quality={80} sizes="160px" className="object-cover grayscale" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface to-background p-3">
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.15em] text-faint">{name}</p>
          </div>
        )}
      </div>
      <p className="px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-faint leading-snug">{name}</p>
    </div>
  );
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
      <article className="group rounded-2xl border border-line bg-surface transition duration-300 hover:z-20 hover:-translate-y-1 hover:border-faint hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)]">
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
                className="rounded-t-2xl object-contain grayscale transition-all duration-500 ease-out group-hover:[transform:translateZ(70px)] group-hover:[filter:grayscale(0)_drop-shadow(0_18px_28px_rgba(0,0,0,0.7))]"
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

        <div className="flex items-center justify-between gap-3 border-t border-line p-5">
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
                Visit ↗
              </a>
            )}
          </div>
        </div>
      </article>

      {/* DLC expansion tray */}
      {hasDlc && (
        <div
          className={`absolute left-0 right-0 z-40 mt-2 transition-all duration-200 ${
            open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-faint px-1">
            Expansions
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {item.dlc!.map((d) => (
              <DlcCard key={d.slug} name={d.name} img={null} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
