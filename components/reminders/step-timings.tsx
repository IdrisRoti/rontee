"use client";

import { ArrowRight, Check, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  TIMING_OFFSETS,
  dateRepeatSummary,
  formatTimingDate,
  timingLabel,
  type RepeatOption,
  type TimingOffset,
} from "@/lib/reminder-draft";

type StepTimingsProps = {
  what: string;
  date: Date;
  repeat: RepeatOption;
  timings: TimingOffset[];
  onToggleTiming: (offset: TimingOffset) => void;
  onEditWhen: () => void;
  onCreate: () => void;
};

/**
 * Step 3 "Remind me" — multi-select reminder timings computed
 * from the remembered date, from the Stitch create-reminder flow.
 */
export function StepTimings({
  what,
  date,
  repeat,
  timings,
  onToggleTiming,
  onEditWhen,
  onCreate,
}: StepTimingsProps) {
  return (
    <FadeUp y={20} className="flex w-full flex-col items-center">
      <div className="mb-8 w-full text-center">
        <div className="mb-3 text-xs font-semibold tracking-wider text-accent-soft uppercase">
          Step 3 of 3 · Remind
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          When should we remind you?
        </h1>
        <p className="mx-auto max-w-md text-base leading-relaxed text-muted">
          Choose when Rontee should remind you before the date.
        </p>
      </div>

      <div className="mb-9 flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-5 py-3.5 shadow-subtle">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent" />
          <div className="min-w-0 truncate">
            <span className="text-sm font-semibold text-foreground">
              &ldquo;{what.trim()}&rdquo;
            </span>
            <span className="ml-2 text-xs font-normal text-muted">
              · {dateRepeatSummary(date, repeat)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onEditWhen}
          className="ml-4 shrink-0 text-xs font-semibold text-accent-soft transition-opacity hover:opacity-80"
        >
          Edit
        </button>
      </div>

      <div className="mb-3 flex w-full items-center justify-between px-1">
        <span className="text-xs font-bold tracking-wider text-muted uppercase">
          Remind me
        </span>
        <span className="text-xs text-muted/80">Select one or more</span>
      </div>

      <div className="mb-4 grid w-full grid-cols-1 gap-3 min-[480px]:grid-cols-2">
        {TIMING_OFFSETS.map((offset) => {
          const isSelected = timings.includes(offset);
          return (
            <button
              key={offset}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleTiming(offset)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl p-4 text-left shadow-subtle transition-all",
                isSelected
                  ? "border-2 border-accent bg-accent-subtle text-foreground"
                  : "border border-border bg-surface text-muted hover:border-muted/40 hover:text-foreground",
              )}
            >
              <span className="flex flex-col">
                <span
                  className={cn(
                    "text-sm",
                    isSelected ? "font-semibold text-foreground" : "font-medium",
                  )}
                >
                  {timingLabel(offset)}
                </span>
                <span className="mt-0.5 text-xs text-muted">
                  {formatTimingDate(date, offset)}
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex size-5 items-center justify-center rounded-md",
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-surface",
                )}
              >
                {isSelected && <Check size={14} strokeWidth={2.5} />}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mb-8 flex items-center justify-center gap-1.5 text-xs text-muted">
        <Info size={14} aria-hidden />
        You can change these reminders anytime.
      </p>

      <div className="flex w-full flex-col items-center">
        <Button
          type="button"
          onClick={onCreate}
          disabled={timings.length === 0}
          className="w-full max-w-sm rounded-full px-8 py-4 text-base font-bold tracking-wide shadow-elevated"
        >
          Create reminder
          <ArrowRight size={ICON_SIZES.compact} aria-hidden />
        </Button>
        <div className="mt-4 text-center">
          <p className="mb-1 text-xs font-medium text-muted">Step 3 of 3</p>
          <p className="text-xs text-muted">
            No account needed yet · Your reminder will be saved before you sign
            up.
          </p>
        </div>
      </div>
    </FadeUp>
  );
}
