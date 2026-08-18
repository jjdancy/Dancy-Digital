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
/**
 * Per-frame follow factor for the trailing ring, which sets the length of the
 * comet tail. During a sustained move each layer settles a fixed multiple of
 * the pointer's per-frame velocity behind it — `v * (1 - f) / f` — so the
 * visible gap is the difference between the ring's lag and the dot's.
 *
 * Measured on a ~7px/frame sweep, gap between dot and ring:
 *
 *   0.16  37px   the previous value; reads as a soft blur, not a tail
 *   0.12  58px
 *   0.10  71px   roughly double the original, settles in under half a second
 *   0.08  97px   ~600ms to settle, starts to feel detached on a quick flick
 *
 * A brisk real mouse move runs about 3x that sweep speed, so scale up for what
 * a visitor actually sees.
 */
const RING_FOLLOW = 0.1;
/** Frame duration the follow factors are tuned against. */
const BASE_FRAME_MS = 1000 / 60;
/** Below this size a control gets the ring wrapped around it instead. */
const STICK_MAX_WIDTH = 220;
const STICK_MAX_HEIGHT = 88;
/**
 * A cross-origin iframe is its own browsing context, so the parent stops
 * receiving pointermove the instant the pointer crosses into one. These govern
 * the fallback that notices that silence — see `pointerInIframe`.
 */
const IFRAME_IDLE_MS = 120;
const IFRAME_POLL_MS = 100;

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
    // True while the pointer is believed to be inside a cross-origin iframe,
    // where its real position is unknowable from this frame.
    let overIframe = false;
    let lastMoveAt = performance.now();
    let lastIframeCheck = 0;

    const show = (next: boolean) => {
      if (shown === next) return;
      shown = next;
      setVisible(next);
    };

    /**
     * Whether the last known pointer position falls inside any iframe. Only
     * consulted once the pointer has gone quiet, so the layout reads stay off
     * the hot path — a moving pointer is by definition over content this
     * document still owns.
     */
    const pointerInIframe = () => {
      const frames = document.getElementsByTagName("iframe");
      for (let i = 0; i < frames.length; i++) {
        const r = frames[i].getBoundingClientRect();
        if (
          r.width > 0 &&
          r.height > 0 &&
          pointer.x >= r.left &&
          pointer.x <= r.right &&
          pointer.y >= r.top &&
          pointer.y <= r.bottom
        ) {
          return true;
        }
      }
      return false;
    };

    // Any pointermove proves the pointer is back over content this document
    // owns, which is what recovers the cursor after an iframe visit even if
    // the boundary pointerover was missed.
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      lastMoveAt = performance.now();
      overIframe = false;
      show(true);
    };
    const onLeave = () => show(false);
    // Re-entering the window directly over an iframe would otherwise flash the
    // cursor at its stale position until the idle check caught up.
    const onEnter = () => {
      overIframe = pointerInIframe();
      show(!overIframe);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const reset = () => {
      stuckEl = null;
      ringScaleTarget = 1;
      setState((s) => (s.mode === "default" ? s : DEFAULT_STATE));
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;

      // Record the position from pointerover as well as pointermove. Crossing
      // into an iframe fires this event and then nothing else, so without it
      // the last known position stays frozen outside the frame the pointer
      // just entered — which is exactly the coordinate `pointerInIframe`
      // needs to be right about.
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      // The boundary pointerover still reaches this document as the pointer
      // crosses into an iframe; everything after it is swallowed. Fading here
      // rather than waiting for the idle check keeps the handoff immediate.
      if (el?.tagName === "IFRAME") {
        overIframe = true;
        reset();
        show(false);
        return;
      }

      const target = el?.closest?.(INTERACTIVE) ?? null;
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

      // Backstop for the boundary pointerover: browsers vary on whether it
      // lands, and a fast diagonal entry can skip it. Once the pointer has
      // been quiet long enough to be suspicious, test its last known position
      // against the iframe rects.
      //
      // This can only ever hide. Coming back is already proven by pointermove,
      // which cannot fire from inside a cross-origin frame, so re-showing here
      // would just be guessing from a position that may be stale — and an
      // earlier revision that did exactly that immediately undid every hide
      // the boundary event had correctly performed.
      if (
        !overIframe &&
        now - lastMoveAt > IFRAME_IDLE_MS &&
        now - lastIframeCheck > IFRAME_POLL_MS
      ) {
        lastIframeCheck = now;
        if (pointerInIframe()) {
          overIframe = true;
          reset();
          show(false);
        }
      }

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
