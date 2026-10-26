"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { FadeIn } from "@/components/shared/kinetic";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { DoodleArrow, Draggable, PaperNote, Polaroid, Squiggle, TearOffCalendar, useFinePointer } from "./paper";
import { QuickCapture } from "./quick-capture";

/* ------------------------------------------------------------------ */
/* The headline note: "Never forget …" + a sticky note slapped on.      */
/* ------------------------------------------------------------------ */

const SLAPS: ReadonlyArray<{ text: string; category: CategoryKey | null; rotate: number }> = [
  { text: "Mum’s birthday.", category: "personal", rotate: -3 },
  { text: "the rent.", category: "financial", rotate: 2.5 },
  { text: "your passport.", category: "documents", rotate: -2 },
  { text: "that deadline.", category: "work", rotate: 3 },
  { text: "what matters.", category: null, rotate: -1.5 },
];
const LAST = SLAPS.length - 1;

/**
 * One note at a time gets slapped onto the headline and peeled off again,
 * resting a little longer on "what matters." Static under reduced motion.
 */
function SlapNote() {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(LAST);

  React.useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % SLAPS.length), index === LAST ? 4200 : 1700);
    return () => window.clearTimeout(id);
  }, [index, reduce]);

  const s = SLAPS[index];
  return (
    <span aria-hidden className="relative mt-[0.12em] flex h-[1.42em] items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          initial={{ opacity: 0, scale: 1.35, y: "-0.3em", rotate: s.rotate + 9 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: s.rotate }}
          exit={{ opacity: 0, x: "0.5em", y: "-0.25em", rotate: s.rotate + 10, scale: 0.94, transition: { duration: 0.32, ease: EASE.inOutQuart } }}
          transition={{ type: "spring", stiffness: 300, damping: 17 }}
          className={cn(
            "relative inline-block rounded-[0.08em] px-[0.32em] pt-[0.02em] pb-[0.08em] whitespace-nowrap text-ink shadow-paper",
            s.category ? CATEGORIES[s.category].bg : "bg-[#fffdf6] dark:bg-[#ece3d2]",
          )}
        >
          {/* tape + sheen */}
          <span
            aria-hidden
            className="absolute -top-[0.16em] left-1/2 h-[0.3em] w-[1.1em] -translate-x-1/2 -rotate-3 rounded-[2px] bg-white/55 shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-white/30"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(165deg,rgb(255_255_255/0.4),transparent_45%)]"
          />
          <span className="type-hand relative">
            {index === LAST ? (
              <>
                what{" "}
                <span className="relative inline-block">
                  matters.
                  <Squiggle delay={0.35} className="absolute -bottom-[0.02em] left-0 h-[0.16em] w-full text-ember" />
                </span>
              </>
            ) : (
              s.text
            )}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Paper things around the edge of the stage.                           */
/* ------------------------------------------------------------------ */

const NOTES = [
  {
    id: "rent",
    category: "financial",
    rotate: 6,
    pos: "left-[3%] bottom-[12%] xl:left-[6%]",
    text: (
      <>
        Rent → the 28th
        <span className="mt-1 block text-[0.8em] text-ink/60">every month</span>
      </>
    ),
  },
  {
    id: "passport",
    category: "documents",
    rotate: -5,
    pos: "right-[3%] bottom-[16%] xl:right-[5%]",
    text: <>Passport runs out in March!</>,
  },
  {
    id: "uni",
    category: "work",
    rotate: 4,
    pos: "right-[15%] bottom-[2%] hidden xl:block",
    text: <>Uni application due Friday!!</>,
  },
] as const;

/**
 * Landing hero: one centred stage. "Never forget" with a sticky note
 * slapped on underneath, the quick capture in the middle, and paper
 * things scattered round the edges of the desk that you can pick up.
 */
