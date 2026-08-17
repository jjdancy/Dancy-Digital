"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function Frame({
  tag,
  caption,
  image,
  emphasis = false,
}: {
  tag: string;
  caption: string;
  image: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide ${
            emphasis ? "bg-accent text-accent-ink" : "bg-background/10 text-background"
          }`}
        >
          {tag}
        </span>
        <span className="text-sm text-background/50">{caption}</span>
      </div>
      <div
        className={`rounded-xl border overflow-hidden ${
          emphasis ? "border-accent/40" : "border-background/15"
        }`}
      >
        <div className="flex items-center gap-1.5 border-b border-background/15 bg-background/[0.04] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-background/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-background/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-background/15" />
          <span className="ml-3 text-xs font-mono text-background/40">
            jcjunkhauling.com
          </span>
        </div>
        <div className="relative aspect-[21/10]">
          <Image
            src={image}
            alt={`JC Junk Hauling, ${tag.toLowerCase()}`}
            fill
            className="object-cover object-top"
            sizes="(min-width: 1024px) 480px, 100vw"
          />
        </div>
      </div>
    </div>
  );
}

export default function Problem() {
  return (
    <section className="border-t border-border bg-surface-dark text-background">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium text-accent mb-4">
              The problem
            </p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tight mb-6">
              You&apos;re losing customers who can&apos;t find you online.
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-background/75">
              <p>
                Or worse, they find your site from 2012 and leave before
                they read a word. Small doesn&apos;t mean it&apos;s okay to
                look unfinished. Your competitors down the street already
                figured that out.
              </p>
              <p>
                Most small business owners aren&apos;t choosing between a
                good website and a bad one. They&apos;re choosing between
                no website and whatever a template builder spits out at
                2am. Both cost you jobs.
              </p>
              <p className="text-background">
                A site that loads fast, works on a phone, and makes it
                obvious what you do and how to reach you isn&apos;t a
                luxury. It&apos;s the thing standing between a customer and
                your competitor.
              </p>
              <a
                href="#work"
                className="inline-flex items-center gap-2 text-sm font-medium text-background hover:gap-3 hover:text-accent transition-all"
              >
                See how we&apos;ve fixed this for other businesses
                <span aria-hidden>→</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-sm text-background/50 mb-4">
              JC Junk Hauling, real example
            </p>
            <div className="space-y-6">
              <Frame
                tag="Before"
                caption="What customers found"
                image="/portfolio/jc-junk-hauling-before.jpg"
              />
              <Frame
                tag="After"
                caption="Three weeks later"
                image="/portfolio/jc-junk-hauling-after.jpg"
                emphasis
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
