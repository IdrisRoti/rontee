import { ArrowDown, ArrowRight } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";

const NOISE = [
  {
    text: "Car inspection?",
    chip: "bg-[#FFF9D2] text-[#715B00]",
    align: "self-start",
    rotate: -2,
  },
  {
    text: "Girlfriend's birthday??",
    chip: "bg-[#FFE8E8] text-[#8C1D18]",
    align: "self-end",
    rotate: 1.5,
  },
  {
    text: "Passport expired??",
    chip: "bg-[#EBEBFF] text-[#292D73]",
    align: "self-start",
    rotate: 0,
  },
] as const;

/**
 * "Put it out of your head" — mental noise vs peace of mind.
 * Mobile: vertical flow with downward arrow. Desktop: side-by-side.
 */
export function MentalRelief() {
  return (
    <section
      aria-labelledby="mental-relief-heading"
      className="mx-auto max-w-md border-t border-border px-4 py-14 sm:max-w-[1280px] sm:px-8 sm:py-24"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2
          id="mental-relief-heading"
          className="text-2xl font-extrabold tracking-[-0.035em] text-foreground sm:text-3xl lg:text-5xl"
        >
          Put it out of your head.
        </h2>
        <p className="mt-2 text-sm leading-relaxed font-normal text-muted sm:mt-4 sm:text-lg lg:text-xl">
          You shouldn&rsquo;t have to constantly remember every important date.
          Tell Rontee once, and let it take care of the remembering.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-8 sm:mt-14">
        <div className="flex flex-col gap-4 rounded-3xl bg-surface-subtle p-5 transition-colors sm:p-8 md:grid md:grid-cols-12 md:items-center md:gap-8 lg:p-12">
          {/* Mental noise */}
          <div className="text-left md:col-span-5">
            <span className="mb-2 block text-[10px] font-semibold tracking-wider text-muted uppercase sm:text-[11px]">
              Mental noise
            </span>
            <Stagger scroll gap={0.18} className="flex flex-col gap-2">
              {NOISE.map((note) => (
                <StaggerItem
                  key={note.text}
                  y={-64}
                  rotate={note.rotate}
                  className={note.align}
                >
                  <span
                    className={
                      "inline-block rounded-md px-3 py-1.5 text-xs font-semibold shadow-subtle " +
                      note.chip
                    }
                  >
                    {note.text}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Transition arrow */}
          <div className="flex justify-center py-1 md:col-span-2 md:py-0">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-surface text-accent shadow-subtle sm:size-10">
              <ArrowDown
                size={20}
                aria-hidden
                className="animate-arrow-y md:hidden"
              />
              <ArrowRight
                size={20}
                aria-hidden
                className="animate-arrow-x hidden md:block"
              />
            </span>
          </div>

          {/* Peace of mind */}
          <div className="rounded-2xl border border-border bg-surface p-4 text-left sm:p-6 md:col-span-5">
            <span className="mb-1 block text-[10px] font-semibold tracking-wider text-accent uppercase sm:mb-2 sm:text-[11px]">
              Peace of mind with Rontee
            </span>
            <p className="text-sm font-bold text-foreground">
              A single, tranquil memory track.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Everything accounted for. Mind at rest.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
