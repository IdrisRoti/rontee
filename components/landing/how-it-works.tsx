"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { Eyebrow, MaskReveal } from "@/components/shared/kinetic";
import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    n: "01",
    title: "Remember",
    body: "Say what matters in your own words. Pick a category if you like; nothing else is required.",
  },
  {
    n: "02",
    title: "When",
    body: "Choose the date, and whether it comes round every year, every month, or just once.",
  },
  {
    n: "03",
    title: "Remind me",
    body: "Decide how much notice you want. Rontee handles the email and push, then gets out of your way.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Mock screens                                                         */
/* ------------------------------------------------------------------ */

function useTyped(text: string, active: boolean, delay = 300) {
  const reduce = useReducedMotion();
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!active || reduce) return;
    let i = 0;
    let id = window.setTimeout(function tick() {
      i += 1;
      setN(i);
      if (i < text.length) id = window.setTimeout(tick, 55 + Math.random() * 45);
    }, delay);
    return () => window.clearTimeout(id);
  }, [active, reduce, text, delay]);
  return reduce || !active ? (active ? text : "") : text.slice(0, n);
}

function MockHeader({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-4">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1 rounded-full bg-foreground"
            animate={{ width: i === step ? 22 : 6, opacity: i <= step ? 1 : 0.18 }}
            transition={SPRING.snappy}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] tracking-wide text-muted uppercase">
        Step {step + 1} of 3 · {2 - step === 0 ? "last step" : `${2 - step} left`}
      </span>
    </div>
  );
}

function ScreenRemember({ active }: { active: boolean }) {
  const typed = useTyped("Mum’s birthday", active);
  const done = typed.length === "Mum’s birthday".length;
  return (
    <div className="p-5 sm:p-6">
      <p className="text-[22px] leading-tight font-medium tracking-[-0.03em]">What do you want to remember?</p>
      <div className="mt-5 flex h-12 items-center rounded-xl border border-border-strong bg-background px-4 text-[15px]">
        {typed}
        <span className="animate-caret text-foreground" />
      </div>
      <p className="mt-5 mb-2.5 text-xs text-muted">Category · optional</p>
      <div className="flex flex-wrap gap-1.5">
        {["Personal", "Financial", "Documents", "Work"].map((c, i) => {
          const selected = done && i === 0;
          return (
            <motion.span
              key={c}
              animate={{ scale: selected ? [1, 0.94, 1] : 1 }}
              transition={{ duration: 0.35 }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[13px] transition-colors duration-300",
                selected ? "border-foreground bg-foreground text-background" : "border-border text-muted",
              )}
            >
              {c}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

// May 2026 starts on a Friday → Monday-first offset of 4
const MAY_OFFSET = 4;

function ScreenWhen({ active }: { active: boolean }) {
  const [picked, setPicked] = React.useState(false);
  React.useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => setPicked(true), 450);
    return () => {
      window.clearTimeout(id);
      setPicked(false);
    };
  }, [active]);

  return (
    <div className="p-5 sm:p-6">
      <p className="text-[22px] leading-tight font-medium tracking-[-0.03em]">When is it?</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium">May 2026</span>
        <span className="font-mono text-[10px] text-faint uppercase">Sun · 12th</span>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="pb-1 font-mono text-[10px] text-faint">
            {d}
          </span>
        ))}
        {Array.from({ length: MAY_OFFSET }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: 31 }).map((_, i) => {
          const day = i + 1;
          const sel = picked && day === 12;
          return (
            <span
              key={day}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg text-[12px] transition-colors duration-300",
                sel ? "text-background" : "text-foreground/80",
              )}
            >
              {sel && (
                <motion.span
                  layoutId="cal-pick"
                  className="absolute inset-0 rounded-lg bg-foreground"
                  transition={SPRING.snappy}
                />
              )}
              <span className="relative">{day}</span>
              {sel && <span className="absolute top-1 right-1 size-1 rounded-full bg-ember" />}
            </span>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-3 rounded-xl bg-surface-subtle p-1 text-[13px]">
        {["Once", "Every year", "Monthly"].map((o, i) => (
          <span
            key={o}
            className={cn("relative rounded-lg py-1.5 text-center", picked && i === 1 ? "text-foreground" : "text-muted")}
          >
            {picked && i === 1 && (
              <motion.span
                layoutId="repeat-pick"
                className="absolute inset-0 rounded-lg bg-surface shadow-subtle"
                transition={SPRING.snappy}
              />
            )}
            <span className="relative">{o}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const OFFSETS = [
  { label: "1 month before", date: "Apr 12", on: false },
  { label: "1 week before", date: "May 5", on: true },
  { label: "1 day before", date: "May 11", on: true },
  { label: "On the day", date: "May 12", on: false },
];

function ScreenRemind({ active }: { active: boolean }) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const ids = [400, 800, 1300].map((t, i) => window.setTimeout(() => setCount(i + 1), t));
    return () => {
      ids.forEach(window.clearTimeout);
      setCount(0);
    };
  }, [active]);

  return (
    <div className="p-5 sm:p-6">
      <p className="text-[22px] leading-tight font-medium tracking-[-0.03em]">When should we remind you?</p>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
        {OFFSETS.map((o, i) => {
          const on = o.on && count >= (i === 1 ? 1 : 2);
          return (
            <li key={o.label} className="flex items-center gap-3 px-4 py-3">
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-md border transition-colors duration-300",
                  on ? "border-foreground bg-foreground text-background" : "border-border-strong",
                )}
              >
                <AnimatePresence>
                  {on && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={SPRING.snappy}>
                      <Check size={12} strokeWidth={3} aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="flex-1 text-[14px]">{o.label}</span>
              <span className="font-mono text-[11px] text-faint">{o.date}</span>
            </li>
          );
        })}
      </ul>
      <AnimatePresence>
        {count >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE.outExpo }}
            className="mt-4 flex items-center gap-2.5 rounded-xl bg-surface-subtle px-4 py-3 text-[13px]"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-ember" />
            All set. We’ll nudge you on May 5 and May 11.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SCREENS = [ScreenRemember, ScreenWhen, ScreenRemind];

function Device({ step, className }: { step: number; className?: string }) {
  const Screen = SCREENS[step];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-border bg-surface shadow-float",
        className,
      )}
    >
      <MockHeader step={step} />
      <div className="relative min-h-[392px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -24, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: EASE.outExpo }}
          >
            <Screen active />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Mobile/reduced-motion card: animates its own screen when scrolled into view. */
function StaticStep({ index }: { index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const Screen = SCREENS[index];
  const s = STEPS[index];
  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div>
        <span className="font-mono text-xs text-faint">{s.n}</span>
        <h3 className="type-h3 mt-1">{s.title}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.body}</p>
      </div>
      <div className="overflow-hidden rounded-[24px] border border-border bg-surface shadow-elevated">
        <MockHeader step={index} />
        <Screen active={inView} />
      </div>
    </div>
  );
}

