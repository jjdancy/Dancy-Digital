export type Project = {
  slug: string;
  name: string;
  url: string;
  industry: string;
  problem: string;
  build: string;
  why: string;
  tags: string[];
  featured?: boolean;
  /** Path under /public, e.g. "/portfolio/vynl.png". Falls back to a text placeholder if omitted. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "vynl",
    name: "Vynl",
    url: "https://www.vynl.com.au",
    industry: "Nail studio",
    problem:
      "A growing nail studio was booking clients through Instagram DMs and a paper calendar. No way to sell products, no way to promote the academy they were launching, and no way to look as good as the work they were doing.",
    build:
      "A full booking system clients can use without calling or DMing anyone, a waitlist for their nail academy, and a supply shop for retail products. All in one site, built to feel as polished as the nail art it's showing off.",
    why: "This is our most complete build. If you want to see what's possible when a business needs more than a brochure site, this is it.",
    tags: ["Next.js", "Booking system", "E-commerce", "Waitlist"],
    featured: true,
    image: "/portfolio/vynl.png",
  },
  {
    slug: "jc-junk-hauling",
    name: "JC Junk Hauling",
    url: "https://www.jcjunkhauling.com",
    industry: "Junk removal",
    problem:
      "Our first paid client. They already had a site, but it was a generic template: cluttered navigation, stock-feeling layout, no clear reason to call them instead of the next junk hauling company in the search results.",
    build:
      "A rebuild focused on one job: get the phone to ring. The quote form and phone number are visible without scrolling, the trust signals (licensed, insured, same-day service, serving the county since 2001) are up front, and the branding actually looks like a real business.",
    why: "The project that proved the model. Small budget, real business, a site that now does its job.",
    tags: ["Next.js", "Local SEO", "Lead generation"],
    image: "/portfolio/jc-junk-hauling-after.png",
  },
  {
    slug: "pro-scout-australia",
    name: "Pro Scout Australia",
    url: "https://pro-scout-australia.vercel.app",
    industry: "Sports recruiting platform",
    problem:
      "Athletes and recruiters had no shared platform built for the Australian market. Existing tools were built for other countries and didn't fit how recruiting actually works there.",
    build:
      "A recruiting platform structured around athlete profiles and scouting workflows, built to handle real data, not just static pages.",
    why: "Proof we can build past the brochure site into something closer to a product.",
    tags: ["Next.js", "Platform", "Structured data"],
    image: "/portfolio/pro-scout-australia.png",
  },
  {
    slug: "lab-university-academy",
    name: "LAB University Academy",
    url: "https://labuniversityprep.com",
    industry: "Private school",
    problem:
      "A private school needed a site that could speak to two very different audiences at once: parents deciding where to enroll their kids, and the school's own credibility as an institution.",
    build:
      "A clean, trustworthy site organized around admissions, academics, and campus life, built to answer a parent's questions before they have to email anyone.",
    why: "Schools can't afford to look unfinished. This one doesn't.",
    tags: ["Next.js", "Education", "Content structure"],
    image: "/portfolio/lab-university-academy.png",
  },
  {
    slug: "flow-cooler",
    name: "Flow Cooler",
    url: "https://flow-cooler.vercel.app",
    industry: "Product ecommerce",
    problem:
      "A physical product with no online storefront. All the demand, none of the way to capture it.",
    build:
      "A product-focused ecommerce site built to sell one thing well: clear photography, clear specs, a checkout that doesn't get in the way.",
    why: "Not every business needs a hundred pages. Sometimes it needs one page that sells.",
    tags: ["Next.js", "E-commerce", "Product page"],
    image: "/portfolio/flow-cooler.png",
  },
];
