"use client";

import * as React from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Mail } from "lucide-react";

import { EASE, SPRING } from "@/lib/motion";
import { TIMING_OFFSETS, formatTimingDate, timingDate, timingLabel, type TimingOffset } from "@/lib/reminder-draft";
import { cn } from "@/lib/utils";
import { FlowActions, StepHeading } from "./step-ui";

type StepTimingsProps = {
  date: Date;
  timings: TimingOffset[];
  onToggleTiming: (offset: TimingOffset) => void;
  onBack: () => void;
  onCreate: () => void;
};

/** True when a nudge would land before today (e.g. "1 month before" for next week). */
export function timingHasPassed(date: Date, offset: TimingOffset) {
  return isBefore(timingDate(date, offset), startOfDay(new Date()));
}

/** Step 3 — "When should we nudge you?" Timeline + toggles. */
export function StepTimings({ date, timings, onToggleTiming, onBack, onCreate }: StepTimingsProps) {
  const valid = timings.filter((t) => !timingHasPassed(date, t));

  return (
    <div>
      <StepHeading title="When should we" accent="nudge you?">
        Pick as many as you like. Each nudge is a friendly email and a notification.
      </StepHeading>

      {/* Timeline: a month of lead-up to the big day */}
      <div className="mb-6 rounded-[28px] border border-border bg-surface px-6 pt-10 pb-7 shadow-elevated sm:px-8">
        <div className="relative mx-2 h-10">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border-strong" />
          {TIMING_OFFSETS.filter((o) => o !== 0).map((o) => {
            const on = valid.includes(o);
            // Square-root scale: the last few days get more room than "a month ago".
            const left = `${(1 - Math.sqrt(o / 30)) * 100}%`;
            return (
              <span key={o} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left }}>
                <span
                  className={cn(
                    "block rounded-full transition-all duration-500 ease-out-expo",
                    on ? "size-3.5 bg-primary" : "size-1.5 bg-border-strong",
                  )}
                />
                <AnimatePresence>
                  {on && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-semibold whitespace-nowrap text-muted"
                    >
                      {o === 30 ? "1 mo" : o === 14 ? "2 wk" : o === 7 ? "1 wk" : `${o}d`}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            );
          })}
          {/* The big day */}
          <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            <motion.span
              className="block size-5 rounded-full bg-ember ring-4 ring-ember-subtle"
              animate={{ scale: valid.includes(0) ? 1.15 : 1 }}
              transition={SPRING.snappy}
            />
            <span className="absolute top-8 right-1/2 translate-x-1/2 text-[11px] font-semibold whitespace-nowrap">
              {format(date, "d MMM")}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {TIMING_OFFSETS.map((offset) => {
          const passed = timingHasPassed(date, offset);
          const selected = valid.includes(offset);
          return (
            <motion.button
              key={offset}
              type="button"
              aria-pressed={selected}
              disabled={passed}
              onClick={() => onToggleTiming(offset)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-4 text-left transition-[background-color,border-color,box-shadow] duration-300",
                selected ? "border-border-strong bg-surface shadow-elevated" : "border-border bg-surface/60 hover:border-border-strong",
                passed && "cursor-not-allowed opacity-50",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-300",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong",
                )}
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
                  <motion.path
                    d="M3 8.5l3.2 3L13 4.5"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{ pathLength: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: EASE.outQuart }}
                  />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{timingLabel(offset)}</span>
                <span className="block text-[13px] text-muted">
                  {passed ? "Too late for this one" : formatTimingDate(date, offset)}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
        <span className="flex items-center gap-1.5">
          <Mail size={14} aria-hidden /> Email
        </span>
        <span className="flex items-center gap-1.5">
          <Bell size={14} aria-hidden /> Notification
        </span>
        <span>Both on to start. You can change them any time.</span>
      </p>

      <FlowActions
        onBack={onBack}
        onNext={onCreate}
        nextLabel="Save my reminder"
        nextDisabled={valid.length === 0}
        hint={valid.length === 0 ? "Pick at least one nudge." : undefined}
      />
    </div>
  );
}
