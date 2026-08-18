"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Elements that get the enlarged ring treatment. Anything can opt in
 * explicitly with `data-cursor="label"`, force the wrap-around treatment with
 * `data-cursor="stick"`, or opt out with `data-cursor="none"`.
 */
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor]';

/** Per-frame follow factor for the dot, corrected for real frame duration. */
const DOT_FOLLOW = 0.4;
/** Per-frame follow factor for the trailing ring (~0.2s settle). */
const RING_FOLLOW = 0.16;
/** Frame duration the follow factors are tuned against. */
const BASE_FRAME_MS = 1000 / 60;
/** Below this size a control gets the ring wrapped around it instead. */
const STICK_MAX_WIDTH = 220;
const STICK_MAX_HEIGHT = 88;

type Mode = "default" | "stick" | "grow" | "label";

type CursorState = {
  mode: Mode;
  label: string;
  /** Size the ring should take while wrapping an element. */
  box: { width: number; height: number; radius: number } | null;
};

const DEFAULT_STATE: CursorState = { mode: "default", label: "", box: null };

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [state, setState] = useState<CursorState>(DEFAULT_STATE);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Runs on any device with a real pointer. Reduced motion does not disable
  // the cursor: `prefers-reduced-motion` exists to prevent vestibular triggers
  // (parallax, large unprompted slides, spin), and a marker that tracks the
  // pointer the visitor is already moving isn't one. What it does remove is
  // the easing — see `reduced` in the animation loop, where the dot and ring
  // snap to the pointer instead of trailing it. Checked after mount so the
  // server-rendered markup is identical for every visitor.
  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnabled(pointer.matches);
      setReduced(motion.matches);
    };
    sync();
    pointer.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      pointer.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Start offscreen so nothing flashes at 0,0 before the first move.
    const pointer = { x: -100, y: -100 };
    const dotPos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let ringScale = 1;
    let ringScaleTarget = 1;
    let raf = 0;
    let last = performance.now();
    // The hovered element itself is held, not its rect, so the ring keeps
    // tracking it correctly while the page scrolls underneath.
    let stuckEl: Element | null = null;
    // Mirrors the `visible` state so pointermove can skip redundant setState
    // calls without reading state during render.
    let shown = false;

    const show = (next: boolean) => {
      if (shown === next) return;
      shown = next;
      setVisible(next);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      show(true);
    };
    const onLeave = () => show(false);
    const onEnter = () => show(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const reset = () => {
      stuckEl = null;
      ringScaleTarget = 1;
      setState((s) => (s.mode === "default" ? s : DEFAULT_STATE));
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (!target) return reset();

      const explicit = target.getAttribute("data-cursor");
      if (explicit === "none") return reset();

      const label = explicit && explicit !== "stick" ? explicit : "";
      const rect = target.getBoundingClientRect();
      const shouldStick =
        !label &&
        (explicit === "stick" ||
          (rect.width <= STICK_MAX_WIDTH && rect.height <= STICK_MAX_HEIGHT));

      stuckEl = shouldStick ? target : null;
      ringScaleTarget = label ? 1 : shouldStick ? 1 : 1.8;

      const next: CursorState = label
        ? { mode: "label", label, box: null }
        : shouldStick
          ? {
              mode: "stick",
              label: "",
              box: {
                width: rect.width + 16,
                height: rect.height + 16,
                radius: parseFloat(getComputedStyle(target).borderRadius) || 9999,
              },
            }
          : { mode: "grow", label: "", box: null };

      setState((s) =>
        s.mode === next.mode &&
        s.label === next.label &&
        s.box?.width === next.box?.width &&
        s.box?.height === next.box?.height
          ? s
          : next,
      );
    };

    const tick = (now: number) => {
      // Frame-rate independence: turn the 60fps-tuned factors into an
      // exponential decay over however long this frame actually took.
      const frames = Math.min((now - last) / BASE_FRAME_MS, 4);
      last = now;
      // Under reduced motion the cursor still renders, but nothing trails:
      // an ease of 1 lands both layers on the pointer within the same frame.
      const dotEase = reduced ? 1 : 1 - Math.pow(1 - DOT_FOLLOW, frames);
      const ringEase = reduced ? 1 : 1 - Math.pow(1 - RING_FOLLOW, frames);

      let targetX = pointer.x;
      let targetY = pointer.y;
      if (stuckEl) {
        if (stuckEl.isConnected) {
          const r = stuckEl.getBoundingClientRect();
          targetX = r.left + r.width / 2;
          targetY = r.top + r.height / 2;
        } else {
          stuckEl = null;
        }
      }

      dotPos.x += (pointer.x - dotPos.x) * dotEase;
      dotPos.y += (pointer.y - dotPos.y) * dotEase;
      ringPos.x += (targetX - ringPos.x) * ringEase;
      ringPos.y += (targetY - ringPos.y) * ringEase;
      ringScale += (ringScaleTarget - ringScale) * ringEase;

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, reduced]);

  useEffect(() => {
    document.body.classList.toggle("lqd-cursor-active", enabled);
    return () => document.body.classList.remove("lqd-cursor-active");
  }, [enabled]);

  if (!enabled) return null;

  const { mode, label, box } = state;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={ringRef}
        className="cursor-ring"
        data-mode={mode}
        data-pressed={pressed || undefined}
        style={{
          width: box ? box.width : mode === "label" ? 64 : 40,
          height: box ? box.height : mode === "label" ? 64 : 40,
          borderRadius: box ? box.radius : 9999,
          opacity: visible ? 1 : 0,
        }}
      >
        {label && <span className="cursor-label">{label}</span>}
      </div>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: visible && mode !== "label" ? 1 : 0 }}
      />
    </div>
  );
}
