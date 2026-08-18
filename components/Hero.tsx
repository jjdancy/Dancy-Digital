"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32"
      style={
        {
          "--x": "50%",
          "--y": "30%",
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-150"
        style={{
          background:
            "radial-gradient(400px circle at var(--x) var(--y), rgba(255,90,31,0.10), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <motion.p
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium text-accent mb-6"
        >
          Based in Wilson, NC, serving clients nationwide
        </motion.p>

        <motion.h1
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-[2.75rem] leading-[1.05] sm:text-6xl sm:leading-[1.05] lg:text-7xl lg:leading-[1.02] max-w-4xl tracking-tight"
        >
          We build websites that get small businesses{" "}
          <span className="italic text-accent">found, called, and paid.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-xl text-lg text-foreground/70 leading-relaxed"
        >
          Two people. Real client work. We use AI to move faster on design
          and build, so your site launches in weeks, not months, without
          cutting the corners that make it look cheap.
        </motion.p>

        <motion.div
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#work"
            className="inline-flex items-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-ink transition-colors"
          >
            See our work
          </a>
          <a
            href="https://cal.com/dancydigital/intro-call"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-foreground transition-colors"
          >
            Book a call
          </a>
        </motion.div>
      </div>
    </section>
  );
}
