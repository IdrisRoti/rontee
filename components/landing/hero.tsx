import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ICON_SIZES } from "@/lib/icons";
import { Stagger, StaggerItem, Typewriter } from "@/components/shared/motion";
import { MemoryStage } from "./memory-stage";

const REASSURANCES = [
  "Reminders before you need them",
  "Gentle cues, zero alarm fatigue",
  "Effortless peace of mind",
] as const;

/**
 * Landing hero from the canonical final Stitch design:
 * centered editorial composition over a memory visualization stage.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <div className="mx-auto max-w-md px-4 pt-10 pb-16 sm:max-w-[1280px] sm:px-6 sm:pt-12 sm:pb-20 lg:px-8 lg:pt-16">
        <Stagger
          delay={0.05}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <div className="mb-3 sm:mb-4">
            <Typewriter
              text="Your personal memory assistant"
              delay={0.35}
              speed={34}
              className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase sm:text-xs"
            />
          </div>

          <StaggerItem>
            <h1
              id="hero-heading"
              className="text-[36px] leading-[1.12] font-extrabold tracking-[-0.035em] text-foreground sm:text-[52px] sm:leading-[1.08] lg:text-[68px]"
            >
              Never forget what matters.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed font-normal text-muted sm:mt-5 sm:text-lg lg:text-xl">
              Rontee remembers the important things, so you don&rsquo;t have
              to keep them in your head.
            </p>
          </StaggerItem>

          <StaggerItem className="w-full sm:w-auto">
            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
              <Button
                asChild
                className="w-full rounded-full px-6 py-3.5 text-[15px] shadow-elevated sm:w-auto sm:px-7 sm:hover:-translate-y-0.5"
              >
                <Link href="#cta">
                  Create a reminder
                  <ArrowRight size={ICON_SIZES.default} aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="group w-full rounded-full px-6 py-3 text-[14px] font-semibold sm:w-auto sm:py-3.5 sm:text-[15px]"
              >
                <Link href="#how-it-works">
                  See how it works
                  <ArrowRight
                    size={ICON_SIZES.default}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
            </div>
          </StaggerItem>

          <StaggerItem className="w-full sm:w-auto">
            <ul className="mt-5 flex w-full flex-col gap-2 px-1 text-left text-[12px] font-medium text-muted sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:gap-y-2 sm:px-0 sm:text-left sm:text-[13px]">
              {REASSURANCES.map((item, index) => (
                <li key={item} className="flex items-center gap-6">
                  {index > 0 && (
                    <span aria-hidden className="hidden text-border sm:inline">
                      ·
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>

        <MemoryStage />
      </div>
    </section>
  );
}
