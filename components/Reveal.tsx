"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import {
  REVEAL_OFFSET,
  duration as durations,
  easing,
  revealViewport,
} from "@/lib/motion";

type RevealProps = Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport"> & {
  /** Seconds to wait before this element animates. Use for manual stagger. */
  delay?: number;
  /** Travel distance in px. */
  offset?: number;
  duration?: number;
  as?: "div" | "section" | "li" | "article" | "header";
};

/**
 * Fade-and-rise on scroll into view. Reduced motion is handled globally by
 * `MotionConfig reducedMotion="user"`, which drops the transform and keeps
 * the fade, so nothing here needs to branch on the user's preference (doing
 * so would change server-rendered markup and break hydration).
 */
export default function Reveal({
  delay = 0,
  offset = REVEAL_OFFSET,
  duration = durations.base,
  as = "div",
  children,
  ...rest
}: RevealProps) {
  // Cast: the union of motion element components has mutually incompatible
  // event-handler types, so the element tag is resolved at runtime instead.
  const Component = motion[as] as React.ElementType;
  return (
    <Component
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration, delay, ease: easing.outQuint }}
      {...rest}
    >
      {children}
    </Component>
  );
}
