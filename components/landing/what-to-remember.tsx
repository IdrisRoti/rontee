import Image from "next/image";
import { CalendarDays, ReceiptText, Repeat } from "lucide-react";

import { Reveal, Meter, Typewriter } from "@/components/shared/motion";

const CATEGORIES = [
  {
    title: "Subscriptions & Free Trials",
    description: "Cancel before auto-billing clears.",
    longDescription:
      "Streaming services, software renewals, and trials before unwanted charges.",
    buffer: "48h prior",
    bufferAccent: true,
    Icon: Repeat,
  },
  {
    title: "Payments & Taxes",
    description: "Insurance, property taxes, quarterly.",
    longDescription:
      "Car insurance, property tax, quarterly filings, and annual reviews.",
    buffer: "3 wks prior",
    bufferAccent: true,
    Icon: ReceiptText,
  },
  {
    title: "Work Milestones & Cycles",
    description: "Accreditations, renewals, reviews.",
    longDescription:
      "License accreditations, client check-ins, domain renewals, and goals.",
    buffer: "Custom",
    bufferAccent: false,
    Icon: CalendarDays,
  },
] as const;

/**
 * "Remember the things that matter" — canonical editorial gallery.
 * Mobile: stacked cards. Desktop: asymmetric mosaic + quiet category row.
 */
export function WhatToRemember() {
  return (
    <section
      id="what-to-remember"
      aria-labelledby="what-to-remember-heading"
      className="mx-auto max-w-md border-t border-border px-4 py-14 sm:max-w-[1280px] sm:px-8 sm:py-24"
    >
      <Reveal className="mb-8 max-w-2xl sm:mb-14">
        <h2
          id="what-to-remember-heading"
          className="text-2xl font-extrabold tracking-[-0.03em] text-foreground sm:text-3xl lg:text-4xl"
        >
          Remember the things that matter.
        </h2>
        <p className="mt-1 text-sm leading-relaxed font-normal text-muted sm:mt-2 sm:text-lg">
          Birthdays, renewals, payments, deadlines, and everything in between.
        </p>
      </Reveal>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8">
        {/* Feature 1: Life Milestones */}
        <Reveal className="lg:col-span-7" delay={0}>
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-surface-subtle transition-colors">
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="mb-2 flex items-center justify-between sm:mb-4">
                <span className="text-[11px] font-semibold text-accent sm:text-xs">
                  Life Milestones
                </span>
                <span className="text-[11px] text-muted sm:text-xs">
                  Repeats annually
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                A home for the moments you cherish.
              </h3>
              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted sm:mt-3 sm:text-[15px]">
                Dad&rsquo;s 60th birthday, 35th wedding anniversary,
                godchildren celebrations, and family remembrances.
              </p>
            </div>
            <div className="px-5 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
              <div className="relative h-44 overflow-hidden rounded-2xl sm:h-64 lg:h-72">
                <Image
                  src="/images/dads_birthday.webp"
                  alt="Art-directed memory collage: family photograph, handwritten letter, passport and train ticket"
                  width={1200}
                  height={896}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute right-2 bottom-2 left-2 flex items-center justify-between rounded-xl bg-surface/95 px-3 py-2 text-[11px] text-foreground backdrop-blur-sm sm:right-3 sm:bottom-3 sm:left-3 sm:px-4 sm:py-2.5 sm:text-xs">
                  <span className="mr-2 truncate italic">
                    <Typewriter
                      text="“Attached note: He mentioned wanting a 1964 Miles Davis vinyl.”"
                      delay={0.4}
                      speed={26}
                    />
                  </span>
                  <span className="ml-3 shrink-0 font-semibold text-accent">
                    14-day notice
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Feature 2: Official Documents */}
        <Reveal className="lg:col-span-5" delay={0.1}>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-5 transition-colors sm:p-8 lg:p-10">
            <div>
              <div className="mb-2 flex items-center justify-between sm:mb-4">
                <span className="text-[11px] font-semibold text-accent sm:text-xs">
                  Official Documents
                </span>
                <span className="text-[11px] text-muted sm:text-xs">
                  6 months notice
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Official Documents &amp; Renewals
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted sm:mt-2 sm:text-sm">
                Passport expirations, licenses, leases, and registrations
                alerts well in advance.
              </p>
              <div className="relative mt-4 h-36 overflow-hidden rounded-2xl sm:h-44">
                <Image
                  src="/images/passport.webp"
                  alt="European passport with boarding pass beside a ceramic cup"
                  width={1200}
                  height={896}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-white sm:p-4">
                  <div className="mb-1 flex items-center justify-between text-[11px] font-bold sm:mb-1.5 sm:text-xs">
                    <span>Passport Expiry: Oct 2026</span>
                    <span className="text-accent-subtle">Trigger: Apr 2026</span>
                  </div>
                  <Meter
                    value={58}
                    trackClassName="relative h-1.5 w-full overflow-hidden rounded-full bg-white/30"
                    barClassName="absolute top-0 bottom-0 left-0 rounded-full bg-accent"
                    label="Passport renewal buffer progress"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted sm:mt-6 sm:pt-5 sm:text-xs">
              <span>6-month buffer active</span>
              <span className="font-medium text-foreground">
                Calendar sync ready
              </span>
            </div>
          </div>
        </Reveal>

        {/* Lower categories */}
        <div className="flex flex-col gap-3 pt-2 md:grid md:grid-cols-3 md:gap-8 md:border-t md:border-border md:pt-6 lg:col-span-12">
          {CATEGORIES.map((cat, index) => (
            <Reveal
              key={cat.title}
              delay={index * 0.08}
              className={
                "flex flex-wrap items-center gap-x-3 rounded-2xl border border-border bg-surface p-4 " +
                "md:items-center md:rounded-none md:bg-transparent md:p-0 md:py-2 " +
                (index === 1
                  ? "md:border-x md:border-y-0 md:border-border md:px-4"
                  : "md:border-0")
              }
            >
              <span className="order-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-subtle text-accent">
                <cat.Icon size={18} aria-hidden />
              </span>
              <span
                className={
                  "order-3 shrink-0 text-[11px] font-semibold md:order-2 md:ml-auto md:text-xs " +
                  (cat.bufferAccent ? "text-accent" : "text-muted")
                }
              >
                {cat.buffer}
              </span>
              <span className="order-2 min-w-0 flex-1 md:order-3 md:mt-3 md:basis-full md:flex-none">
                <span className="block truncate text-sm font-bold text-foreground md:text-base md:whitespace-normal">
                  {cat.title}
                </span>
                <span className="block truncate text-[11px] text-muted md:text-xs md:whitespace-normal md:leading-relaxed">
                  <span className="md:hidden">{cat.description}</span>
                  <span className="hidden md:inline">
                    {cat.longDescription}
                  </span>
                </span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
