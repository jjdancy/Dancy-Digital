import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/portfolio";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

function findProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return { title: "Work - Dancy Digital" };

  const title = `${project.name} - Dancy Digital`;
  return {
    title,
    description: project.problem,
    openGraph: {
      title,
      description: project.problem,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const display = project.url.replace(/^https?:\/\//, "");
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <article>
          {/* Title block */}
          <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-32 pb-12 sm:pt-40">
            <Reveal>
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-8"
              >
                <span aria-hidden>←</span>
                Back to the work
              </Link>
              <p className="text-sm font-medium text-accent mb-4">
                {project.industry}
              </p>
              <h1 className="font-display text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl tracking-tight max-w-4xl">
                {project.name}
              </h1>
            </Reveal>
          </div>

          {/* Full-bleed hero image */}
          <Reveal className="px-6 sm:px-8" delay={0.05}>
            <div className="zoom-frame mx-auto max-w-[1400px] rounded-2xl border border-border overflow-hidden bg-foreground/[0.04]">
              <div className="relative aspect-[16/10] sm:aspect-[2/1]">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`${project.name} website`}
                    fill
                    priority
                    sizes="(min-width: 1400px) 1400px, 100vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-display text-3xl italic text-foreground/25">
                    Live site
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          {/* Narrative */}
          <div className="mx-auto max-w-6xl px-6 sm:px-8 py-20 sm:py-28">
            <div className="grid lg:grid-cols-[200px_1fr] gap-10 lg:gap-20">
              <Reveal as="div" className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-xs font-mono uppercase tracking-wide text-foreground/40 mb-4">
                  Details
                </p>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-foreground/50">Industry</dt>
                    <dd className="text-foreground">{project.industry}</dd>
                  </div>
                  <div>
                    <dt className="text-foreground/50">Live at</dt>
                    <dd>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline underline-offset-4 decoration-border hover:decoration-accent break-words"
                      >
                        {display}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2 mt-6">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2.5 py-1 rounded-full border border-border text-foreground/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>

              <div className="max-w-2xl">
                <Reveal>
                  <p className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/90">
                    {project.overview}
                  </p>
                </Reveal>

                <Reveal delay={0.05} className="mt-14">
                  <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-4">
                    The problem
                  </h2>
                  <p className="text-lg text-foreground/75 leading-relaxed">
                    {project.problem}
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-14">
                  <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-4">
                    What we built
                  </h2>
                  <p className="text-lg text-foreground/75 leading-relaxed">
                    {project.build}
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-10">
                  <dl className="divide-y divide-border border-y border-border">
                    {project.features.map((f) => (
                      <div key={f.title} className="py-6">
                        <dt className="font-display text-lg tracking-tight mb-2">
                          {f.title}
                        </dt>
                        <dd className="text-foreground/70 leading-relaxed">
                          {f.body}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>

                <Reveal delay={0.05} className="mt-14">
                  <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-4">
                    Where it landed
                  </h2>
                  <p className="text-lg text-foreground/75 leading-relaxed">
                    {project.outcome}
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-14">
                  <div className="border-l-2 border-accent/40 pl-6">
                    <p className="font-display text-xl sm:text-2xl leading-relaxed">
                      {project.why}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.15} className="mt-14">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-press inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-ink transition-colors"
                  >
                    Visit {display}
                    <span aria-hidden>↗</span>
                  </a>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Next project */}
          <div className="border-t border-border">
            <div className="mx-auto max-w-6xl px-6 sm:px-8 py-16">
              <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <p className="text-sm text-foreground/50 mb-2">Next project</p>
                  <Link
                    href={`/work/${next.slug}`}
                    data-cursor="view"
                    className="font-display text-3xl sm:text-4xl tracking-tight hover:text-accent transition-colors"
                  >
                    {next.name}
                  </Link>
                </div>
                <Link
                  href="/#work"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all shrink-0"
                >
                  See all work
                  <span aria-hidden>→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
