"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import Reveal from "./Reveal";
import { projects, type Project } from "@/lib/portfolio";

/** Horizontal space between cards, in px. Mirrors the `gap-7` class below. */
const GAP = 28;
/** How far the centre of the arc sits below its edges, in px. */
const ARC_DEPTH = 72;
/** Tilt at the far edge of the arc, in degrees. */
const MAX_TILT = 11;
/** Extra scale granted to whichever card is sitting in the low point. */
const CENTRE_SCALE = 0.07;
/** Auto-drift speed. Slow enough to read as ambient rather than a slideshow. */
const DRIFT_PX_PER_SEC = 26;
/**
 * How many times the project list is repeated. The strip has to stay wider
 * than the viewport at every offset for the wrap to be invisible.
 */
const REPEATS = 4;
/**
 * Which pass is the real one for assistive tech and the tab order. Centring a
 * focused card means sliding the arc until that card sits at the low point,
 * and doing that for a card in the first pass needs a positive offset — which
 * leaves a gap off the left edge. Making the second pass the real one gives a
 * whole set of slack on that side, and the two passes after it cover the
 * right edge when the last card is centred.
 */
const FOCUS_PASS = 1;
/** Drag distance past which the gesture is a scroll, not a click on a card. */
const DRAG_SLOP = 6;
/**
 * Headroom for the corner a tilted edge card lifts above the arc: half a card
 * width through MAX_TILT works out near 40px at the largest card size.
 */
const ARC_HEADROOM = 44;
/**
 * Curvature of the heading's arc, as the `a` in `y = a x²` with both axes in
 * em, so the shape tracks the font size. Expressed as curvature rather than a
 * fixed depth because the heading sets on one line at desktop widths and two
 * on a phone: holding the depth constant would bend the short line far harder
 * than the long one, where holding `a` makes every line a segment of the same
 * curve. Tuned so the 36-character line dips 0.55em, matching the shallow
 * valley the cards ride.
 */
const TEXT_CURVATURE = 0.0068;
/** Rough advance width of one character, in em, for the Fraunces display face. */
const CHAR_ADVANCE_EM = 0.5;

/**
 * Card width for a given strip width. Sized so a bit over three cards span a
 * desktop viewport — at four the two middle cards straddle the low point and
 * neither reads as the focal one.
 */
function cardWidthFor(stripWidth: number) {
  if (!stripWidth) return 300;
  return Math.round(Math.min(420, Math.max(230, stripWidth * 0.3)));
}

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

/**
 * Where a card sits along the arc, as -1 (left edge) to 1 (right edge) with 0
 * at the low point. Derived entirely from motion values so it stays current
 * without re-rendering, and returns 0 until the strip has been measured — that
 * keeps the first client render identical to the server's.
 */
function arcPosition(index: number, offset: number, stripWidth: number) {
  if (!stripWidth) return 0;
  const cardW = cardWidthFor(stripWidth);
  const centre = index * (cardW + GAP) + offset + cardW / 2;
  return clamp((centre - stripWidth / 2) / (stripWidth / 2), -1, 1);
}

/**
 * One line of text set on the same parabola the cards ride: the middle sits
 * lowest, the ends ride up, and each character rotates to the curve's tangent.
 * `nowrap` because a line that wrapped would put half the arc on each row and
 * read as two broken curves rather than one.
 */
