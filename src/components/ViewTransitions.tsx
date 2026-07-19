"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Cross-fade page navigations via the View Transitions API.
// (Next's experimental.viewTransition flag breaks the SWC parse in this
// setup, so we intercept internal link clicks and wrap router.push ourselves.)
export function ViewTransitions() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      // Only internal page navigations — skip hashes, downloads, external links
      if (!href || !href.startsWith("/") || anchor.target === "_blank" || anchor.hasAttribute("download"))
        return;
      if (href.includes("#")) return;
      if (!("startViewTransition" in document)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(() => {
          router.push(href);
        });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
