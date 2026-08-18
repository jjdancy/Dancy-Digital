import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy - Dancy Digital",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 sm:px-8 pt-32 pb-24">
          <h1 className="font-display text-4xl tracking-tight mb-8">
            Privacy
          </h1>

          <div className="space-y-6 text-foreground/70 leading-relaxed">
            <p>
              Short version: we don&apos;t sell your data, we don&apos;t
              track you across the web, and we only use what you send us to
              answer you.
            </p>

            <div>
              <h2 className="font-display text-lg text-foreground mb-2">
                What we collect
              </h2>
              <p>
                When you use the contact form, we collect your name, email,
                and whatever message you send. That&apos;s it, that&apos;s
                the whole form.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-2">
                What we do with it
              </h2>
              <p>
                Your message is emailed directly to us so we can reply to
                your inquiry. We don&apos;t add you to a mailing list,
                share it with third parties, or use it for anything besides
                getting back to you.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-2">
                Analytics
              </h2>
              <p>
                We use Vercel Analytics to see how many people visit the
                site and which pages they land on. It&apos;s cookieless and
                doesn&apos;t track you individually, we just see aggregate
                numbers.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-2">
                Questions
              </h2>
              <p>
                If you want your info deleted or have any questions about
                this, email{" "}
                <a
                  href="mailto:jjdancy0@gmail.com"
                  className="text-foreground underline hover:text-accent transition-colors"
                >
                  jjdancy0@gmail.com
                </a>{" "}
                and we&apos;ll sort it out.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
