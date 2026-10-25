"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* MaskReveal — words rise out of a clipped line. Accepts segments so   */
/* a headline can mix Geist and serif-italic words.                     */
/* ------------------------------------------------------------------ */

export type RevealSegment = { text: string; className?: string };
export type RevealLine = ReadonlyArray<RevealSegment> | string;

type MaskRevealProps = {
  lines: ReadonlyArray<RevealLine>;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Animate on mount instead of on scroll into view. */
  immediate?: boolean;
};

export function MaskReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: MaskRevealProps) {
  const reduce = useReducedMotion();
  let wordIndex = 0;

  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      animate={immediate ? "show" : undefined}
      whileInView={immediate ? undefined : "show"}
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {lines.map((line, li) => {
        const segments: ReadonlyArray<RevealSegment> =
          typeof line === "string" ? [{ text: line }] : line;
        return (
          <span key={li} className={cn("block", lineClassName)}>
            {segments.map((seg, si) =>
              seg.text.split(" ").filter(Boolean).map((word, wi) => {
                const i = wordIndex++;
                return (
                  <React.Fragment key={`${si}-${wi}`}>
                    {/* pb/-mb keeps descenders + italic overhang inside the mask */}
                    <span className="inline-block overflow-hidden pr-[0.06em] pb-[0.12em] -mb-[0.12em] align-bottom">
                      <motion.span
                        className={cn("inline-block will-change-transform", seg.className)}
                        variants={{
                          hidden: reduce ? { opacity: 0 } : { y: "110%", rotate: 4 },
                          show: {
                            y: "0%",
                            rotate: 0,
                            opacity: 1,
                            transition: {
                              duration: reduce ? 0.01 : 1.0,
                              ease: EASE.outExpo,
                              delay: delay + i * stagger,
                            },
                          },
                        }}
                      >
                        {word}
                      </motion.span>
                    </span>{" "}
                  </React.Fragment>
                );
              }),
            )}
          </span>
        );
      })}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* FadeIn — small rise + blur-in. The default entrance for non-display  */
/* content.                                                             */
/* ------------------------------------------------------------------ */

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 16,
  immediate = false,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
  as?: "div" | "li" | "span" | "p";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  return (
    <Comp
      className={className}
      initial={hidden}
      animate={immediate ? shown : undefined}
      whileInView={immediate ? undefined : shown}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: reduce ? 0.01 : 0.9, ease: EASE.outExpo, delay }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — child drifts toward the pointer while hovered.            */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING.magnetic);
  const y = useSpring(0, SPRING.magnetic);

  return (
    <motion.div
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* SpotlightCard — a soft light + border glint follow the cursor.       */
/* ------------------------------------------------------------------ */

export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, color-mix(in oklab, var(--foreground) 6%, transparent), transparent 60%)`;
  const edge = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, color-mix(in oklab, var(--foreground) 22%, transparent), transparent 70%)`;

  return (
    <div
      className={cn(
        "group/spot relative isolate overflow-hidden rounded-[28px] border border-border bg-surface",
        className,
      )}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-400);
        my.set(-400);
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: glow }}
      />
      {/* 1px edge highlight: masked to the border ring only */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: edge,
          padding: 1,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow — "001 • HOW IT WORKS" mono label.                           */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "type-eyebrow inline-flex w-fit items-center gap-2 self-start rounded-full border border-border bg-surface/60 px-2.5 py-1.5 text-muted",
        className,
      )}
    >
      {index && <span className="text-faint">{index}</span>}
      <span aria-hidden className="size-1 rounded-full bg-foreground" />
      <span className="text-foreground">{children}</span>
    </span>
  );
}
