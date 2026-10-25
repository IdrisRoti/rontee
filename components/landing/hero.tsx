"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { CalendarHeart } from "lucide-react";

import { FadeIn, MaskReveal } from "@/components/shared/kinetic";
import { LogoMark } from "@/components/shared/logo";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { QuickCapture } from "./quick-capture";
import { MemoryOrb } from "./visuals/memory-orb";

/** Parallax layer: drifts against the pointer by `depth`, floats on entry. */
function FloatingCard({
  children,
  className,
  depth,
  px,
  py,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  depth: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
  delay: number;
}) {
  const x = useTransform(px, (v) => v * depth * -28);
  const y = useTransform(py, (v) => v * depth * -20);
  return (
    <motion.div style={{ x, y }} className={cn("absolute", className)}>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.94, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE.outExpo, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function CountdownCard() {
  return (
    <div className="flex w-[264px] items-center gap-3 rounded-2xl border border-border bg-surface/90 p-3 pr-4 shadow-float backdrop-blur-md">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-foreground">
        <CalendarHeart size={18} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium tracking-tight">Mum’s birthday</span>
        <span className="block truncate text-xs text-muted">Sun, May 12 · every year</span>
      </span>
      <span className="text-right">
        <span className="block font-mono text-xl leading-none font-medium tracking-tight">07</span>
        <span className="type-eyebrow text-[9px] text-faint">days</span>
      </span>
    </div>
  );
}

function NotificationCard() {
  return (
    <div className="w-[300px] rounded-2xl border border-border bg-surface/90 p-3.5 shadow-float backdrop-blur-md">
      <div className="mb-2 flex items-center gap-2">
        <LogoMark className="size-5" />
        <span className="text-xs font-medium">Rontee</span>
        <span className="ml-auto font-mono text-[10px] text-faint">now</span>
      </div>
      <p className="text-[13px] leading-snug text-foreground">
        Your passport expires in 6 months. Renewals take about 8 weeks, so this week is a good time to start.
      </p>
    </div>
  );
}

function TrialChip() {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-surface/90 py-2 pr-4 pl-3 shadow-float backdrop-blur-md">
      <span className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-ember animate-pulse-ring" />
        <span className="relative size-2 rounded-full bg-ember" />
      </span>
      <span className="text-[13px] font-medium tracking-tight">Netflix trial ends tomorrow</span>
    </div>
  );
}

/**
 * Landing hero: editorial two-tone headline + quick capture on the left,
 * the WebGL memory orb with floating reminder previews on the right.
 */
export function Hero() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 18 });
  const py = useSpring(rawY, { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -160]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        rawX.set((e.clientX / window.innerWidth) * 2 - 1);
        rawY.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden pt-28 sm:pt-32"
    >
      {/* Soft vignette so the orb melts into the paper */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_55%_at_72%_45%,color-mix(in_oklab,var(--surface)_80%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto grid w-full max-w-[1320px] flex-1 grid-cols-1 items-center gap-6 px-4 sm:px-8 lg:grid-cols-12 lg:gap-0">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 lg:col-span-7">
          <FadeIn immediate delay={0.1}>
            <span className="type-eyebrow inline-flex items-center gap-2 text-muted">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 rounded-full bg-ember animate-pulse-ring" />
                <span className="relative size-1.5 rounded-full bg-ember" />
              </span>
              Your personal memory assistant
            </span>
          </FadeIn>

          <h1 id="hero-heading" className="type-display mt-6 text-balance">
            <MaskReveal
              immediate
              delay={0.2}
              lines={[
                [{ text: "Never forget", className: "text-faint" }],
                [
                  { text: "what" },
                  { text: "matters.", className: "type-serif pr-[0.08em]" },
                ],
              ]}
            />
          </h1>

          <FadeIn immediate delay={0.75}>
            <p className="type-body-lg mt-6 max-w-[34rem] text-pretty text-muted">
              Birthdays, renewals, free trials, deadlines. Tell Rontee once and it reminds you with enough time to
              actually do something about it.
            </p>
          </FadeIn>

          <FadeIn immediate delay={0.95} className="mt-9 max-w-[34rem]">
            <QuickCapture />
          </FadeIn>

          <FadeIn immediate delay={1.15}>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] tracking-wide text-faint uppercase">
              <span>No account needed</span>
              <span aria-hidden>/</span>
              <span>Email + push</span>
              <span aria-hidden>/</span>
              <span>Free to start</span>
            </p>
          </FadeIn>
        </motion.div>

        {/* Orb stage */}
        <div className="relative h-[380px] sm:h-[480px] lg:absolute lg:inset-y-0 lg:right-[-6%] lg:h-auto lg:w-[62%]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.2, ease: EASE.outExpo, delay: 0.1 }}
            className="absolute inset-0"
          >
            <MemoryOrb className="size-full" scrollTarget={sectionRef} />
          </motion.div>

          <motion.div style={{ y: cardsY }} className="pointer-events-none absolute inset-0 hidden lg:block">
            <FloatingCard px={px} py={py} depth={1.2} delay={1.3} className="top-[22%] left-[12%]">
              <CountdownCard />
            </FloatingCard>
            <FloatingCard px={px} py={py} depth={0.7} delay={1.5} className="top-[16%] right-[16%]">
              <TrialChip />
            </FloatingCard>
            <FloatingCard px={px} py={py} depth={1.6} delay={1.7} className="right-[14%] bottom-[20%]">
              <NotificationCard />
            </FloatingCard>
          </motion.div>

          {/* Mobile: a single preview card anchored to the orb */}
          <div className="absolute inset-x-0 bottom-6 flex justify-center lg:hidden">
            <FadeIn immediate delay={1.2}>
              <CountdownCard />
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Editorial footer row */}
      <div className="relative z-10 mx-auto mt-6 flex w-full max-w-[1320px] items-end justify-between px-4 pb-6 font-mono text-[11px] tracking-wide text-faint uppercase sm:px-8">
        <span className="hidden sm:inline">Built for people, not productivity</span>
        <span className="sm:hidden">Est. 2026</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="flex items-center gap-2"
        >
          <span>[ Scroll ]</span>
          <motion.span
            aria-hidden
            className="block h-3 w-px bg-faint"
            animate={reduce ? undefined : { scaleY: [0, 1, 0], originY: [0, 0, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      </div>
    </section>
  );
}
