"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { Eyebrow, FadeIn } from "@/components/shared/kinetic";
import { EASE } from "@/lib/motion";
import { DoodleArrow, Draggable, PaperNote, Polaroid, Squiggle, TearOffCalendar, useFinePointer } from "./paper";
import { QuickCapture } from "./quick-capture";

const NOTES = [
  {
    id: "passport",
    category: "documents",
    rotate: 5,
    pos: "right-[2%] top-[2%] sm:right-[6%]",
    text: <>Passport runs out in March!</>,
  },
  {
    id: "rent",
    category: "financial",
    rotate: 6,
    pos: "left-[4%] bottom-[8%] sm:left-[8%]",
    text: (
      <>
        Rent → the 28th
        <span className="mt-1 block text-[0.8em] text-ink/60">every month</span>
      </>
    ),
  },
  {
    id: "uni",
    category: "work",
    rotate: -4,
    pos: "right-[3%] bottom-[12%] sm:right-[5%]",
    text: <>Uni application due Friday!!</>,
  },
] as const;

const LINE = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE.outExpo, delay: 0.15 + i * 0.1 },
  }),
};

/**
 * Landing hero: a friendly headline + quick capture on the left, a little
 * board of paper reminders on the right you can pick up and move around.
 */
export function Hero() {
  const boardRef = React.useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const [order, setOrder] = React.useState<string[]>(["calendar", "mum", ...NOTES.map((n) => n.id)]);
  const lift = (id: string) => setOrder((o) => [...o.filter((x) => x !== id), id]);
  const z = (id: string) => 10 + order.indexOf(id);

  return (
    <section aria-labelledby="hero-heading" className="relative w-full overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <FadeIn immediate delay={0.05}>
            <Eyebrow>A friendly little reminder app</Eyebrow>
          </FadeIn>

          <h1 id="hero-heading" className="type-display mt-6 text-balance">
            <motion.span className="block" custom={0} variants={LINE} initial={reduce ? false : "hidden"} animate="show">
              Never forget
            </motion.span>
            <motion.span className="block" custom={1} variants={LINE} initial={reduce ? false : "hidden"} animate="show">
              what{" "}
              <span className="relative inline-block">
                <span className="type-serif pr-[0.06em]">matters.</span>
                <Squiggle delay={0.9} className="absolute -bottom-[0.08em] left-0 h-[0.18em] w-full text-ember" />
              </span>
            </motion.span>
          </h1>

          <FadeIn immediate delay={0.45}>
            <p className="type-body-lg mt-7 max-w-[32rem] text-pretty text-muted">
              Mum’s birthday. Your car insurance. That free trial you’ll <em>definitely</em> forget to cancel. Tell
              Rontee once, and we’ll give you a friendly nudge in plenty of time.
            </p>
          </FadeIn>

          <FadeIn immediate delay={0.6} className="mt-9 max-w-[32rem]">
            <QuickCapture />
          </FadeIn>

          <FadeIn immediate delay={0.75}>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {["Free to start", "No sign-up needed", "Takes about 10 seconds"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check size={15} strokeWidth={2.5} aria-hidden className="text-sage" />
                  {t}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* The board */}
        <div
          ref={boardRef}
          className="relative mx-auto h-[400px] w-full max-w-[520px] sm:h-[480px] lg:col-span-6 lg:h-[560px] lg:max-w-none"
        >
          <Draggable
            constraints={boardRef}
            enabled={fine}
            rotate={-2}
            delay={0.35}
            onPickUp={() => lift("calendar")}
            z={z("calendar")}
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <TearOffCalendar />
          </Draggable>

          <Draggable
            constraints={boardRef}
            enabled={fine}
            rotate={-7}
            delay={0.45}
            onPickUp={() => lift("mum")}
            z={z("mum")}
            className="top-[0%] left-[0%] sm:left-[3%]"
          >
            <Polaroid
              src="/images/photos/mum-hug.webp"
              alt="A mother and her grown-up daughter hugging and smiling"
              caption="Mum’s birthday"
              sub={
                <>
                  12th May <span className="text-ember">♥</span>
                </>
              }
              priority
              sizes="(min-width: 640px) 180px, 150px"
              className="w-[150px] sm:w-[180px]"
            />
          </Draggable>

          {NOTES.map((n, i) => (
            <Draggable
              key={n.id}
              constraints={boardRef}
              enabled={fine}
              rotate={n.rotate}
              delay={0.5 + i * 0.12}
              onPickUp={() => lift(n.id)}
              z={z(n.id)}
              className={n.pos}
            >
              <PaperNote category={n.category} className="w-[136px] sm:w-[164px]">
                <p className="type-hand text-[22px] sm:text-[25px]">{n.text}</p>
              </PaperNote>
            </Draggable>
          ))}

          {fine && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="pointer-events-none absolute top-[52%] left-[0%] hidden items-start gap-1 text-muted xl:flex"
              aria-hidden
            >
              <span className="type-hand -rotate-6 text-xl">psst… move us around</span>
              <DoodleArrow className="mt-3 h-8 w-12" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
