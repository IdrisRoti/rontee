import type { Metadata } from "next";

import { Faq } from "@/components/landing/faq";
import { FAQS } from "@/components/landing/faq-data";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Manifesto } from "@/components/landing/manifesto";
import { Marquee } from "@/components/landing/marquee";
import { Navbar } from "@/components/landing/navbar";
import { Unburden } from "@/components/landing/unburden";
import { UseCases } from "@/components/landing/use-cases";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: `${site.url}/icon.svg`,
      slogan: site.tagline,
    },
    {
      "@type": "WebApplication",
      name: site.name,
      url: site.url,
      description: site.description,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any (web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${site.url}/#organization` },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

/**
 * Landing: light editorial page with two dark cinematic acts
 * (Unburden, closing CTA + footer). Lenis smooth scroll is scoped here.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main className="block w-full">
        <Hero />
        <Marquee />
        <Manifesto />
        <HowItWorks />
        <Unburden />
        <UseCases />
        <Faq />
      </main>
      <div className="scheme-dark grain relative">
        <FinalCta />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
