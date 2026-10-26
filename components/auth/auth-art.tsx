"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Draggable, PaperNote, Polaroid, TearOffCalendar, useFinePointer } from "@/components/landing/paper";
import { DraftNote } from "@/components/reminders/draft-note";
import { Shared, SHARED } from "@/components/shared/page-transition";
import type { CategoryKey } from "@/lib/categories";
import { EASE } from "@/lib/motion";
import type { ReminderDraft } from "@/lib/reminder-draft";
import { cn } from "@/lib/utils";

export type AuthArtKind = "signup" | "login" | "forgot" | "reset";

type Item =
  | { id: string; type: "note"; category: CategoryKey; text: string; small?: string; at: string; rotate: number; width?: string }
  | { id: string; type: "polaroid"; src: string; alt: string; caption: string; sub?: string; at: string; rotate: number }
  | { id: string; type: "calendar"; at: string; rotate: number };

const BOARDS: Record<AuthArtKind, { items: Item[]; caption: string }> = {
  signup: {
    caption: "One free account. Zero forgotten birthdays.",
    items: [
      { id: "mum", type: "polaroid", src: "/images/photos/mum-hug.webp", alt: "A mother and her grown-up daughter hugging", caption: "Mum’s birthday", sub: "12 May", at: "left-[7%] top-[8%]", rotate: -6 },
      { id: "trial", type: "note", category: "financial", text: "Netflix trial ends Friday", at: "right-[7%] top-[12%]", rotate: 5 },
      { id: "passport", type: "note", category: "documents", text: "Renew passport by March", at: "right-[12%] bottom-[12%]", rotate: -3 },
      { id: "uni", type: "note", category: "work", text: "Uni application, 30 June", at: "left-[14%] bottom-[9%]", rotate: 3 },
    ],
  },
  login: {
    caption: "Everything’s right where you left it.",
    items: [
      { id: "calendar", type: "calendar", at: "left-[11%] top-[11%]", rotate: -3 },
      { id: "roses", type: "polaroid", src: "/images/photos/roses.webp", alt: "A bouquet of pink roses", caption: "Our anniversary", sub: "21 June", at: "right-[7%] top-[26%]", rotate: 6 },
      { id: "hello", type: "note", category: "personal", text: "Welcome back! ♡", at: "left-[13%] bottom-[9%]", rotate: -5, width: "w-[230px]" },
    ],
  },
  forgot: {
    caption: "We’ll have you back in no time.",
    items: [
      {
        id: "happens",
        type: "note",
        category: "work",
        text: "Forgot your password? Happens to the best of us.",
        small: "(remembering things is kind of our job)",
        at: "left-[9%] top-[10%]",
        rotate: -3,
        width: "w-[290px]",
      },
      { id: "gran", type: "polaroid", src: "/images/photos/grandma.webp", alt: "A grandmother smiling with her family", caption: "Sunday call with Gran", at: "right-[7%] top-[34%]", rotate: 5 },
      { id: "spam", type: "note", category: "documents", text: "p.s. peek in your spam folder", at: "left-[14%] bottom-[8%]", rotate: -4 },
    ],
  },
  reset: {
    caption: "Nearly there.",
    items: [
      { id: "fresh", type: "note", category: "financial", text: "New password, fresh start.", at: "left-[10%] top-[12%]", rotate: -4, width: "w-[230px]" },
      { id: "mum", type: "note", category: "personal", text: "Mum’s birthday in 7 days 🎂", at: "left-[16%] bottom-[10%]", rotate: 3 },
      { id: "cake", type: "polaroid", src: "/images/photos/birthday-cake.webp", alt: "A birthday cake with lit candles", caption: "Back to the good stuff", at: "right-[8%] bottom-[10%]", rotate: 5 },
    ],
  },
};

/** Dotted desk. Must itself be the drag-constraints element (framer re-projects on resize relative to it). */
function Board({ className, children, ref }: { className?: string; children: React.ReactNode; ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-[540px] rounded-[36px] bg-surface-subtle bg-[radial-gradient(circle,var(--border-strong)_1px,transparent_1.5px)] bg-[length:22px_22px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Caption({ children, delay = 0.9 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE.outExpo, delay }}
      className="type-hand mt-5 text-center text-2xl text-muted"
    >
      {children}
    </motion.p>
  );
}

/** A small desk of paper things beside the form. Draggable with a mouse. */
export function AuthArt({ kind }: { kind: AuthArtKind }) {
  const boardRef = React.useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const { items, caption } = BOARDS[kind];
  const [order, setOrder] = React.useState(() => items.map((i) => i.id));
  const raise = (id: string) => setOrder((o) => [...o.filter((x) => x !== id), id]);

  return (
    <div>
      <Board ref={boardRef}>
          {items.map((item, i) => (
            <Draggable
              key={item.id}
              constraints={boardRef}
              enabled={fine}
              rotate={item.rotate}
              delay={0.25 + i * 0.12}
              className={item.at}
              z={order.indexOf(item.id) + 1}
              onPickUp={() => raise(item.id)}
            >
              {item.type === "note" && (
                <PaperNote category={item.category} className={cn("p-5", item.width ?? "w-[180px]")}>
                  <p className="type-hand text-[26px] leading-[1.05]">{item.text}</p>
                  {item.small && <p className="type-hand mt-3 text-[20px] text-ink/60">{item.small}</p>}
                </PaperNote>
              )}
              {item.type === "polaroid" && (
                <Polaroid src={item.src} alt={item.alt} caption={item.caption} sub={item.sub} className="w-[200px]" sizes="200px" />
              )}
              {item.type === "calendar" && <TearOffCalendar />}
            </Draggable>
          ))}
      </Board>
      <Caption>{caption}</Caption>
    </div>
  );
}

/**
 * The guest's reminder, held while they sign up or log in. Shares its
 * view-transition name with the wizard's note, so it flies over from the
 * "ready" screen and back into "saved".
 */
export function HeldDraft({ draft, compact = false }: { draft: ReminderDraft; compact?: boolean }) {
  if (compact) {
    return (
      <div className="mb-10">
        <Shared name={SHARED.draft}>
          <DraftNote draft={draft} size="compact" />
        </Shared>
        <p className="type-hand mt-3 text-lg text-muted">↑ safe and sound. We’re holding it for you</p>
      </div>
    );
  }
  return (
    <div>
      <Board className="flex items-center justify-center">
        <div className="w-full max-w-[340px]">
          <Shared name={SHARED.draft}>
            <DraftNote draft={draft} size="aside" />
          </Shared>
        </div>
      </Board>
      <Caption delay={0.5}>Safe and sound. We’re holding this for you.</Caption>
    </div>
  );
}
