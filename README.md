# Dancy Digital

Marketing site for Dancy Digital, a two-person web design agency based in Wilson, NC and Charlotte.

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- Framer Motion (scroll reveals, hover states, cursor-tracked hero spotlight)
- Vercel Analytics

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx           Home page, composes all sections
  layout.tsx          Fonts (Fraunces + Inter), metadata, Analytics
  globals.css          Design tokens (color, theme)
  api/contact/route.ts  Serverless function backing the contact form
components/
  Header.tsx, Hero.tsx, Problem.tsx, Process.tsx,
  Portfolio.tsx, Pricing.tsx, About.tsx, ContactForm.tsx, Footer.tsx
lib/
  portfolio.ts         Real client project data (name, URL, copy, tags)
```

## Before launch - placeholders to replace

These are intentionally left as visible placeholders so they're impossible to miss:

- **Founder names and bios** - `components/About.tsx`, the `founders` array. Currently `[Founder One name]` / `[Founder Two name]` with bracketed bio placeholders.
- **Contact form delivery** - `app/api/contact/route.ts` currently only logs submissions to the server console. Wire it to an email provider (e.g. Resend, Postmark) before relying on it for real leads.

Contact email (`contact@dancydigital.com`) and phone ((704) 579-0869) are already live in `components/About.tsx` and `components/Footer.tsx`.

## Portfolio data

All five projects in `lib/portfolio.ts` are real, live client sites with verified URLs:

- Vynl - https://www.vynl.com.au
- JC Junk Hauling - https://www.jcjunkhauling.com
- Pro Scout Australia - https://pro-scout-australia.vercel.app
- LAB University Academy - https://labuniversityprep.com
- Flow Cooler - https://flow-cooler.vercel.app

No invented stats or testimonials are used anywhere on the site.

## Portfolio screenshots

Each project in `lib/portfolio.ts` can carry an `image` path (rendered inside the browser-chrome mockup in the portfolio cards). Drop screenshots into `public/portfolio/` using these exact filenames and they'll show up automatically, no code changes needed:

- `public/portfolio/vynl.png`
- `public/portfolio/pro-scout-australia.png`
- `public/portfolio/lab-university-academy.png`
- `public/portfolio/flow-cooler.png`

Use a screenshot of the homepage, ideally around 1600x1000px or similar 16:10-ish proportions (they get cropped to fit, so it doesn't need to be exact). PNG or JPG both work.

JC Junk Hauling is the one exception: it already has a real before/after pair in place (`public/portfolio/jc-junk-hauling-before.png` and `jc-junk-hauling-after.png`), showing the outdated template site next to the rebuild. That project doesn't need an `image` entry since the before/after replaces the standard screenshot slot.

## Deployment

Connect the repo to Vercel and deploy. No environment variables are required for the current build (the contact API route only logs — add provider credentials once it's wired to a real email service).

```bash
npm run build
```

Vercel Analytics is already included via `@vercel/analytics/next` and activates automatically once deployed on Vercel.

## Verified locally

- `npx tsc --noEmit` — clean
- `npm run build` — succeeds, all routes compile
- `npx eslint .` — clean
- Contact form: manual POST to `/api/contact` tested for both success and validation-error paths
- Mobile viewport (375px): no horizontal overflow, mobile nav menu opens and shows all links
- All 5 portfolio links verified to point to the correct live URLs

Not yet verified: a human visual pass. Automated checks confirm the markup, links, and interactivity are correct, but no one has looked at the rendered page yet — do that before calling it done.
