"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* PaperNote — a sticky note in a category colour, with optional tape.  */
/* ------------------------------------------------------------------ */

type PaperNoteProps = {
  category?: CategoryKey | "plain";
  tape?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function PaperNote({ category = "plain", tape = true, className, children }: PaperNoteProps) {
  const bg = category === "plain" ? "bg-[#fffdf6] dark:bg-[#ece3d2]" : CATEGORIES[category].bg;
  return (
    <div className={cn("relative rounded-[6px] p-4 text-ink shadow-paper", bg, className)}>
      {/* Paper sheen + a faint folded corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(165deg,rgb(255_255_255/0.4),transparent_45%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-5 rounded-tl-[6px] bg-black/[0.07] [clip-path:polygon(100%_0,0_100%,100%_100%)]"
      />
      {tape && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 rounded-[2px] bg-white/55 shadow-[0_1px_2px_rgb(0_0_0/0.08)] backdrop-blur-[1px] dark:bg-white/30"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Polaroid — a photo print with a handwritten caption.                 */
/* ------------------------------------------------------------------ */

export function Polaroid({
  src,
  alt,
  caption,
  sub,
  tape = true,
  className,
  sizes = "220px",
  priority = false,
}: {
  src: string;
  alt: string;
  caption: React.ReactNode;
  sub?: React.ReactNode;
  tape?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure className={cn("relative rounded-[4px] bg-[#fffdf6] dark:bg-[#ece3d2] p-2.5 pb-3 text-ink shadow-paper", className)}>
      {tape && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 rotate-2 rounded-[2px] bg-white/55 shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-white/30"
        />
      )}
      <div className="relative aspect-square overflow-hidden rounded-[2px] bg-surface-subtle">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          draggable={false}
          className="object-cover saturate-[0.92] sepia-[0.08]"
        />
      </div>
      <figcaption className="px-1 pt-2.5">
        <span className="type-hand block text-[22px] leading-tight sm:text-[24px]">{caption}</span>
        {sub && <span className="type-hand block text-[17px] text-ink/60 sm:text-[19px]">{sub}</span>}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Draggable — pick a paper thing up, move it, it lands with a wobble.  */
/* ------------------------------------------------------------------ */

export function Draggable({
  children,
  constraints,
  rotate = 0,
  className,
  enabled,
  delay = 0,
  onPickUp,
  z,
}: {
  children: React.ReactNode;
  constraints: React.RefObject<HTMLElement | null>;
  rotate?: number;
  className?: string;
  enabled: boolean;
  delay?: number;
  onPickUp?: () => void;
  z?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("absolute", enabled && "cursor-grab touch-none active:cursor-grabbing", className)}
      style={{ zIndex: z, filter: "drop-shadow(0 0px 0px rgb(60 45 20 / 0))" }}
      initial={reduce ? { opacity: 0, rotate } : { opacity: 0, y: -60, rotate: rotate * 3, scale: 1.08 }}
      animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay }}
      drag={enabled}
      dragConstraints={constraints}
      dragElastic={0.18}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
      whileHover={enabled ? { scale: 1.03, rotate: rotate * 0.5 } : undefined}
      whileDrag={{ scale: 1.08, rotate: 0, filter: "drop-shadow(0 22px 18px rgb(60 45 20 / 0.28))" }}
      whileTap={enabled ? undefined : { rotate: [rotate, rotate - 4, rotate + 3, rotate] }}
      onPointerDown={onPickUp}
    >
      {children}
    </motion.div>
  );
}

/** True on devices with a precise pointer (mouse/trackpad). Touch keeps native scroll. */
export function useFinePointer() {
  return React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(pointer: fine)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* TearOffCalendar — tap (or wait) and the top sheet tears away.        */
/* ------------------------------------------------------------------ */

const SHEETS: ReadonlyArray<{ month: string; day: number; weekday: string; note: string; category: CategoryKey }> = [
  { month: "May", day: 12, weekday: "Tuesday", note: "Mum’s birthday!", category: "personal" },
  { month: "Jun", day: 21, weekday: "Sunday", note: "Our anniversary", category: "personal" },
  { month: "Aug", day: 28, weekday: "Friday", note: "Rent day", category: "financial" },
  { month: "Mar", day: 3, weekday: "Wednesday", note: "Passport renewal", category: "documents" },
];

function Sheet({ s }: { s: (typeof SHEETS)[number] }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-b-[10px] bg-[#fffdf6] dark:bg-[#ece3d2] text-ink">
      <div className="bg-ember py-1.5 text-center text-xs font-semibold tracking-[0.18em] text-white uppercase">
        {s.month}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <span className="text-[64px] leading-none font-semibold tracking-[-0.05em]">{s.day}</span>
        <span className="mt-1 text-xs text-ink/55">{s.weekday}</span>
      </div>
      <div className="flex items-center justify-center gap-1.5 border-t border-dashed border-ink/15 py-2">
        <span className={cn("size-2 rounded-full", CATEGORIES[s.category].dot)} />
        <span className="type-hand text-[19px]">{s.note}</span>
      </div>
    </div>
  );
}

export function TearOffCalendar({ className, auto = true }: { className?: string; auto?: boolean }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!auto || reduce || !inView) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SHEETS.length), 3600);
    return () => window.clearInterval(id);
  }, [auto, reduce, inView, index]);

  const current = SHEETS[index];
  const next = SHEETS[(index + 1) % SHEETS.length];

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setIndex((i) => (i + 1) % SHEETS.length)}
      aria-label={`Calendar showing ${current.month} ${current.day}, ${current.note}. Tap to tear off the page.`}
      className={cn("group relative block w-[168px] text-left outline-none", className)}
    >
      {/* Binding */}
      <div className="relative z-20 flex h-5 items-center justify-center gap-10 rounded-t-[10px] bg-ink">
        <span className="size-2 rounded-full bg-background/80" />
        <span className="size-2 rounded-full bg-background/80" />
      </div>
      <div className="relative h-[176px] shadow-paper">
        {/* Next sheet waits underneath */}
        <div className="absolute inset-0">
          <Sheet s={next} />
        </div>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0 origin-top-left"
            initial={{ opacity: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { rotate: 18, y: 160, x: 30, opacity: 0, transition: { duration: 0.75, ease: EASE.inOutQuart } }
            }
          >
            <Sheet s={current} />
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="type-hand pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 text-base whitespace-nowrap text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        tap to tear!
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Squiggle — hand-drawn underline that draws itself.                   */
/* ------------------------------------------------------------------ */

export function Squiggle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 200 14" fill="none" preserveAspectRatio="none" aria-hidden className={className}>
      <motion.path
        d="M3 9.5C28 3 52 12.5 78 7.5S128 2.5 152 7s36 3 45-1"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: EASE.outQuart, delay }}
      />
    </svg>
  );
}

/** Little hand-drawn curved arrow for annotations. */
export function DoodleArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" fill="none" aria-hidden className={className}>
      <path
        d="M4 6c10 18 26 26 46 26M50 32l-9-7M50 32l-10 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
