"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { easing } from "@/lib/motion";
import type { CarouselSlide } from "@/lib/carouselSlides";

export type { CarouselSlide };

type PortfolioCarouselProps = {
  /** Slides to show. Use `dancyPortfolioSlides()` for a ready-made set from lib/portfolio.ts. */
  slides: CarouselSlide[];
  /** Auto-advance slides on a timer. Default true. */
  autoPlay?: boolean;
  /** Ms between auto-advances. Default 5000. */
  interval?: number;
  className?: string;
};

const SWIPE_THRESHOLD = 60;

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

export default function PortfolioCarousel({
  slides,
  autoPlay = true,
  interval = 5000,
  className = "",
}: PortfolioCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = slides.length;
  const dragActiveRef = useRef(false);

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(((nextIndex % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => clearInterval(id);
    // Restart the timer on every navigation (manual or auto) so a slide
    // that was just shown gets its full dwell time before advancing again.
  }, [autoPlay, paused, count, interval, index]);

  if (count === 0) return null;

  const slide = slides[index];

  function onDragEnd(_: unknown, info: PanInfo) {
    dragActiveRef.current = false;
    if (info.offset.x < -SWIPE_THRESHOLD) next();
    else if (info.offset.x > SWIPE_THRESHOLD) prev();
  }

  // scale is fixed (not gated by reduceMotion) so the SSR-rendered initial
  // style always matches the client's first-paint style; useReducedMotion()
  // differs between server and client (no matchMedia during SSR), and letting
  // it affect this value caused a hydration mismatch that left Framer Motion
  // animations stuck across the page. Reduced-motion preference is instead
  // honored via the transition duration below, which isn't baked into markup.
  const slideVariants = {
    initial: { opacity: 0, scale: 1.02 },
    animate: { opacity: 1, scale: 1 },
  };

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client website showcase"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      <div className="relative aspect-[16/10] rounded-2xl border border-border overflow-hidden bg-foreground/[0.03]">
        {/*
          No AnimatePresence here: in testing, wrapping this in AnimatePresence
          left old slides mounted forever (their exit animation never resolved,
          so React never unmounted them, and they piled up invisibly behind the
          current one). Keying by slide.id instead lets React itself swap the
          DOM node on navigation (instant, no exit animation) while Framer still
          plays a clean initial -> animate fade-in on every new slide, which
          tested reliably. If you reintroduce AnimatePresence here, verify slide
          navigation actually swaps content and old nodes get removed, not just
          that no error is thrown.
        */}
        <motion.div
          key={slide.id}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: easing.outQuint }}
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => {
            dragActiveRef.current = true;
          }}
          onDragEnd={onDragEnd}
          data-cursor={count > 1 ? "drag" : undefined}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {slide.url ? (
            <a
              href={slide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
              onClick={(e) => {
                if (dragActiveRef.current) e.preventDefault();
              }}
              aria-label={`Visit ${slide.name}`}
            >
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                draggable={false}
                className="object-cover object-top pointer-events-none"
                sizes="(min-width: 1024px) 800px, 100vw"
              />
            </a>
          ) : (
            <Image
              src={slide.image}
              alt={slide.name}
              fill
              draggable={false}
              className="object-cover object-top pointer-events-none"
              sizes="(min-width: 1024px) 800px, 100vw"
            />
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/40 to-transparent px-5 py-4 sm:px-6 sm:py-5 pointer-events-none">
            <p className="font-display text-lg sm:text-xl text-background">
              {slide.name}
            </p>
            {slide.caption && (
              <p className="text-sm text-background/70">{slide.caption}</p>
            )}
          </div>
        </motion.div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${s.name}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
