export type Feature = {
  title: string;
  body: string;
};

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

  // The fields below are used only by the case study page at /work/[slug].
  // Everything in them restates what the project actually shipped — there are
  // deliberately no timelines, traffic numbers or conversion figures here,
  // since none of that was measured.

  /** Sets up the case study; a longer read than `problem`. */
  overview: string;
  /** What the site actually does, one entry per capability. */
  features: Feature[];
  /** What the finished build changed for the client, in plain terms. */
  outcome: string;
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
    overview:
      "Vynl is a nail studio running three businesses at once: the studio itself, a retail line, and a training academy about to launch. All three were being handled out of one Instagram inbox. Bookings came in as DMs, got written into a paper calendar, and anything the studio wanted to sell had to be arranged message by message. The work coming out of the studio was detailed and deliberate, and the website in front of it was not.",
    features: [
      {
        title: "Booking without the back-and-forth",
        body: "Clients pick their service and a time themselves. No DM thread, no waiting for a reply, no double-booked slot to apologise for later.",
      },
      {
        title: "A waitlist for the academy",
        body: "The training arm can collect interest before it opens rather than starting from nothing on launch day.",
      },
      {
        title: "A shop for the retail line",
        body: "Supply products sell directly from the site instead of being quoted and arranged one message at a time.",
      },
      {
        title: "Presentation that matches the work",
        body: "The studio's work is precise and considered. The site had to carry that, not undercut it with a template.",
      },
    ],
    outcome:
      "Three things that used to live in an inbox, a paper calendar and a series of DMs now run off one site. It is the most complete build we have shipped, and the clearest example of what we mean when we say a site should do a job rather than sit there.",
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
    overview:
      "JC Junk Hauling already had a website. That was the problem. It was a template: navigation stuffed with pages nobody needed, stock photography, and nothing anywhere on it that answered the only question a visitor actually has, which is why call these people and not the next result down. In a search where every competitor looks the same, looking the same is the whole problem.",
    features: [
      {
        title: "A quote form you don't have to scroll for",
        body: "The form and the phone number sit at the top of the page. Someone who has already decided to call should never have to hunt for the number.",
      },
      {
        title: "Trust signals up front",
        body: "Licensed, insured, same-day service, serving the county since 2001. These were buried before. They are the reason someone picks up the phone, so they lead.",
      },
      {
        title: "Navigation cut back",
        body: "The template's page sprawl came out. What is left is what a customer needs to book a haul.",
      },
      {
        title: "Branding that reads as a real business",
        body: "Not stock, not generic. A local operator that has been working the same county for two decades should look like one.",
      },
    ],
    outcome:
      "This was our first paid client and the project that proved the model. A small budget spent on the few things that decide whether a stranger calls you, rather than spread thin across pages nobody reads.",
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
    overview:
      "Australian athletes and the recruiters looking for them had no common ground built for how recruiting actually works there. The tools that existed were built elsewhere, for other pathways and other calendars, and the mismatch showed. This one is not a brochure site with a contact form bolted on — it is a product, and it had to be structured like one from the first page.",
    features: [
      {
        title: "Athlete profiles as real records",
        body: "Profiles are structured data a recruiter can actually work through, not paragraphs of text hand-written into a page.",
      },
      {
        title: "Built around scouting workflows",
        body: "The structure follows what a recruiter is trying to do rather than what is easy to lay out.",
      },
      {
        title: "Fitted to the Australian pathway",
        body: "The existing options were built for other countries. This one is shaped around how recruiting runs locally.",
      },
      {
        title: "Data-driven, not static",
        body: "Pages are generated from records, so the platform grows as athletes are added instead of needing a rebuild.",
      },
    ],
    outcome:
      "The project that shows we can build past a marketing site into something with real data behind it. If what you need is a product rather than a brochure, this is the one to look at.",
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
    overview:
      "A school site has to hold two audiences at once. A parent deciding where to send their child is doing careful, sceptical research, often late at night, and wants specifics. The institution itself needs to read as credible and established to everyone else who lands there. Those two jobs pull in different directions, and the structure had to carry both without the site turning into a brochure for one and a wall of text for the other.",
    features: [
      {
        title: "Admissions given its own path",
        body: "The question a prospective parent came to answer is treated as the main route through the site, not a link in a menu.",
      },
      {
        title: "Academics laid out plainly",
        body: "What is taught and how, in enough detail that a parent can judge it without having to ask.",
      },
      {
        title: "Campus life shown, not claimed",
        body: "What the place is actually like day to day, which is the part a prospectus never quite manages.",
      },
      {
        title: "Answers before the email",
        body: "The site is built to resolve the ordinary questions up front, so contact is a next step rather than a prerequisite.",
      },
    ],
    outcome:
      "Parents research schools long before they call anyone. This site is built for that stretch of the decision, where the only thing working on the school's behalf is what a stranger can find and read on their own.",
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
    overview:
      "A physical product with demand already behind it and nowhere online to buy it. Selling one product is a different problem from running a catalogue: there is no browsing to support, no categories to organise, nothing to cross-sell. Every element on the page either helps someone decide to buy or is in the way. That constraint set the whole build.",
    features: [
      {
        title: "Photography doing the selling",
        body: "For a single physical product the images are the product page. They are treated as the primary content, not decoration around copy.",
      },
      {
        title: "Specs without the noise",
        body: "What it is and what it does, stated plainly, for the buyer who wants to check before committing.",
      },
      {
        title: "Checkout that stays out of the way",
        body: "The path from deciding to buying is kept as short as it can be, because every extra step is somewhere to lose the sale.",
      },
      {
        title: "One page, one job",
        body: "No catalogue, no filters, no navigation pulling attention sideways. There is one thing to sell and one thing to do.",
      },
    ],
    outcome:
      "The build where restraint was the point. Everything that would normally pad out an ecommerce site was left out, because with one product any of it would only compete with the sale.",
  },
];
