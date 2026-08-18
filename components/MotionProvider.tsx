"use client";

import { MotionConfig } from "framer-motion";
import { easing, duration } from "@/lib/motion";

/**
 * `reducedMotion="user"` makes every Framer Motion animation on the site honour
 * the OS setting: transforms are dropped, opacity fades are kept. Doing it here
 * rather than per-component keeps the preference out of server-rendered markup,
 * which is what caused an earlier hydration mismatch (see PortfolioCarousel).
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: duration.base, ease: easing.outQuint }}
    >
      {children}
    </MotionConfig>
  );
}
