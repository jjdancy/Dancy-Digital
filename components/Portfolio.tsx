"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/lib/portfolio";
import { STAGGER, duration, easing } from "@/lib/motion";

function BrowserFrame({
  url,
  image,
  accent = false,
  wide = false,
}: {
  url: string;
  image?: string;
  accent?: boolean;
  /** Letterboxes the shot for the featured card, where it runs full width. */
  wide?: boolean;
}) {
  const display = url.replace(/^https?:\/\//, "");
  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        accent ? "border-accent/30" : "border-border"
      }`}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-background px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="ml-3 text-xs text-foreground/50 font-mono truncate">
          {display}
        </span>
      </div>
      <div
        className={`zoom-frame relative flex items-center justify-center overflow-hidden ${
          wide ? "aspect-[16/10] lg:aspect-[21/9]" : "aspect-[16/10]"
        } ${accent ? "bg-accent/[0.07]" : "bg-foreground/[0.04]"}`}
      >
        {image ? (
          <Image
            src={image}
            alt={`Screenshot of ${display}`}
            fill
            className="object-cover object-top"
            sizes={
              wide
                ? "(min-width: 1024px) 1100px, 100vw"
                : "(min-width: 1024px) 480px, 100vw"
            }
          />
        ) : (
          <span className="font-display text-2xl text-foreground/25 italic">
            Live site
          </span>
        )}
      </div>
    </div>
  );
}

function ProjectVisual({
  project,
  accent = false,
  wide = false,
}: {
  project: Project;
  accent?: boolean;
  wide?: boolean;
}) {
  return (
    <BrowserFrame
      url={project.url}
      image={project.image}
      accent={accent}
      wide={wide}
    />
  );
}

function DetailsToggle({
  open,
  onClick,
  onDark = false,
}: {
  open: boolean;
  onClick: () => void;
  /** Inverts the label for the featured card, which sits on a dark surface. */
  onDark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${
        onDark ? "text-background/70" : "text-foreground/70"
      }`}
    >
      {open ? "Hide details" : "See the details"}
      <span
        aria-hidden
        className={`inline-block transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      >
        ⌄
      </span>
    </button>
  );
}

function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const display = project.url.replace(/^https?:\/\//, "");

  const details = (
    <>
      <p className="text-background/75 leading-relaxed mb-4">{project.problem}</p>
      <p className="text-background/75 leading-relaxed mb-4">{project.build}</p>
      <p className="text-background font-medium mb-6">{project.why}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((t) => (
          <span
            key={t}
            className="text-xs font-mono px-2.5 py-1 rounded-full border border-background/20 text-background/70"
          >
            {t}
          </span>
        ))}
      </div>
    </>
  );

  // Kept out of `details` so the case study stays reachable on mobile, where
  // `details` sits behind the collapsible and would hide it until expanded.
  const actions = (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        className="hover-press inline-flex items-center gap-2 rounded-full bg-background text-foreground px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-ink transition-colors"
      >
        Read the case study
        <span aria-hidden>→</span>
      </Link>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-background hover:gap-3 transition-all"
      >
        Visit {display}
        <span aria-hidden>↗</span>
      </a>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: duration.base, ease: easing.outQuint }}
      // Inverted to the dark surface so the featured build reads as a
      // different kind of thing from the list below it, rather than the same
      // card with a slightly warmer tint.
      className="hover-lift group rounded-2xl bg-surface-dark p-6 sm:p-10 mb-8"
    >
      {/* Mobile: name, image, toggle, collapsible details */}
      <div className="lg:hidden">
        <p className="text-xs font-mono text-accent mb-3">Featured build</p>
        <h3 className="font-display text-3xl mb-2 tracking-tight text-background">
          {project.name}
        </h3>
        <p className="text-sm text-background/50 mb-6">{project.industry}</p>
        <ProjectVisual project={project} accent />
        <DetailsToggle open={open} onClick={() => setOpen((v) => !v)} onDark />
        <Collapsible open={open}>{details}</Collapsible>
        <div className="mt-6">{actions}</div>
      </div>

      {/*
        Desktop: a masthead, then the shot full width, then the story in two
        columns underneath. The list cards below all run text beside a small
        screenshot, so the featured build deliberately does not — the point is
        that it reads as a different kind of entry, not a recoloured one.
      */}
      <div className="hidden lg:block">
        <div className="flex items-end justify-between gap-8 mb-8">
          <div>
            <p className="text-xs font-mono text-accent mb-3">Featured build</p>
            <h3 className="font-display text-5xl tracking-tight text-background">
              {project.name}
            </h3>
          </div>
          <p className="text-sm text-background/50 shrink-0 pb-2">
            {project.industry}
          </p>
        </div>

        <ProjectVisual project={project} accent wide />

        <div className="grid grid-cols-2 gap-12 mt-10">
          <p className="text-background/75 leading-relaxed">{project.problem}</p>
          <p className="text-background/75 leading-relaxed">{project.build}</p>
        </div>

        <p className="font-display text-2xl leading-relaxed text-background mt-10 max-w-3xl">
          {project.why}
        </p>

        <div className="flex flex-wrap gap-2 mt-8">
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-mono px-2.5 py-1 rounded-full border border-background/20 text-background/70"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8">{actions}</div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const reversed = index % 2 === 1;

  const details = (
    <>
      <p className="text-foreground/70 leading-relaxed mb-3">
        <span className="text-foreground/50">Problem: </span>
        {project.problem}
      </p>
      <p className="text-foreground/70 leading-relaxed mb-4">
        <span className="text-foreground/50">Build: </span>
        {project.build}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((t) => (
          <span
            key={t}
            className="text-xs font-mono px-2.5 py-1 rounded-full border border-border text-foreground/60"
          >
            {t}
          </span>
        ))}
      </div>
    </>
  );

  // Kept out of `details` so the case study stays reachable on mobile, where
  // `details` sits behind the collapsible and would hide it until expanded.
  const actions = (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        className="hover-press inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-ink transition-colors"
      >
        Read the case study
        <span aria-hidden>→</span>
      </Link>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
      >
        Visit site
        <span aria-hidden>↗</span>
      </a>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: duration.base, delay: index * STAGGER, ease: easing.outQuint }}
      className="hover-lift group rounded-2xl border border-border p-6 sm:p-8"
    >
      {/* Mobile: name, image, toggle, collapsible details */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h3 className="font-display text-2xl tracking-tight">{project.name}</h3>
          <span className="text-xs text-foreground/50 shrink-0">{project.industry}</span>
        </div>
        <ProjectVisual project={project} />
        <DetailsToggle open={open} onClick={() => setOpen((v) => !v)} />
        <Collapsible open={open}>{details}</Collapsible>
        <div className="mt-6">{actions}</div>
      </div>

      {/* Desktop: side by side, always expanded */}
      <div
        className={`hidden md:grid md:grid-cols-2 gap-8 items-center ${
          reversed ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h3 className="font-display text-2xl tracking-tight">{project.name}</h3>
            <span className="text-xs text-foreground/50 shrink-0">{project.industry}</span>
          </div>
          <div className="mt-4">{details}</div>
          <div className="mt-5">{actions}</div>
        </div>
        <ProjectVisual project={project} />
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [vynl, ...rest] = projects;

  return (
    <section id="work" className="py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.base, ease: easing.outQuint }}
          className="max-w-xl mb-16"
        >
          <p className="text-sm font-medium text-accent mb-4">The work</p>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight">
            Five sites. Five different problems.
          </h2>
        </motion.div>

        <FeaturedCard project={vynl} />

        <div className="space-y-6">
          {rest.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
