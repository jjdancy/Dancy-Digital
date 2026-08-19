"use client";

import { motion } from "framer-motion";
import { STAGGER, duration, easing } from "@/lib/motion";

const stages = [
  {
    label: "01",
    title: "Discovery",
    time: "Days 1-2",
    copy: "A short call about what your business actually needs, not a 40-question intake form. We figure out who your customers are and what they need to see to call you.",
    visual: (
      <div className="rounded-lg border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-foreground/70">
        <p className="text-foreground">notes.txt</p>
        <p className="mt-2">- who calls: homeowners, 25 mi radius</p>
        <p>- must show: pricing range, phone #</p>
        <p>- competitor sites: slow, outdated</p>
        <p>- goal: more calls within 30 days</p>
      </div>
    ),
  },
  {
    label: "02",
    title: "Design",
    time: "Days 3-6",
    copy: "Layout and structure before polish. You see the actual shape of the site early, so there's no surprise reveal at the end.",
    visual: (
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="h-3 w-1/3 rounded bg-foreground/15 mb-3" />
        <div className="h-16 rounded bg-foreground/10 mb-3" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 rounded bg-foreground/10" />
          <div className="h-10 rounded bg-foreground/10" />
          <div className="h-10 rounded bg-accent/20" />
        </div>
      </div>
    ),
  },
  {
    label: "03",
    title: "Build",
    time: "Week 2",
    copy: "Real code, not a page builder. Next.js, React and TypeScript, the same stack we used for every site in our portfolio, so nothing here is held together with plugins that break later.",
    visual: (
      <div className="rounded-lg border border-border bg-surface-dark p-4 font-mono text-xs leading-relaxed text-background/80">
        <p><span className="text-accent">export</span> function Hero() {"{"}</p>
        <p className="pl-4">return &lt;section&gt;</p>
        <p className="pl-8 text-background">Book now, no calls needed</p>
        <p className="pl-4">&lt;/section&gt;</p>
        <p>{"}"}</p>
      </div>
    ),
  },
  {
    label: "04",
    title: "Launch",
    time: "Week 2-3",
    copy: "Deployed to Vercel, connected to your domain, tested on real phones before it goes live. Not a staging link you have to chase us about.",
    visual: (
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-border bg-background px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="ml-2 text-[11px] text-foreground/50 font-mono">
            yourbusiness.com
          </span>
        </div>
        <div className="p-4">
          <div className="h-3 w-2/5 rounded bg-foreground/15 mb-2" />
          <div className="h-2 w-3/5 rounded bg-foreground/10" />
        </div>
      </div>
    ),
  },
  {
    label: "05",
    title: "Support",
    time: "Ongoing",
    copy: "Hosting, SEO, and maintenance on a monthly retainer. We watch how the site performs and fix what needs fixing, before you notice something's wrong.",
    visual: (
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-end gap-1.5 h-16">
          {[40, 55, 45, 70, 60, 85, 75].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${i === 5 ? "bg-accent" : "bg-foreground/15"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    ),
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.base, ease: easing.outQuint }}
          className="max-w-xl mb-16"
        >
          <p className="text-sm font-medium text-accent mb-4">How we work</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
            Five stages. Three weeks. No mystery in between.
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border hidden sm:block" />
          <div className="space-y-12 sm:space-y-16">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: duration.base, delay: i * STAGGER, ease: easing.outQuint }}
                className="relative grid sm:grid-cols-[40px_1fr_1fr] gap-6 sm:gap-10 items-start"
              >
                <div className="hidden sm:flex h-10 w-10 rounded-full bg-background border border-border items-center justify-center text-xs font-mono text-foreground/60 relative z-10">
                  {stage.label}
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="font-display text-xl">{stage.title}</h3>
                    <span className="text-xs text-foreground/50 font-mono">
                      {stage.time}
                    </span>
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    {stage.copy}
                  </p>
                </div>
                <div>{stage.visual}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.base, ease: easing.outQuint }}
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pl-0 sm:pl-[64px]"
        >
          <p className="text-foreground/70">
            That&apos;s the whole process. Ready to start yours?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all shrink-0"
          >
            Get a quote
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
