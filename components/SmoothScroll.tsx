"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertia scrolling for pointer devices.
 *
 * Touch scrolling is left native (Lenis' own default) so mobile keeps its
 * platform feel, and the whole thing is skipped for `prefers-reduced-motion`.
 * Anchor links are routed through Lenis so in-page nav keeps the same easing.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // ~1s settle with a long decelerating tail, matching the reveal easing.
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) {
        return;
      }
      const anchor = (e.target as Element | null)?.closest?.('a[href*="#"]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname || url.origin !== window.location.origin) {
        return;
      }
      const id = url.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
      history.pushState(null, "", url.hash);
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
