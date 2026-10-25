import { FadeIn, MaskReveal } from "@/components/shared/kinetic";
import { PaperNote, Polaroid } from "./paper";
import { QuickCapture } from "./quick-capture";

/** Closing invitation: a big butter-yellow card with a couple of notes peeking in. */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="px-4 py-16 sm:px-8 sm:py-24">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[36px] bg-butter px-5 py-16 text-ink sm:px-10 sm:py-24">
        {/* Peeking notes (decorative) */}
        <div aria-hidden className="pointer-events-none absolute top-12 left-12 hidden rotate-[-8deg] lg:block">
          <Polaroid
            src="/images/photos/mum-child.webp"
            alt=""
            caption="First day of school!"
            sizes="176px"
            className="w-44"
          />
        </div>
        <div aria-hidden className="pointer-events-none absolute right-12 bottom-14 hidden rotate-[7deg] lg:block">
          <PaperNote category="documents" className="w-48">
            <p className="type-hand text-2xl">Renew passport</p>
          </PaperNote>
        </div>

        <div className="relative mx-auto flex max-w-[640px] flex-col items-center text-center">
          <h2 id="final-cta-heading" className="type-h1">
            <MaskReveal
              lineClassName="text-balance"
              lines={[[{ text: "Go on, what don’t" }], [{ text: "you want to forget?", className: "type-serif" }]]}
            />
          </h2>
          <FadeIn delay={0.15}>
            <p className="type-body-lg mx-auto mt-5 max-w-md text-ink/70">
              Your first reminder is on us, no account needed. Write it down and let it go.
            </p>
          </FadeIn>
          <FadeIn delay={0.25} className="mt-9 w-full text-left">
            <QuickCapture id="final-capture" showSuggestions={false} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
