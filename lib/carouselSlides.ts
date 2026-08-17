import { projects } from "@/lib/portfolio";

export type CarouselSlide = {
  id: string;
  name: string;
  image: string;
  url?: string;
  caption?: string;
};

/** Ready-made slides from the real client portfolio in lib/portfolio.ts. */
export function dancyPortfolioSlides(): CarouselSlide[] {
  const mapped: (CarouselSlide | null)[] = projects.map((p) => {
    const image = p.image;
    if (!image) return null;
    return { id: p.slug, name: p.name, image, url: p.url, caption: p.industry };
  });
  return mapped.filter((s): s is CarouselSlide => s !== null);
}
