"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  format,
  getDaysInMonth,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Repeat } from "lucide-react";

import { EASE, SPRING } from "@/lib/motion";
import { REPEAT_OPTIONS, repeatFeedback, type RepeatOption } from "@/lib/reminder-draft";
import { cn } from "@/lib/utils";
import { FlowActions, StepHeading } from "./step-ui";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type StepWhenProps = {
  date: Date | null;
  dateGuessed: boolean;
  repeat: RepeatOption;
  onDateChange: (date: Date) => void;
  onRepeatChange: (repeat: RepeatOption) => void;
  onBack: () => void;
  onContinue: () => void;
};

/** Step 2 — "When is it?" Friendly calendar, quick picks, repeat switch. */
export function StepWhen({ date, dateGuessed, repeat, onDateChange, onRepeatChange, onBack, onContinue }: StepWhenProps) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [month, setMonth] = React.useState<Date>(() => startOfMonth(date ?? today));
  const [dir, setDir] = React.useState<1 | -1>(1);

  const showMonth = (next: Date) => {
    const m = startOfMonth(next);
    if (isSameMonth(m, month)) return;
    setDir(isBefore(m, month) ? -1 : 1);
    setMonth(m);
  };

  const pick = (d: Date) => {
    onDateChange(d);
    showMonth(d);
  };

  const quick = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: addDays(today, 1) },
    { label: "In a week", date: addDays(today, 7) },
    { label: "In a month", date: addMonths(today, 1) },
  ];

  // Monday-first grid
  const lead = (startOfMonth(month).getDay() + 6) % 7;
  const days = getDaysInMonth(month);

  return (
    <div>
      <StepHeading title="When is" accent="it?">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={dateGuessed && date ? "guessed" : "plain"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-start gap-2"
          >
            {dateGuessed && date ? (
              <>
                <span aria-hidden className="mt-[0.6em] size-2 shrink-0 rounded-full bg-ember" />
                We spotted {format(date, "d MMMM")} in your note. Change it if you need to.
              </>
            ) : (
              "Pick the day you want to remember."
            )}
          </motion.span>
        </AnimatePresence>
      </StepHeading>

      <div className="mb-4 flex flex-wrap gap-2">
        {quick.map((q) => {
          const active = date ? isSameDay(date, q.date) : false;
          return (
            <button
              key={q.label}
              type="button"
              aria-pressed={active}
              onClick={() => pick(q.date)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5",
                active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-border-strong",
              )}
            >
              {q.label}
            </button>
          );
        })}
      </div>

      {/* Calendar */}
      <div className="rounded-[28px] border border-border bg-surface p-4 shadow-elevated sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative h-7 flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.span
                key={month.toISOString()}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, y: d * 14 }),
                  center: { opacity: 1, y: 0 },
                  exit: (d: number) => ({ opacity: 0, y: d * -14 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE.outExpo }}
                className="absolute inset-0 flex items-center text-lg font-semibold tracking-tight"
              >
                {format(month, "MMMM yyyy")}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => showMonth(subMonths(month, 1))}
              className="flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => showMonth(addMonths(month, 1))}
              className="flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>

        <div className="mb-1 grid grid-cols-7 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-1 text-xs font-medium text-faint">
              {d}
            </span>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={month.toISOString()}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 60, filter: "blur(4px)" }),
                center: { opacity: 1, x: 0, filter: "blur(0px)" },
                exit: (d: number) => ({ opacity: 0, x: d * -60, filter: "blur(4px)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: EASE.outExpo }}
              className="grid grid-cols-7 gap-1"
            >
              {Array.from({ length: lead }, (_, i) => (
                <span key={`b${i}`} aria-hidden />
              ))}
              {Array.from({ length: days }, (_, i) => {
                const day = new Date(month.getFullYear(), month.getMonth(), i + 1);
                const selected = date ? isSameDay(day, date) : false;
                const past = isBefore(day, today);
                return (
                  <div key={i} className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => pick(day)}
                      aria-pressed={selected}
                      aria-label={format(day, "EEEE d MMMM yyyy")}
                      className={cn(
                        "relative flex size-10 items-center justify-center rounded-full text-[15px] transition-colors duration-200 sm:size-11",
                        selected ? "font-semibold text-primary-foreground" : past ? "text-faint hover:bg-surface-subtle" : "hover:bg-surface-subtle",
                      )}
                    >
                      {selected && (
                        <motion.span layoutId="day-pill" transition={SPRING.snappy} className="absolute inset-0 rounded-full bg-primary" />
                      )}
                      <span className="relative">{i + 1}</span>
                      {isToday(day) && (
                        <span
                          aria-hidden
                          className={cn("absolute bottom-1 size-1 rounded-full", selected ? "bg-primary-foreground" : "bg-ember")}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Repeat */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-base font-semibold">Does it come round again?</legend>
        <div role="radiogroup" aria-label="Repeat" className="grid grid-cols-2 gap-1 rounded-2xl bg-surface-subtle p-1 sm:grid-cols-4">
          {REPEAT_OPTIONS.map((o) => {
            const active = repeat === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onRepeatChange(o.value)}
                className={cn(
                  "relative rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  active ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span layoutId="repeat-thumb" transition={SPRING.snappy} className="absolute inset-0 rounded-xl bg-surface shadow-subtle" />
                )}
                <span className="relative">{o.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 h-5 text-sm text-muted">
          <AnimatePresence mode="popLayout" initial={false}>
            {date && (
              <motion.p
                key={`${repeat}-${date.toDateString()}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE.outQuart }}
                className="flex items-center gap-1.5"
              >
                <Repeat size={14} aria-hidden className="shrink-0" />
                {repeatFeedback(repeat, date)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </fieldset>

      <FlowActions onBack={onBack} onNext={onContinue} nextDisabled={!date} hint={!date ? "Pick a day to carry on." : undefined} />
    </div>
  );
}