/**
 * "How it works": on desktop the section pins and scroll scrubs through
 * the real three-step flow inside a live mock. Steps are clickable.
 */
export function HowItWorks() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<ScrollTrigger | null>(null);
  const [step, setStep] = React.useState(0);
  const progress = useMotionValue(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        triggerRef.current = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
            // Explicit: ScrollTrigger disables spacing when the parent is flex
            pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            progress.set(self.progress);
            const s = Math.min(2, Math.floor(self.progress * 3));
            setStep((prev) => (prev === s ? prev : s));
          },
        });
        return () => {
          triggerRef.current = null;
        };
      });
    },
    { scope: sectionRef },
  );

  const goTo = (i: number) => {
    const st = triggerRef.current;
    if (!st) return setStep(i);
    const y = st.start + ((i + 0.15) / 3) * (st.end - st.start);
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="how-it-works" aria-labelledby="how-heading" className="relative w-full">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[1320px] flex-col justify-center px-4 py-20 sm:px-8 lg:py-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-5">
            <Eyebrow index="001">How it works</Eyebrow>
            <h2 id="how-heading" className="type-h1 mt-6">
              <MaskReveal
                lines={[
                  [{ text: "Three steps." }],
                  [{ text: "Then forget", className: "type-serif" }],
                  [{ text: "about it.", className: "type-serif" }],
                ]}
              />
            </h2>

            {/* Desktop step list */}
            <ol className="relative mt-12 hidden flex-col gap-1 lg:flex">
              <span aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-border" />
              <motion.span
                aria-hidden
                className="absolute top-2 left-[19px] w-px origin-top bg-foreground"
                style={{ bottom: 8, scaleY: progress }}
              />
              {STEPS.map((s, i) => {
                const active = i === step;
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={active ? "step" : undefined}
                      className="group flex w-full gap-5 rounded-2xl py-4 pr-4 text-left"
                    >
                      <span
                        className={cn(
                          "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-all duration-500",
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-faint group-hover:text-foreground",
                        )}
                      >
                        {s.n}
                      </span>
                      <span className="pt-2">
                        <span
                          className={cn(
                            "block text-xl font-medium tracking-[-0.03em] transition-colors duration-500",
                            active ? "text-foreground" : "text-faint group-hover:text-muted",
                          )}
                        >
                          {s.title}
                        </span>
                        <motion.span
                          initial={false}
                          animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
                          transition={{ duration: 0.5, ease: EASE.outExpo }}
                          className="block overflow-hidden"
                        >
                          <span className="block max-w-sm pt-1.5 text-[15px] leading-relaxed text-muted">{s.body}</span>
                        </motion.span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Desktop live device */}
          <div className="relative hidden items-center justify-center lg:col-span-6 lg:col-start-7 lg:flex">
            <div aria-hidden className="bg-dots absolute -inset-10 rounded-[40px] opacity-70 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
            <Device step={step} className="relative w-full max-w-[440px]" />
          </div>

          {/* Mobile + tablet: stacked */}
          <div className="flex flex-col gap-14 lg:hidden">
            {STEPS.map((s, i) => (
              <StaticStep key={s.n} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
