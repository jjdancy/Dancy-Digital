import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 flex items-center">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 py-32 text-center">
          <p className="text-sm font-medium text-accent mb-4">404</p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">
            That page doesn&apos;t exist.
          </h1>
          <p className="text-foreground/70 max-w-md mx-auto mb-8">
            The link might be broken, or the page moved. Let&apos;s get you
            back to something real.
          </p>
          <a
            href="/"
            className="inline-flex items-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-ink transition-colors"
          >
            Back to home
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
