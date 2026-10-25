import { FadeIn, MaskReveal } from "@/components/shared/kinetic";
import { QuickCapture } from "./quick-capture";

/** Dark closing act: one last, very easy way in. */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="relative px-4 pt-28 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
      <div className="mx-auto flex max-w-[880px] flex-col items-center text-center">
        <FadeIn>
          <span className="type-eyebrow inline-flex items-center gap-2 text-muted">
            <span className="size-1.5 rounded-full bg-ember" /> About ten seconds
          </span>
        </FadeIn>
        <h2 id="final-cta-heading" className="type-display mt-6">
          <MaskReveal lines={[[{ text: "Tell Rontee" }, { text: "once.", className: "type-serif" }]]} />
        </h2>
        <FadeIn delay={0.2}>
          <p className="type-body-lg mx-auto mt-6 max-w-md text-muted">
            Your first reminder doesn’t need an account. Write it down, pick a date, and let it go.
          </p>
        </FadeIn>
        <FadeIn delay={0.3} className="mt-10 w-full max-w-[560px] text-left">
          <QuickCapture id="final-capture" />
        </FadeIn>
      </div>
    </section>
  );
}
