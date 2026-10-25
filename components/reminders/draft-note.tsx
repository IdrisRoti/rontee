"use client";

import * as React from "react";
import { format } from "date-fns";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Repeat } from "lucide-react";

import { CATEGORIES } from "@/lib/categories";
import { EASE, SPRING } from "@/lib/motion";
import { repeatLabel, timingLabel, type ReminderDraft } from "@/lib/reminder-draft";
import { cn } from "@/lib/utils";

export type EditTarget = 1 | 2 | 3;

type DraftNoteProps = {
  draft: ReminderDraft;
  /** aside: desktop sidebar · compact: mobile strip · hero: confirmation centrepiece */
  size?: "aside" | "compact" | "hero";
  /** Shows a blinking caret after the title while it's being written. */
  writing?: boolean;
  stamp?: "saved" | null;
  /** Show the chosen nudges (only once the person has reached that step). */
  showTimings?: boolean;
  onEdit?: (step: EditTarget) => void;
  className?: string;
};

const PLAIN = "bg-[#fffdf6] dark:bg-[#ece3d2]";

type PartProps = {
  step: EditTarget;
  onEdit?: (step: EditTarget) => void;
  children: React.ReactNode;
  className?: string;
};

/** A section of the note; tappable (jumps back to that step) when editing is allowed. */
function NotePart({ step, onEdit, children, className }: PartProps) {
  if (!onEdit) return <div className={className}>{children}</div>;
  return (
    <button
      type="button"
      onClick={() => onEdit(step)}
      className={cn("block w-full rounded-md text-left decoration-ink/30 underline-offset-4 hover:underline", className)}
    >
      {children}
    </button>
  );
}

/**
 * The reminder as a paper note, built live as the person moves through the
 * flow. One `layoutId` across every state, so it physically travels from
 * the sidebar into the confirmation instead of being replaced.
 */
export function DraftNote({
  draft,
  size = "aside",
  writing = false,
  stamp = null,
  showTimings = true,
  onEdit,
  className,
}: DraftNoteProps) {
  const cat = draft.category ? CATEGORIES[draft.category] : null;
  const title = draft.what.trim();

  return (
    <motion.div
      layoutId="draft-note"
      transition={SPRING.soft}
      style={{ rotate: size === "compact" ? -1 : size === "hero" ? -1.5 : -2.5 }}
      className={cn(
        "relative text-ink shadow-paper transition-colors duration-500",
        cat ? cat.bg : PLAIN,
        size === "compact" && "rounded-[6px] px-4 py-3",
        size === "aside" && "rounded-[8px] p-6",
        size === "hero" && "w-full rounded-[10px] p-7 sm:p-9",
        className,
      )}
    >
      {/* Tape + sheen */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -rotate-2 rounded-[2px] bg-white/55 shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-white/30",
          size === "compact" ? "-top-2 h-4 w-12" : "-top-3 h-6 w-20",
        )}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(165deg,rgb(255_255_255/0.4),transparent_45%)]"
      />

      <div className="relative">
        {/* Category */}
        {size !== "compact" && (
          <div className="mb-3 flex h-5 items-center justify-between">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={draft.category ?? "none"}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.3, ease: EASE.outQuart }}
                className="text-[12px] font-semibold text-ink/55"
              >
                {cat ? cat.label : "Reminder"}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        {/* Title */}
        <NotePart onEdit={onEdit} step={1}>
          <p
            className={cn(
              "type-hand break-words",
              size === "compact" ? "text-[22px] leading-tight" : size === "hero" ? "text-[40px] leading-[1.02] sm:text-[46px]" : "text-[34px] leading-[1.05]",
            )}
          >
            {title || <span className="text-ink/35">Your reminder…</span>}
            {writing && <span className="animate-caret ml-0.5 text-ink/50" />}
          </p>
        </NotePart>

        {/* Date + repeat */}
        <AnimatePresence initial={false}>
          {draft.date && (
            <motion.div
              key="date"
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: EASE.outExpo }}
              className="overflow-hidden"
            >
              <NotePart onEdit={onEdit} step={2} className={size === "compact" ? "mt-1" : "mt-3"}>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-ink/70">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={draft.date.toDateString()}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: EASE.outQuart }}
                      className={cn("font-semibold text-ink", size === "compact" ? "text-[13px]" : "text-[15px]")}
                    >
                      {format(draft.date, size === "compact" ? "EEE d MMM" : "EEEE d MMMM yyyy")}
                    </motion.span>
                  </AnimatePresence>
                  <span className={cn("flex items-center gap-1", size === "compact" ? "text-[12px]" : "text-[13px]")}>
                    <Repeat size={12} aria-hidden />
                    {repeatLabel(draft.repeat).toLowerCase()}
                  </span>
                </span>
              </NotePart>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timings */}
        {size !== "compact" && (
          <AnimatePresence initial={false}>
            {showTimings && draft.date && draft.timings.length > 0 && (
              <motion.div
                key="timings"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: EASE.outExpo }}
                className="overflow-hidden"
              >
                <NotePart onEdit={onEdit} step={3} className="mt-4 border-t border-dashed border-ink/20 pt-3">
                  <span className="mb-2 block text-[12px] font-semibold text-ink/55">We’ll nudge you</span>
                  <motion.ul layout className="flex flex-wrap gap-1.5">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {draft.timings.map((t) => (
                        <motion.li
                          key={t}
                          layout
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={SPRING.snappy}
                          className="rounded-full bg-ink/10 px-2.5 py-1 text-[12px] font-medium"
                        >
                          {timingLabel(t)}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </NotePart>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Stamp */}
      <AnimatePresence>
        {stamp === "saved" && (
          <motion.span
            initial={{ opacity: 0, scale: 2.2, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 520, damping: 22, delay: 0.55 }}
            className="absolute -top-3 -right-3 rounded-lg border-[2.5px] border-ember bg-[#fffdf6]/80 px-2.5 py-1 text-[13px] font-bold tracking-[0.08em] text-ember uppercase sm:-right-5"
          >
            Saved ✓
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* PaperConfetti — a small, friendly burst of pastel paper bits.        */
/* ------------------------------------------------------------------ */

const BITS = ["bg-blush", "bg-sage", "bg-sky", "bg-butter", "bg-ember"];

export function PaperConfetti({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  // Deterministic spread so server/client agree and it always looks balanced.
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1);
        const dist = 120 + (i % 5) * 26;
        return {
          i,
          x: Math.round(Math.cos(angle) * dist),
          y: Math.round(Math.sin(angle) * dist * 0.7) - 40,
          r: (i * 47) % 360,
          w: i % 3 === 0 ? 10 : 7,
          h: i % 3 === 0 ? 6 : 12,
          color: BITS[i % BITS.length],
        };
      }),
    [],
  );
  if (reduce) return null;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", className)}>
      {pieces.map((p) => (
        <motion.span
          key={p.i}
          className={cn("absolute rounded-[2px]", p.color)}
          style={{ width: p.w, height: p.h }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 90], rotate: p.r + 180, opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: 1.6, ease: EASE.outQuart, delay: 0.35 + (p.i % 6) * 0.02, times: [0, 0.35, 1] }}
        />
      ))}
    </div>
  );
}
