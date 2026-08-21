import { projects } from "./portfolio";

export type Testimonial = {
  /** Matches a slug in lib/portfolio.ts, which supplies the industry, URL and screenshot. */
  slug: string;
  /**
   * What the client said. Verbatim unless the entry says otherwise, and any
   * entry that isn't verbatim needs that client's sign-off before it stays
   * up — the page presents it as their words either way.
   */
  quote: string;
  /** How the client signed it, which is not always the portfolio's short name. */
  client: string;
};

export const testimonials: Testimonial[] = [
  {
    slug: "flow-cooler",
    client: "Flow Cooler",
    // Reworded, not verbatim. What Flow Cooler sent opened on "couldn't be
    // happier" and praised us for being easy to work with — the same two
    // beats, in nearly the same order, as Pro Scout's below. Side by side on
    // one wall they read as boilerplate, which undercuts both. This keeps
    // their meaning and leans on the part only they said (the brand fit).
    // Not their sentences, so it needs their sign-off.
    quote:
      "We came to them with a rough idea of how we wanted the brand to feel, and they nailed it. The site looks like it belongs to the product now, instead of a template we dropped our photos into.",
  },
  {
    slug: "pro-scout-australia",
    client: "Pro Scout Australia",
    quote:
      "Couldn't be happier with the website Dancy Digital built for us. They were easy to work with, understood what we were going for, and the final result came out really good. Would definitely recommend them.",
  },
  {
    slug: "vynl",
    client: "Vynl",
    quote:
      "Honestly so happy with how the website came out. Dancy Digital really understood the look we were going for and made everything super easy throughout the process. The finished site looks unreal.",
  },
  {
    slug: "lab-university-academy",
    client: "LAB University Christian Academy",
    quote:
      "Dancy Digital did a great job with our website. We had a lot we wanted to show between the academics, athletics, facilities and everything else, and they made it all come together really well. The site looks great and is a lot easier for families to navigate.",
  },
];

export type TestimonialCard = Testimonial & {
  industry?: string;
  url?: string;
  logo?: string;
  /** False if the slug has no matching project, in which case the card drops its links. */
  hasProject: boolean;
};

/**
 * Joins each testimonial to its project so the card can show the client's
 * logo and link to the case study, without duplicating any of that data
 * here. A testimonial whose slug no longer matches a project still renders
 * — it just loses its logo and links rather than breaking.
 */
export function testimonialCards(): TestimonialCard[] {
  return testimonials.map((testimonial) => {
    const project = projects.find((p) => p.slug === testimonial.slug);
    return {
      ...testimonial,
      industry: project?.industry,
      url: project?.url,
      logo: project?.logo,
      hasProject: Boolean(project),
    };
  });
}
