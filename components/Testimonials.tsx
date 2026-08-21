"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { testimonialCards, type TestimonialCard } from "@/lib/testimonials";
import { STAGGER, duration, easing } from "@/lib/motion";

/**
 * Resting angles in degrees, by card position. Hand-picked rather than
 * randomised: they need to alternate direction, and anything past roughly
 * 2.5deg starts to read as broken rather than pinned up.
 */
const TILTS = [-2.1, 1.7, 1.5, -2.4];

/** Accent ticks scattered around the title, as in a marked-up print proof. */
const TICKS = [
  "-left-6 top-12 -rotate-[25deg]",
  "left-16 -top-2 rotate-[12deg]",
  "-right-8 top-8 rotate-[28deg]",
  "-left-12 bottom-6 rotate-[40deg]",
  "-right-4 bottom-10 -rotate-[18deg]",
];

/**
 * Hand-drawn marks tiled behind the section. Deliberately close to invisible:
 * it should register as texture on the band, not as a second thing to read.
 */
function Doodles() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-foreground/[0.07]"
      style={{
        maskImage: "radial-gradient(115% 85% at 50% 25%, black 35%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(115% 85% at 50% 25%, black 35%, transparent 100%)",
      }}
    >
      <defs>
        <pattern
          id="dd-doodle-marks"
          width="240"
          height="240"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-6)"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 44c14-19 34-19 46 0" />
            <path d="M96 22l15 15-15 15-15-15z" />
            <path d="M148 32h34" />
            <path d="M208 24c-9 11-9 24 0 35" />
            <circle cx="40" cy="114" r="12" />
            <path d="M78 100c10 15 25 15 35 0" />
            <path d="M138 96l11 11 11-11" />
            <path d="M198 92v30" />
            <path d="M20 178c17-11 31-4 39 9" />
            <path d="M92 168l24 24M116 168l-24 24" />
            <path d="M158 182c11-14 27-14 37 0" />
            <path d="M206 206h24" />
            <path d="M46 222c13 8 27 8 39 0" />
            <path d="M126 214c0 12 9 19 19 19" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dd-doodle-marks)" />
    </svg>
  );
}

function Card({ card, index }: { card: TestimonialCard; index: number }) {
  const domain = card.url?.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: duration.base,
        delay: index * STAGGER,
        ease: easing.outQuint,
      }}
    >
      {/*
        The reveal and the tilt are on separate elements on purpose: Framer
        Motion writes `transform` inline, which would win over the class and
        flatten every card the moment it animated in.

        `--drop` offsets the right-hand column instead of a margin, so the
        stagger is purely visual and the grid rows stay level.
      */}
      <figure
        className={`tilt-card relative rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-[0_20px_50px_-34px_rgb(20_18_15/0.45)] hover:z-10 ${
          index % 2 === 1 ? "lg:[--drop:44px]" : ""
        }`}
        style={{ "--tilt": `${TILTS[index % TILTS.length]}deg` } as React.CSSProperties}
      >
        <figcaption className="flex items-center gap-3 pr-8">
          {/* Positioned against the figure, not the caption. It lives inside
              the caption only because `figcaption` has to be the figure's
              first or last child. */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-5 top-2 select-none font-display text-6xl leading-none text-accent/25"
          >
            &rdquo;
          </span>

          {/*
            Contained, not cropped, and on a white plate: the four logos are a
            wide wordmark, a tall crest and a badge with its own dark
            background, so a square avatar crop would cut half of them apart.
            The name is right beside it, so the logo is decorative to a screen
            reader and carries an empty alt rather than repeating it.
          */}
          {card.logo ? (
            <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-white p-1.5">
              <Image
                src={card.logo}
                alt=""
                fill
                sizes="64px"
                className="object-contain"
              />
            </span>
          ) : null}

          <span className="min-w-0">
            <span className="block font-medium text-accent">{card.client}</span>
            {domain ? (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate font-mono text-xs text-foreground/45 hover:text-foreground/70 transition-colors"
              >
                {domain}
              </a>
            ) : null}
          </span>
        </figcaption>

        <blockquote className="mt-5 leading-relaxed text-foreground/80">
          {card.quote}
        </blockquote>

        {card.hasProject ? (
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
            <span className="text-xs text-foreground/45">{card.industry}</span>
            <Link
              href={`/work/${card.slug}`}
              data-cursor="view"
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 transition-all"
            >
              See the build
              <span aria-hidden>→</span>
            </Link>
          </div>
        ) : null}
      </figure>
    </motion.div>
  );
}

export default function Testimonials() {
  const cards = testimonialCards();

  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden border-t border-border bg-surface-tint py-24 sm:py-32"
    >
      <Doodles />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.base, ease: easing.outQuint }}
          className="relative mx-auto mb-16 max-w-xl text-center sm:mb-20"
        >
          {TICKS.map((position) => (
            <span
              key={position}
              aria-hidden
              className={`absolute hidden h-[3px] w-6 rounded-full bg-accent/60 sm:block ${position}`}
            />
          ))}

          <p className="font-display text-2xl text-foreground/50 sm:text-3xl">
            in their own words
          </p>
          <h2 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            testimonials
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-foreground/65">
            Every one of these sites is in the portfolio above, if you want to
            check the work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start lg:gap-x-7 lg:pb-12">
          {cards.map((card, i) => (
            <Card key={card.slug} card={card} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.base, ease: easing.outQuint }}
          className="mt-16 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-6"
        >
          <p className="text-foreground/65">
            Want one of these written about your site?
          </p>
          <a
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium transition-all hover:gap-3"
          >
            Start a project
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
