"use client";

import * as React from "react";
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isSameDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  REPEAT_OPTIONS,
  repeatFeedback,
  type RepeatOption,
} from "@/lib/reminder-draft";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

type StepWhenProps = {
  what: string;
  date: Date | null;
  repeat: RepeatOption;
  onDateChange: (date: Date) => void;
  onRepeatChange: (repeat: RepeatOption) => void;
  onEditWhat: () => void;
  onContinue: () => void;
};

/**
 * Step 2 "When" — date picker calendar plus repeat cadence,
 * from the Stitch create-reminder flow.
 */
export function StepWhen({
  what,
  date,
  repeat,
  onDateChange,
  onRepeatChange,
  onEditWhat,
  onContinue,
}: StepWhenProps) {
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(() =>
    date ? startOfMonth(date) : startOfMonth(new Date()),
  );

  const selected: Date = date ?? new Date();
  const monthStart = startOfMonth(visibleMonth);
  const leadBlanks = getDay(monthStart);
  const daysInMonth = getDaysInMonth(visibleMonth);
  const feedback = repeatFeedback(repeat, selected);

  return (
    <FadeUp y={20} className="flex w-full flex-col">
      <div className="mb-6 text-left">
        <span className="mb-2 inline-block text-[11px] font-bold tracking-wider text-accent-soft uppercase">
          Step 2 of 3 · Date
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[42px] lg:leading-tight">
          When is it?
        </h1>
        <p className="mt-2 text-base font-normal text-muted sm:text-lg">
          Choose the date you want Rontee to remember.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted shadow-subtle">
        <span className="font-medium text-muted">Reminder:</span>
        <span className="min-w-0 flex-1 truncate font-semibold text-foreground">
          &ldquo;{what.trim()}&rdquo;
        </span>
        <button
          type="button"
          onClick={onEditWhat}
          className="ml-auto shrink-0 text-xs font-medium text-accent-soft transition-opacity hover:opacity-80"
        >
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <span id="reminder-date-label" className="mb-2 block text-sm font-medium text-foreground">
            Date
          </span>
          <div
            role="group"
            aria-labelledby="reminder-date-label"
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-subtle transition-colors"
          >
            <span className="text-lg font-semibold text-foreground">
              {format(selected, "MMMM d, yyyy")}
            </span>
            <span aria-hidden className="p-1 text-accent-soft">
              <CalendarDays size={ICON_SIZES.prominent} />
            </span>
          </div>

          <div className="mt-2.5 rounded-2xl border border-border bg-surface p-5 shadow-subtle">
            <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-base font-semibold tracking-tight text-foreground">
                {format(visibleMonth, "MMMM yyyy")}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
                >
                  <ChevronLeft size={ICON_SIZES.compact} aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
                >
                  <ChevronRight size={ICON_SIZES.compact} aria-hidden />
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <span key={day} className="py-1 text-xs font-medium text-muted">
                  {day}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
              {Array.from({ length: leadBlanks }, (_, i) => (
                <span key={`blank-${i}`} aria-hidden />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = new Date(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth(),
                  i + 1,
                );
                const isSelected = isSameDay(day, selected);
                const isCurrentDay = isToday(day);
                return (
                  <button
                    key={i + 1}
                    type="button"
                    onClick={() => onDateChange(day)}
                    aria-pressed={isSelected}
                    aria-label={format(day, "MMMM d, yyyy")}
                    className={cn(
                      "rounded-lg py-2 transition",
                      isSelected
                        ? "bg-accent font-bold text-accent-foreground shadow-subtle"
                        : "text-muted hover:bg-surface-subtle hover:text-foreground",
                      !isSelected &&
                        isCurrentDay &&
                        "ring-1 ring-accent/60 ring-inset",
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <fieldset className="pt-2">
          <legend className="mb-3 block text-base font-medium text-foreground">
            Does this repeat?
          </legend>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="radiogroup" aria-label="Recurrence frequency">
            {REPEAT_OPTIONS.map((option) => {
              const isSelected = repeat === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onRepeatChange(option.value)}
                  className={cn(
                    "flex items-center justify-center rounded-xl px-3.5 py-3 text-sm transition text-nowrap",
                    isSelected
                      ? "border-2 border-accent bg-accent-subtle font-semibold text-accent-soft shadow-subtle"
                      : "border border-border bg-surface font-medium text-muted hover:border-accent/50 hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {feedback && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent-soft">
              <Repeat size={ICON_SIZES.compact} aria-hidden className="shrink-0" />
              {feedback}
            </p>
          )}
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center">
        <Button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full px-8 py-3.5 text-base font-semibold shadow-elevated sm:w-auto sm:min-w-[200px]"
        >
          Continue
          <ArrowRight size={ICON_SIZES.compact} aria-hidden />
        </Button>
        <span className="mt-3 text-xs text-muted">Step 2 of 3</span>
        <p className="mt-3 max-w-sm text-center text-sm text-muted">
          No account needed yet · You can create this reminder before signing
          up.
        </p>
      </div>
    </FadeUp>
  );
}
