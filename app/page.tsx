import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MentalRelief } from "@/components/landing/mental-relief";
import { Navbar } from "@/components/landing/navbar";
import { WhatToRemember } from "@/components/landing/what-to-remember";

/**
 * Canonical final landing page, built section by section from Stitch.
 */
export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <HowItWorks />
        <WhatToRemember />
        <MentalRelief />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
