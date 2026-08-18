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
  /** Path under /public, e.g. "/portfolio/vynl.jpg". Falls back to a text placeholder if omitted. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "vynl",
    name: "Vynl",
    url: "https://www.vynl.com.au",
    industry: "Nail studio",
    problem:
      "A growing nail studio was booking clients through Instagram DMs and a paper calendar. They couldn't sell products online, couldn't promote the academy they were launching, and the site didn't look anything like the work they were doing.",
    build:
      "A full booking system clients can use without calling or DMing anyone, a waitlist for their nail academy, and a supply shop for retail products. All in one site, built to feel as polished as the nail art it's showing off.",
    why: "Our most complete build so far. Booking, retail, and an academy waitlist, all running off one site instead of three different tools.",
    tags: ["Next.js", "Booking system", "E-commerce", "Waitlist"],
    featured: true,
    image: "/portfolio/vynl.jpg",
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
    why: "The project that proved the model works. A small budget turned into a site that actually earns calls.",
    tags: ["Next.js", "Local SEO", "Lead generation"],
    image: "/portfolio/jc-junk-hauling-after.jpg",
  },
  {
    slug: "pro-scout-australia",
    name: "Pro Scout Australia",
    url: "https://pro-scout-australia.vercel.app",
    industry: "Sports recruiting platform",
    problem:
      "Athletes and recruiters had no shared platform built for the Australian market. Existing tools were built for other countries and didn't fit how recruiting actually works there.",
    build:
      "A recruiting platform structured around athlete profiles and scouting workflows, built on real data instead of static pages.",
    why: "Proof we can build past a brochure site into an actual product.",
    tags: ["Next.js", "Platform", "Structured data"],
    image: "/portfolio/pro-scout-australia.jpg",
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
    why: "Parents research schools online before they ever pick up the phone. This site gives them a reason to keep reading instead of clicking away.",
    tags: ["Next.js", "Education", "Content structure"],
    image: "/portfolio/lab-university-academy.jpg",
  },
  {
    slug: "flow-cooler",
    name: "Flow Cooler",
    url: "https://flow-cooler.vercel.app",
    industry: "Product ecommerce",
    problem:
      "A physical product with real demand and no online storefront to capture it.",
    build:
      "A product-focused ecommerce site built to sell one thing well: clear photography, clear specs, a checkout that doesn't get in the way.",
    why: "The whole build is one page: photography, specs, and a checkout, nothing else competing for attention.",
    tags: ["Next.js", "E-commerce", "Product page"],
    image: "/portfolio/flow-cooler.jpg",
  },
];
