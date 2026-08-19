export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
        <p className="font-display text-foreground">
          Dancy<span className="text-accent">.</span>Digital
        </p>
        <p>Wilson &amp; Charlotte, NC - {new Date().getFullYear()}</p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:contact@dancydigital.com"
            className="hover:text-foreground transition-colors"
          >
            contact@dancydigital.com
          </a>
          <a
            href="tel:+17045790869"
            className="hover:text-foreground transition-colors"
          >
            (704) 579-0869
          </a>
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
