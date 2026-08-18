"use client";

import { motion } from "framer-motion";
import BookingCalendar from "./BookingCalendar";

const factors = [
  { label: "Simple site", detail: "5-7 pages, no booking or store", range: "$800-1,400" },
  { label: "Standard build", detail: "Custom design, contact forms, local SEO setup", range: "$1,400-2,200" },
  { label: "Full build", detail: "Booking, e-commerce, or custom features", range: "$2,200-2,800" },
];

const retainer = [
  "Hosting on Vercel, fast by default",
  "Monthly SEO checkups, not a one-time setup",
  "Content updates when your business changes",
  "Fixes before you notice something's broken",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mb-16"
            >
              <p className="text-sm font-medium text-accent mb-4">Pricing</p>
              <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
                What it actually costs.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-display text-5xl sm:text-6xl tracking-tight mb-2">
                $800<span className="text-foreground/40 mx-2">-</span>$2,800
              </p>
              <p className="text-foreground/60 mb-10">
                One-time build cost, based on what the site needs to do.
              </p>

              <div className="divide-y divide-border border-y border-border">
                {factors.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center justify-between gap-6 py-5"
                  >
                    <div>
                      <p className="font-medium">{f.label}</p>
                      <p className="text-sm text-foreground/55">{f.detail}</p>
                    </div>
                    <p className="font-mono text-sm text-foreground/70 shrink-0">
                      {f.range}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl bg-surface-dark text-background p-8 sm:p-10"
          >
            <p className="text-sm font-medium text-accent mb-3">
              Then, monthly
            </p>
            <h3 className="font-display text-2xl mb-6 tracking-tight">
              The retainer keeps the site working, not just online.
            </h3>
            <ul className="space-y-4">
              {retainer.map((r) => (
                <li key={r} className="flex gap-3 text-background/80">
                  <span className="text-accent mt-1">→</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-background/55">
              Exact retainer cost depends on what the site needs. We&apos;ll
              give you a number, not a range, once we know your build.
            </p>
            <a
              href="https://cal.com/dancydigital/intro-call"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center w-full rounded-full bg-accent text-accent-ink px-6 py-3 text-sm font-medium hover:bg-background hover:text-foreground transition-colors"
            >
              Book a call
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <p className="text-sm font-medium text-accent mb-3">Pick a time</p>
          <h3 className="font-display text-2xl tracking-tight mb-6">
            No form, no back and forth. Grab a slot that works for you.
          </h3>
          <div className="rounded-2xl border border-border overflow-hidden h-[650px]">
            <BookingCalendar />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
