"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Eyebrow, FadeIn, MaskReveal } from "@/components/shared/kinetic";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { PaperNote, Polaroid, useFinePointer } from "./paper";

type Item = {
  category: CategoryKey;
  text: string;
  sub: string;
  /** Optional photo — rendered as a polaroid instead of a sticky note. */
  photo?: { src: string; alt: string };
};

// Photos are scattered so each row has a print among the notes.
const NOTES: ReadonlyArray<Item> = [
  {
    category: "personal",
    text: "Dad’s 60th!!",
    sub: "Sep 28",
    photo: { src: "/images/photos/birthday-cake.webp", alt: "A birthday cake covered in sprinkles with lit candles" },
  },
  { category: "financial", text: "Cancel Netflix trial", sub: "before Friday" },
  { category: "work", text: "Tax return", sub: "due Jan 31" },
  {
    category: "documents",
    text: "Passport expires",
    sub: "March, renew early!",
    photo: { src: "/images/photos/passport.webp", alt: "Two passports lying on a wooden table" },
  },
  { category: "financial", text: "Car insurance", sub: "renews Aug 1" },
  {
    category: "personal",
    text: "Our anniversary",
    sub: "book somewhere nice",
    photo: { src: "/images/photos/roses.webp", alt: "A bouquet of pink roses and orange flowers" },
  },
  { category: "work", text: "Uni application", sub: "due Friday" },
  { category: "documents", text: "Visa renewal", sub: "Jan 15" },
  {
    category: "personal",
    text: "Call Grandma",
    sub: "every Sunday",
    photo: { src: "/images/photos/grandma.webp", alt: "A smiling grandmother cheek to cheek with her daughter" },
  },
  { category: "financial", text: "Rent", sub: "the 28th, every month" },
  { category: "documents", text: "Driving licence photo", sub: "update by June" },
  { category: "work", text: "Dentist check-up", sub: "Oct 2, 9am" },
];

// Fixed, hand-picked tilts so the wall looks pinned up by a person, not a grid.
const TILTS = [-4, 3, -2, 5, 2, -5, 4, -3, -1, 3, -4, 2];

/** "Big dates, little dates…" — a wall of handwritten notes, colour-coded by category. */
export function RememberWall() {
  const wallRef = React.useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();

  return (
    <section id="remember" aria-labelledby="remember-heading" className="px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <FadeIn>
            <Eyebrow dot="blush">What to remember</Eyebrow>
          </FadeIn>
          <h2 id="remember-heading" className="type-h1 mt-5">
            <MaskReveal
              lineClassName="text-balance"
              lines={[[{ text: "Big dates, little dates," }], [{ text: "and everything" }, { text: "in between.", className: "type-serif" }]]}
            />
          </h2>
        </div>

        <FadeIn delay={0.1}>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
              <li
                key={key}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm shadow-subtle"
              >
                <span className={cn("size-2.5 rounded-full", CATEGORIES[key].dot)} />
                <span className="font-medium">{CATEGORIES[key].label}</span>
                <span className="hidden text-muted sm:inline">· {CATEGORIES[key].hint}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <div
          ref={wallRef}
          className="relative mt-14 grid grid-cols-2 items-center justify-items-center gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-10"
        >
          {NOTES.map((n, i) => (
            <motion.div
              key={n.text}
              className={cn("w-full max-w-[200px]", fine && "cursor-grab touch-none active:cursor-grabbing")}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: TILTS[i] * 3, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, rotate: TILTS[i], y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: (i % 4) * 0.07 + Math.floor(i / 4) * 0.12 }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 20 }}
              drag={fine}
              dragConstraints={wallRef}
              dragElastic={0.2}
              whileDrag={{ scale: 1.1, rotate: 0, zIndex: 30 }}
            >
              {n.photo ? (
                <Polaroid
                  src={n.photo.src}
                  alt={n.photo.alt}
                  caption={
                    <span className="flex items-center gap-1.5">
                      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", CATEGORIES[n.category].dot)} />
                      {n.text}
                    </span>
                  }
                  sub={n.sub}
                  tape={i % 2 === 0}
                  sizes="(min-width: 640px) 200px, 45vw"
                />
              ) : (
                <PaperNote category={n.category} tape={i % 3 !== 1} className="min-h-[112px] sm:min-h-[124px]">
                  <p className="type-hand text-[24px] sm:text-[28px]">{n.text}</p>
                  <p className="type-hand mt-1 text-[18px] text-ink/60 sm:text-[20px]">{n.sub}</p>
                </PaperNote>
              )}
            </motion.div>
          ))}
        </div>

        <FadeIn>
          <p className="mx-auto mt-14 max-w-md text-center text-[15px] leading-relaxed text-muted">
            If it has a date, Rontee will look after it. You choose how much notice you get: a month, a week, a day,
            or all three.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
