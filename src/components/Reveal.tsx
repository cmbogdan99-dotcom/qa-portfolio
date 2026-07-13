"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** "zoom" adds a slight scale-up on entry, used in the project gallery. */
  variant?: "fade" | "zoom";
  /** Stagger delay in ms, applied to the entry transition only. */
  delay?: number;
};

/**
 * Progressive-enhancement scroll reveal. Elements animate every time they
 * enter the viewport, not just once. The `reveal` class only hides content
 * under `prefers-reduced-motion: no-preference` (see globals.css), so no-JS
 * and reduced-motion users always see everything.
 */
export function Reveal({ children, variant = "fade", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger only the entrance, so exits are instant and clean.
          el.style.transitionDelay = delay ? `${delay}ms` : "";
          el.classList.add("is-visible");
        } else {
          el.style.transitionDelay = "";
          el.classList.remove("is-visible");
        }
      },
      // Slightly negative bottom margin so elements are revealed a touch
      // after entering, and hidden only once fully out of view.
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );

    // Anchor jumps can land past an element before the observer fires;
    // anything already at or above the viewport shows immediately.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("is-visible");
    }

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={variant === "zoom" ? "reveal reveal-zoom" : "reveal"}>
      {children}
    </div>
  );
}
