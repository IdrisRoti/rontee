"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

import { Eyebrow, FadeIn, MaskReveal } from "@/components/shared/kinetic";
import { LogoMark } from "@/components/shared/logo";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PaperNote } from "./paper";

/** Types `text` once `active` turns true. */
function useTyped(text: string, active: boolean, delay = 400) {
  const reduce = useReducedMotion();
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!active || reduce) return;
    let i = 0;
    let id = window.setTimeout(function tick() {
      i += 1;
      setN(i);
      if (i < text.length) id = window.setTimeout(tick, 70 + Math.random() * 60);
    }, delay);
    return () => window.clearTimeout(id);
  }, [active, reduce, text, delay]);
  if (reduce) return text;
  return text.slice(0, n);
}

/* 1 — a note writes itself */
function JotIllustration({ active }: { active: boolean }) {
  const typed = useTyped("Mum’s birthday", active);
  return (
    <PaperNote category="personal" className="w-[190px] -rotate-3">
      <p className="type-hand min-h-[2.2em] text-[30px]">
        {typed}
        <span className="animate-caret ml-0.5 text-ink/60" />
      </p>
    </PaperNote>
  );
}

/* 2 — the 12th gets circled */
function DayIllustration({ active }: { active: boolean }) {
  const days = Array.from({ length: 14 }, (_, i) => i + 5);
  return (
    <div className="w-[214px] rotate-2 rounded-[10px] bg-[#fffdf6] dark:bg-[#ece3d2] p-3 text-ink shadow-paper">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-sm font-semibold">May</span>
        <span className="type-hand text-lg text-ink/60">every year</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
        {days.map((d) => (
          <span key={d} className="relative flex aspect-square items-center justify-center">
            {d === 12 && (
              <svg viewBox="0 0 40 40" className="absolute -inset-1 text-ember" aria-hidden>
                <motion.path
                  d="M20 4c9 0 16 6 16 15s-7 16-17 16S4 29 4 20 11 5 22 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={active ? { pathLength: 1 } : undefined}
                  transition={{ duration: 0.7, ease: EASE.outQuart, delay: 0.5 }}
                />
              </svg>
            )}
            <span className={cn("relative", d === 12 && "font-semibold")}>{d}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* 3 — the one product moment: a friendly nudge */
function NudgeIllustration({ active }: { active: boolean }) {
  return (
    <div className="relative h-[120px] w-[250px]">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.5 }}
            className="absolute inset-x-0 top-2 rounded-2xl border border-border bg-surface p-3.5 text-left shadow-float"
          >
            <div className="flex items-center gap-2">
              <LogoMark className="size-5" />
              <span className="text-xs font-semibold">Rontee</span>
              <span className="ml-auto text-[11px] text-faint">now</span>
            </div>
            <p className="mt-1.5 text-[13.5px] leading-snug">
              Mum’s birthday is in 7 days 🎂 Maybe order that scarf she liked?
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Jot it down",
    body: "Write it like you’d tell a friend. “Mum’s birthday”, “cancel Netflix”. That’s it.",
    tint: "bg-blush/35",
    Art: JotIllustration,
  },
  {
    n: "2",
    title: "Pick the day",
    body: "Choose the date, and whether it comes round every year, every month, or just once.",
    tint: "bg-sky/35",
    Art: DayIllustration,
  },
  {
    n: "3",
    title: "We’ll give you a nudge",
    body: "By email and on your phone, early enough to actually do something about it.",
    tint: "bg-butter/40",
    Art: NudgeIllustration,
  },
] as const;

function StepCard({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = React.useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const { Art } = step;
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE.outExpo, delay: index * 0.1 }}
      whileHover={{ y: -6, rotate: index === 1 ? 0.6 : -0.6 }}
      className="flex flex-col overflow-hidden rounded-[28px] border border-border bg-surface shadow-subtle"
    >
      <div className={cn("flex h-[220px] items-center justify-center", step.tint)}>
        <Art active={inView} />
      </div>
      <div className="flex gap-4 p-6 sm:p-7">
        <span className="type-serif text-4xl leading-none text-ember">{step.n}</span>
        <div>
          <h3 className="type-h3">{step.title}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{step.body}</p>
        </div>
      </div>
    </motion.li>
  );
}

/** Three friendly steps, each with a small live illustration. */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <FadeIn>
            <Eyebrow dot="sky">How it works</Eyebrow>
          </FadeIn>
          <h2 id="how-heading" className="type-h1 mt-5">
            <MaskReveal lines={[[{ text: "As easy as telling" }], [{ text: "a friend.", className: "type-serif" }]]} />
          </h2>
          <FadeIn delay={0.1}>
            <p className="type-body-lg mt-5 text-muted">Three little steps, then you can stop worrying about it.</p>
          </FadeIn>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {STEPS.map((s, i) => (
            <StepCard key={s.n} step={s} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
