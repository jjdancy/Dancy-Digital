import { projects } from "./portfolio";

export type Testimonial = {
  /** Matches a slug in lib/portfolio.ts, which supplies the industry, URL and screenshot. */
  slug: string;
  /**
   * The client's own words, verbatim. Nothing here is trimmed, tidied or
   * paraphrased — same rule as the portfolio copy: if it wasn't said or
   * shipped, it doesn't go on the site.
   */
  quote: string;
  /** How the client signed it, which is not always the portfolio's short name. */
  client: string;
};

export const testimonials: Testimonial[] = [
  {
    slug: "flow-cooler",
    client: "Flow Cooler",
    quote:
      "Honestly couldn't be happier with the website Dancy Digital put together for us. They took what we had in mind and turned it into something that actually looks and feels like our brand. Super easy to work with and the end result came out unreal.",
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
