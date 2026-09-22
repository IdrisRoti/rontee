import { BellOff, NotebookPen, SlidersHorizontal } from "lucide-react";

import { Reveal, Typewriter } from "@/components/shared/motion";

const STEPS = [
  {
    number: "01",
    title: "Remember",
    description:
      "Tell Rontee what you don\u2019t want to forget in your own words.",
    Icon: NotebookPen,
    preview: (
      <div className="flex items-center gap-2 rounded-xl bg-surface-subtle px-3.5 py-2.5 text-xs font-medium text-foreground sm:px-4 sm:py-3 sm:text-sm">
        <span aria-hidden className="text-base leading-none text-accent sm:text-lg">
          &ldquo;
        </span>
        <span className="truncate">
          <Typewriter
            text="Dad’s 60th birthday on September 28th"
            delay={0.3}
            speed={30}
          />
        </span>
      </div>
    ),
  },
  {
    number: "02",
    title: "Set it once",
    description:
      "Choose when you want Rontee to remind you, with room to plan ahead.",
    Icon: SlidersHorizontal,
    preview: (
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground sm:px-3.5 sm:py-1.5 sm:text-xs">
          7 days prior
        </span>
        <span className="rounded-full bg-surface-subtle px-3 py-1 text-[11px] font-medium text-muted sm:px-3.5 sm:py-1.5 sm:text-xs">
          1 month prior
        </span>
        <span className="rounded-full bg-surface-subtle px-3 py-1 text-[11px] font-medium text-muted sm:px-3.5 sm:py-1.5 sm:text-xs">
          Custom window
        </span>
      </div>
    ),
  },
  {
    number: "03",
    title: "Forget about it",
    description:
      "Rontee keeps track in the background and reminds you when it matters.",
    Icon: BellOff,
    preview: (
      <p className="rounded-xl bg-surface-subtle p-2.5 text-[11px] leading-relaxed text-muted sm:p-3 sm:text-xs">
        <Typewriter
          text="“Gentle reminder: Dad’s birthday is in 7 days. Time to plan dinner.”"
          delay={0.3}
          speed={18}
        />
      </p>
    ),
  },
] as const;

/**
 * "A quieter way to remember" — canonical How It Works.
 * Mobile: stacked cards. Desktop: connected 3-column flow with dividers.
 */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-t border-border px-4 py-14 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="mb-8 sm:mb-16 sm:flex sm:flex-col sm:gap-6 sm:text-left md:flex-row md:items-end md:justify-between">
          <h2
            id="how-it-works-heading"
            className="text-2xl font-extrabold tracking-[-0.03em] text-foreground sm:text-3xl lg:text-4xl"
          >
            A quieter way to remember.
          </h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted sm:mt-0 sm:text-base">
            Three simple steps to lift recurring dates completely off your mind.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-0">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.number}
              delay={index * 0.1}
              className={
                "flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-subtle " +
                "md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none " +
                (index === 0
                  ? "md:pr-12"
                  : index === 1
                    ? "md:border-x md:border-border md:px-12"
                    : "md:pl-12")
              }
            >
              <div>
                <div className="mb-4 flex items-center justify-between sm:mb-6">
                  <span
                    aria-hidden
                    className="text-3xl font-extrabold tracking-tight text-border select-none sm:text-5xl"
                  >
                    {step.number}
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent-subtle text-accent sm:size-9">
                    <step.Icon size={18} aria-hidden className="sm:size-[19px]" />
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted sm:mt-2 sm:text-[15px]">
                  {step.description}
                </p>
              </div>
              <div className="mt-4 sm:mt-8 sm:pt-2">{step.preview}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
