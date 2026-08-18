"use client";

import { motion } from "framer-motion";
import { duration, easing } from "@/lib/motion";
import ContactForm from "./ContactForm";

export default function About() {
  return (
    <section id="contact" className="py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: duration.base, ease: easing.outQuint }}
          >
            <p className="text-sm font-medium text-accent mb-4">Who we are</p>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-8">
              We&apos;re not a 50-person agency. We&apos;re two people who
              ship fast.
            </h2>

            <div className="border-l-2 border-accent/40 pl-5 mb-10">
              <p className="font-display text-lg mb-2">
                Jovon Dancy &amp; Gordon Gill
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Two developers who wanted to use what they know to help
                small businesses get a real website, without agency prices
                or a template that looks like everyone else&apos;s. Same
                stack for every build: Next.js, React, TypeScript, shipped
                on Vercel.
              </p>
            </div>

            <p className="text-foreground/70 leading-relaxed">
              Based in Wilson, NC, working with businesses across the
              country. Distance isn&apos;t really a limit for what we do.
              If you need a site and you&apos;re ready to talk, reach out.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: duration.base, delay: 0.1, ease: easing.outQuint }}
          >
            <p className="text-sm font-medium text-accent mb-4">Get in touch</p>
            <h3 className="font-display text-2xl tracking-tight mb-2">
              Tell us what you&apos;re working with.
            </h3>
            <p className="text-foreground/60 mb-8">
              Or reach us directly at{" "}
              <a
                href="mailto:contact@dancydigital.com"
                className="text-foreground underline underline-offset-4 decoration-border hover:decoration-accent"
              >
                contact@dancydigital.com
              </a>{" "}
              or{" "}
              <a
                href="tel:+17045790869"
                className="text-foreground underline underline-offset-4 decoration-border hover:decoration-accent"
              >
                (704) 579-0869
              </a>
            </p>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