export function Hero() {
  const deskRef = React.useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const [order, setOrder] = React.useState<string[]>(["calendar", "mum", ...NOTES.map((n) => n.id)]);
  const lift = (id: string) => setOrder((o) => [...o.filter((x) => x !== id), id]);
  const z = (id: string) => 10 + order.indexOf(id);

  return (
    <section aria-labelledby="hero-heading" className="relative w-full overflow-hidden pt-28 pb-16 sm:pt-36 lg:min-h-[900px] lg:pb-28">
      {/* Dotted desk, fading out toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--border-strong)_1px,transparent_1.5px)] bg-[length:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black_20%,transparent_75%)]"
      />

      {/* Centre stage */}
      <div className="relative mx-auto flex w-full max-w-[760px] flex-col items-center px-4 text-center sm:px-8">
        <h1 id="hero-heading" className="type-display">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE.outExpo, delay: 0.1 }}
          >
            Never forget
          </motion.span>
          <span className="sr-only">what matters.</span>
          <span className="block text-[0.95em]">
            <SlapNote />
          </span>
        </h1>

        <FadeIn immediate delay={0.45}>
          <p className="type-body-lg mx-auto mt-8 max-w-[34rem] text-pretty text-muted">
            Birthdays, bills, renewals, and that free trial you’ll <em>definitely</em> forget to cancel. Tell Rontee
            once, and we’ll give you a friendly nudge in plenty of time.
          </p>
        </FadeIn>

        <FadeIn immediate delay={0.6} className="mt-9 w-full max-w-[560px] text-left">
          <QuickCapture shared center />
        </FadeIn>

        <FadeIn immediate delay={0.75}>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted">
            {["Free to start", "No sign-up needed", "Takes about 10 seconds"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check size={15} strokeWidth={2.5} aria-hidden className="text-sage" />
                {t}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>

      {/* Desktop: paper round the edges, draggable across the whole stage */}
      <div ref={deskRef} className="pointer-events-none absolute inset-0 hidden lg:block">
        <Draggable
          constraints={deskRef}
          enabled={fine}
          rotate={-8}
          delay={0.45}
          onPickUp={() => lift("mum")}
          z={z("mum")}
          className="pointer-events-auto top-[13%] left-[2%] xl:left-[5%]"
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
            sizes="(min-width: 1280px) 190px, 160px"
            className="w-[160px] xl:w-[190px]"
          />
        </Draggable>

        <Draggable
          constraints={deskRef}
          enabled={fine}
          rotate={5}
          delay={0.35}
          onPickUp={() => lift("calendar")}
          z={z("calendar")}
          className="pointer-events-auto top-[14%] right-[3%] xl:right-[7%]"
        >
          <TearOffCalendar />
        </Draggable>

        {NOTES.map((n, i) => (
          <Draggable
            key={n.id}
            constraints={deskRef}
            enabled={fine}
            rotate={n.rotate}
            delay={0.55 + i * 0.12}
            onPickUp={() => lift(n.id)}
            z={z(n.id)}
            className={cn("pointer-events-auto", n.pos)}
          >
            <PaperNote category={n.category} className="w-[150px] xl:w-[168px]">
              <p className="type-hand text-[23px] xl:text-[25px]">{n.text}</p>
            </PaperNote>
          </Draggable>
        ))}

        {fine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="absolute top-[47%] left-[4%] hidden flex-col items-start text-muted xl:left-[7%] xl:flex"
            aria-hidden
          >
            <DoodleArrow className="ml-6 h-8 w-12 -scale-y-100 rotate-[-30deg]" />
            <span className="type-hand -rotate-6 text-xl">psst… move us around</span>
          </motion.div>
        )}
      </div>

      {/* Phones/tablets: a little strip of paper under the capture */}
      <div aria-hidden className="relative mx-auto mt-14 flex h-[230px] max-w-[440px] items-start justify-center lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: -40, rotate: -18 }}
          animate={{ opacity: 1, y: 0, rotate: -8 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.8 }}
          className="absolute top-2 left-[4%]"
        >
          <Polaroid
            src="/images/photos/mum-hug.webp"
            alt=""
            caption="Mum’s birthday"
            sub="12th May"
            sizes="140px"
            className="w-[150px]"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -40, rotate: 14 }}
          animate={{ opacity: 1, y: 0, rotate: 5 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.95 }}
          className="absolute top-6 right-[4%]"
        >
          <PaperNote category="financial" className="w-[136px]">
            <p className="type-hand text-[22px]">Rent → the 28th</p>
          </PaperNote>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -40, rotate: -12 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 1.1 }}
          className="absolute right-[18%] bottom-0"
        >
          <PaperNote category="documents" className="w-[132px]">
            <p className="type-hand text-[21px]">Passport runs out in March!</p>
          </PaperNote>
        </motion.div>
      </div>
    </section>
  );
}
