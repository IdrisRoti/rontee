import Image from "next/image";
import { BadgeCheck, BellRing, Cake, CreditCard } from "lucide-react";

import { ICON_SIZES } from "@/lib/icons";
import { FadeUp, Meter, Typewriter } from "@/components/shared/motion";

/**
 * Editorial memory visualization stage from the canonical final Stitch hero.
 * Static preview only — no interactivity, no backend data.
 */
export function MemoryStage() {
  return (
    <FadeUp
      delay={0.35}
      y={32}
      className="relative mx-auto mt-8 flex w-full max-w-[1100px] flex-col gap-3 overflow-visible rounded-3xl bg-surface-subtle p-4 transition-colors sm:mt-12 lg:block lg:min-h-[540px] lg:items-center lg:justify-center lg:gap-0 lg:p-12 isolate"
    >
      {/* Ambient gentle glow inside stage — behind content on all breakpoints */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/3 -z-10 size-80 rounded-full bg-accent-subtle blur-3xl"
      />

      {/* Floating fragment: travel */}
      <FadeUp
        delay={0.55}
        y={20}
        className="absolute top-6 left-6 z-10 hidden lg:left-10 lg:block"
      >
        <div className="w-48 rotate-[-3deg] overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-elevated transition-transform duration-300 hover:rotate-0 hover:scale-105">
          <Image
            src="/images/passport.webp"
            alt="European passport with boarding pass beside a ceramic cup"
            width={384}
            height={256}
            className="h-32 w-full object-cover object-center"
          />
          <div className="bg-surface px-3 py-2 text-xs font-semibold text-foreground">
            Passports &amp; Travel
          </div>
        </div>
      </FadeUp>

      {/* Satellite: top-right (Passport Renewal) — stacked card on mobile */}
      <FadeUp
        delay={0.7}
        y={16}
        className="lg:absolute lg:top-4 lg:right-10 lg:z-20"
      >
        <div className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-surface p-3.5 shadow-elevated lg:w-[290px] lg:gap-3.5 lg:p-4 xl:w-[310px] lg:animate-float-slow">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent lg:size-10">
            <BadgeCheck size={18} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-[13px] font-bold text-foreground">
                Passport Renewal
              </span>
              <span className="shrink-0 text-[11px] font-semibold whitespace-nowrap text-accent">
                <span className="lg:hidden">6 mos prior</span>
                <span className="hidden lg:inline">6 months prior</span>
              </span>
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-muted lg:text-xs">
              <span className="lg:hidden">Expires Nov 14 · Alert sent calmly</span>
              <span className="hidden lg:inline">
                Expires Nov 14 · Alert sent smoothly
              </span>
            </span>
          </span>
        </div>
      </FadeUp>

      {/* Central reminder anchor: Dad's 60th Birthday */}
      <div className="relative z-10 w-full rounded-2xl border border-border/50 bg-surface p-5 shadow-elevated lg:mx-auto lg:max-w-[480px] lg:rounded-3xl lg:p-8">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 border-b border-border pb-3.5 lg:pb-5">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent lg:size-11 lg:rounded-2xl">
              <Cake size={20} aria-hidden className="lg:size-[22px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-wider text-muted uppercase lg:text-[11px]">
                Life Milestone
              </span>
              <span className="block truncate text-[17px] leading-snug font-bold text-foreground lg:text-xl lg:whitespace-normal">
                Dad&rsquo;s 60th Birthday
              </span>
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-accent-subtle px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-accent lg:px-3 lg:text-xs">
            In 12 days
          </span>
        </div>

        <div className="my-3.5 flex items-center justify-between rounded-xl bg-surface-subtle p-3 lg:my-5 lg:rounded-2xl lg:p-4">
          <span>
            <span className="block text-[10px] font-semibold tracking-wider text-muted uppercase lg:text-[11px]">
              Date
            </span>
            <span className="mt-0.5 block text-xs font-bold text-foreground lg:text-sm">
              September 28
            </span>
          </span>
          <span aria-hidden className="h-6 w-px bg-border lg:h-7" />
          <span>
            <span className="block text-[10px] font-semibold tracking-wider text-muted uppercase lg:text-[11px]">
              Cadence
            </span>
            <span className="mt-0.5 block text-xs font-bold text-foreground lg:text-sm">
              <span className="lg:hidden">Repeats yearly</span>
              <span className="hidden lg:inline">Repeats every year</span>
            </span>
          </span>
        </div>

        <div className="py-1">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-muted lg:mb-2.5 lg:text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-accent">
              <BellRing
                size={15}
                aria-hidden
                className="animate-icon-sway lg:size-4"
              />
              <span className="lg:hidden">Remind 7 days before</span>
              <span className="hidden lg:inline">Remind me 7 days before</span>
            </span>
            <span>Sep 21 notice</span>
          </div>
          <Meter
            value={72}
            trackClassName="relative h-1.5 w-full overflow-hidden rounded-full bg-border"
            barClassName="absolute top-0 bottom-0 left-0 rounded-full bg-accent"
            label="Reminder progress: notice arrives 7 days before September 28"
          />
        </div>

        <div className="mt-3.5 flex items-center gap-3 rounded-xl bg-surface-subtle p-3 lg:mt-5 lg:gap-3.5 lg:rounded-2xl lg:p-3.5">
          <Image
            src="/images/pen.webp"
            alt="Vintage vinyl record sleeve with fountain pen and handwritten notes"
            width={96}
            height={96}
            className="size-11 shrink-0 rounded-lg object-cover lg:size-12 lg:rounded-xl"
          />
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold text-accent lg:text-[11px]">
              Personal Note
            </span>
            <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted lg:text-xs lg:whitespace-normal">
              <span className="lg:hidden">
                <Typewriter
                  text="“Source vintage 1964 Miles Davis vinyl.”"
                  delay={1.1}
                  speed={22}
                />
              </span>
              <span className="hidden lg:inline">
                <Typewriter
                  text="“Source vintage 1964 Miles Davis vinyl & book harbor table.”"
                  delay={1.1}
                  speed={22}
                />
              </span>
            </span>
          </span>
        </div>
      </div>

      {/* Satellite: bottom-left (Netflix subscription) — stacked on mobile */}
      <FadeUp
        delay={0.85}
        y={16}
        className="lg:absolute lg:-bottom-4 lg:left-12 lg:z-20"
      >
        <div className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-surface p-3.5 shadow-elevated lg:w-[280px] lg:gap-3.5 lg:p-4 xl:w-[310px] lg:animate-float-delayed">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-foreground lg:size-10">
            <CreditCard size={ICON_SIZES.default} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-[13px] font-bold text-foreground">
                Netflix 4K Tier
              </span>
              <span className="shrink-0 text-xs font-bold text-foreground">
                $22.99
              </span>
            </span>
            <span className="mt-0.5 block truncate text-xs text-muted">
              Renews Sep 18 · Remind 2 days early
            </span>
          </span>
        </div>
      </FadeUp>

      {/* Quiet status indicator — centered row on mobile, floating on desktop */}
      <div className="mt-1 flex justify-center lg:absolute lg:-bottom-3 lg:right-6 lg:z-20 lg:mt-0 xl:right-14">
        <p className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[11px] font-medium text-background shadow-elevated lg:text-xs">
          <span className="size-1.5 rounded-full bg-accent" />
          A gentle reminder delivered calmly
        </p>
      </div>
    </FadeUp>
  );
}