function CurvedLine({ text }: { text: string }) {
  const chars = Array.from(text);
  const n = chars.length;
  const halfWidth = (n * CHAR_ADVANCE_EM) / 2;
  const depth = TEXT_CURVATURE * halfWidth * halfWidth;
  // Tangent at the end of the parabola: the slope of `a x²` at x is `2 a x`.
  const tilt = (Math.atan(2 * TEXT_CURVATURE * halfWidth) * 180) / Math.PI;

  return (
    <span
      className="block whitespace-nowrap"
      style={{ paddingBottom: `${depth.toFixed(4)}em` }}
    >
      {chars.map((ch, i) => {
        const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
        return (
          <span
            key={i}
            className="inline-block"
            style={{
              transform: `translateY(${(depth * (1 - t * t)).toFixed(4)}em) rotate(${(-tilt * t).toFixed(3)}deg)`,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </span>
  );
}

/**
 * The section heading, curved to match the strip below it.
 *
 * Two arrangements ship and CSS picks one: a phone gets the text broken over
 * `lines` so it can stay legible, while anything wider sets it as a single
 * arc. Fitting the whole sentence on one line at phone widths would drop it to
 * about 17px, smaller than the card captions underneath it. Both arrangements
 * are hidden from assistive tech, which takes the heading from `aria-label`
 * rather than spelling out one span per character.
 */
function CurvedHeading({ text, lines }: { text: string; lines: string[] }) {
  return (
    <h2 aria-label={text} className="font-display tracking-tight">
      <span
        aria-hidden
        className="block sm:hidden"
        style={{ fontSize: "clamp(1.35rem, 6.4vw, 2rem)" }}
      >
        {lines.map((line) => (
          <CurvedLine key={line} text={line} />
        ))}
      </span>
      <span
        aria-hidden
        className="hidden sm:block"
        style={{ fontSize: "clamp(1.6rem, 4.4vw, 2.75rem)" }}
      >
        <CurvedLine text={text} />
      </span>
    </h2>
  );
}

function ArcCard({
  project,
  index,
  offset,
  stripWidth,
  width,
  isClone,
  suppressClickRef,
  onFocusCard,
}: {
  project: Project;
  index: number;
  offset: MotionValue<number>;
  stripWidth: MotionValue<number>;
  width: number;
  isClone: boolean;
  suppressClickRef: React.RefObject<boolean>;
  onFocusCard: (index: number) => void;
}) {
  const t = useTransform([offset, stripWidth], ([o, w]: number[]) =>
    arcPosition(index, o, w),
  );
  // The valley itself: pushed furthest down at the centre, level at the edges.
  const y = useTransform(t, (v) => ARC_DEPTH * (1 - v * v));
  // Tangent of that parabola, which is linear in `v`. Negative so the right
  // side of the valley lifts its right edge and the left side its left.
  const rotate = useTransform(t, (v) => -MAX_TILT * v);
  const scale = useTransform(t, (v) => 1 + CENTRE_SCALE * (1 - v * v));
  // Keeps the focal card above the ones leaning in towards it.
  const zIndex = useTransform(t, (v) => Math.round(60 - Math.abs(v) * 40));

  return (
    <motion.div style={{ y, rotate, scale, zIndex, width }} className="shrink-0">
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        aria-hidden={isClone}
        tabIndex={isClone ? -1 : undefined}
        draggable={false}
        // Tabbing to a card that has drifted off screen would otherwise make
        // the browser scroll the clipped strip to reach it. Driving the arc
        // instead brings the card to the low point and leaves layout alone.
        //
        // Keyboard focus only. A mousedown also focuses the link, and sliding
        // the card out from under the pointer before mouseup means the two
        // land on different elements and no click is ever generated — every
        // off-centre card would swallow its own click.
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) onFocusCard(index);
        }}
        onClickCapture={(e) => {
          // A drag that happens to end on a card would otherwise navigate.
          if (suppressClickRef.current) {
            e.preventDefault();
            e.stopPropagation();
            suppressClickRef.current = false;
          }
        }}
        className="group block"
      >
        <div className="zoom-frame hover-lift rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="relative aspect-[4/3] bg-foreground/[0.04]">
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.name} website`}
                fill
                draggable={false}
                sizes="420px"
                className="object-cover object-top pointer-events-none"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center font-display text-xl italic text-foreground/25">
                Live site
              </span>
            )}
          </div>
        </div>
        <p className="mt-4 text-center font-display text-lg tracking-tight">
          {project.name}
        </p>
      </Link>
    </motion.div>
  );
}

export default function Portfolio() {
  const stripRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const offset = useMotionValue(0);
  const stripWidth = useMotionValue(0);

  // Mirrors `stripWidth` for the parts React actually has to lay out.
  const [measured, setMeasured] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);

  // Either reason parks the strip: a pointer resting on it, or a keyboard
  // user working through the cards.
  const paused = hovered || focused;

  const cardW = cardWidthFor(measured);
  const setWidth = projects.length * (cardW + GAP);

  /**
   * Slide the arc so a given card sits at the low point. Deliberately not
   * wrapped: folding this back into one repeat would centre an identical
   * clone rather than the card that actually holds focus. The offset is left
   * out of range until blur, which the drift loop allows for.
   */
  const centreOn = (index: number) => {
    const w = stripWidth.get();
    if (!w) return;
    const cw = cardWidthFor(w);
    offset.set(w / 2 - cw / 2 - index * (cw + GAP));
  };

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const sync = () => {
      const w = el.clientWidth;
      stripWidth.set(w);
      setMeasured(w);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stripWidth]);

  useEffect(() => {
    if (!setWidth) return;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      // Cap the delta so a backgrounded tab doesn't resume with a large jump.
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const dragging = draggingRef.current;
      let v = offset.get();
      if (!reduce && !paused && !dragging) v -= DRIFT_PX_PER_SEC * dt;

      // Fold the offset back into a single repeat. The strip is identical
      // every `setWidth` px so this is invisible, but it has to sit out the
      // drag, whose origin is tracked against an unwrapped value, and the
      // focus case, whose whole point is an offset outside that range.
      if (!dragging && !focused) {
        while (v <= -setWidth) v += setWidth;
        while (v > 0) v -= setWidth;
      }

      // Writing unconditionally would wake every card's transforms each frame,
      // including while the strip is parked.
      if (v !== offset.get()) offset.set(v);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduce, paused, focused, setWidth, offset]);

  return (
    <section
      id="work"
      className="py-24 sm:py-32 border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal className="mb-16 text-center">
          <p className="text-sm font-medium text-accent mb-4">The work</p>
          <CurvedHeading
            text="Five sites. Five different problems."
            lines={["Five sites.", "Five different problems."]}
          />
        </Reveal>
      </div>

      <Reveal>
        <div
          ref={stripRef}
          className="relative overflow-hidden"
          style={{
            paddingTop: ARC_HEADROOM,
            // The dip itself, plus a little air. The section's own py-24/32
            // supplies the rest of the gap to the next block.
            paddingBottom: ARC_DEPTH + 28,
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={() => setFocused(false)}
          // Belt and braces for the focus case above: if anything does manage
          // to scroll the clipped strip, put it straight back.
          onScroll={(e) => {
            e.currentTarget.scrollLeft = 0;
          }}
        >
          <motion.div
            drag="x"
            dragMomentum
            style={{ x: offset }}
            onDragStart={() => {
              draggingRef.current = true;
              suppressClickRef.current = false;
            }}
            onDrag={(_event: unknown, info: PanInfo) => {
              if (Math.abs(info.offset.x) > DRAG_SLOP) {
                suppressClickRef.current = true;
              }
            }}
            onDragEnd={() => {
              draggingRef.current = false;
            }}
            className="flex gap-7 cursor-grab active:cursor-grabbing"
          >
            {Array.from({ length: REPEATS }).flatMap((_, pass) =>
              projects.map((project, i) => (
                <ArcCard
                  key={`${pass}-${project.slug}`}
                  project={project}
                  index={pass * projects.length + i}
                  offset={offset}
                  stripWidth={stripWidth}
                  width={cardW}
                  // Only FOCUS_PASS is real to assistive tech and the tab
                  // order; the rest exist to keep the strip continuous.
                  isClone={pass !== FOCUS_PASS}
                  suppressClickRef={suppressClickRef}
                  onFocusCard={centreOn}
                />
              )),
            )}
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}
