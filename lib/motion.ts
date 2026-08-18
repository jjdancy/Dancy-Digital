import type { Transition, Variants } from "framer-motion";

/**
 * Easing curves matched to the reference site's motion language: a long,
 * decelerating tail with no overshoot. `easeOutQuint` is their exact CSS
 * curve; the others cover GSAP's power4/expo `.out` equivalents.
 */
export const easing = {
  /** cubic-bezier(0.23, 1, 0.32, 1) - the default for reveals and hovers. */
  outQuint: [0.23, 1, 0.32, 1],
  /** Longer tail, for large elements travelling further. */
  outExpo: [0.19, 1, 0.22, 1],
  /** Shorter tail, for small UI affordances. */
  outQuart: [0.165, 0.84, 0.44, 1],
} as const;

export const duration = {
  fast: 0.4,
  base: 0.7,
  slow: 0.9,
} as const;

export const revealTransition: Transition = {
  duration: duration.base,
  ease: easing.outQuint,
};

/** Distance in px a revealing element travels before settling. */
export const REVEAL_OFFSET = 24;

/**
 * Stagger between grouped children, in seconds. Mirrors the reference site's
 * 32.5ms per-character text stagger, loosened for card-sized items.
 */
export const STAGGER = 0.08;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_OFFSET },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
};

/** Shared viewport config so every reveal triggers at the same point. */
export const revealViewport = { once: true, margin: "-80px" } as const;
