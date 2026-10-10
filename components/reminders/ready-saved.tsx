import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";
import {
  dateRepeatSummary,
  formatTimingDate,
  timingLabel,
  type RepeatOption,
  type TimingOffset,
} from "@/lib/reminder-draft";

type ReadySavedProps = {
  what: string;
  date: Date;
  repeat: RepeatOption;
  timings: TimingOffset[];
  onCreateAnother: () => void;
};

/**
 * "Reminder Saved" confirmation for authenticated guests —
 * from the Stitch flow. Reminder actions are placeholders
 * until the dashboard exists.
 */
export function ReadySaved({
  what,
  date,
  repeat,
  timings,
  onCreateAnother,
}: ReadySavedProps) {
  return (
    <FadeUp y={20} className="flex w-full flex-col items-center text-center">
      <div
        aria-hidden
        className="mb-6 flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent-subtle text-accent-soft shadow-subtle"
      >
        <Check size={24} strokeWidth={2.2} />
      </div>

      <p className="mb-2 text-xs font-semibold tracking-widest text-accent-soft uppercase">
        Reminder saved · Confirmation
      </p>
      <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Your reminder is saved.
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-muted">
        Rontee will take it from here.
      </p>

      <section
        aria-label="Reminder summary"
        className="mb-8 w-full rounded-2xl border border-border bg-surface p-6 text-left shadow-subtle"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent" />
              <h2 className="truncate text-lg font-semibold text-foreground">
                {what.trim()}
              </h2>
            </div>
            <p className="mt-1 pl-4 text-xs text-muted">
              {dateRepeatSummary(date, repeat)}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full border border-accent/30 bg-accent-subtle px-2.5 py-1 text-xs font-medium whitespace-nowrap text-accent-soft">
            Active &amp; Scheduled
          </span>
        </div>

        <div className="my-5 border-t border-border/60" aria-hidden />

        <div>
          <span className="mb-3 block text-[11px] font-semibold tracking-wider text-muted uppercase">
            Your reminders
          </span>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {timings.map((offset) => (
              <div
                key={offset}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface-subtle px-3 py-2 text-xs font-medium"
              >
                <Check
                  size={ICON_SIZES.compact}
                  aria-hidden
                  className="shrink-0 text-accent-soft"
                />
                <span className="leading-tight">
                  <span className="block font-semibold text-foreground">
                    {timingLabel(offset)}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-muted">
                    {formatTimingDate(date, offset)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Reminder actions" className="flex w-full flex-col gap-3">
        <Button
          type="button"
          className="w-full rounded-xl py-3.5 text-sm font-semibold shadow-subtle"
          asChild
        >
          <a href="#">
            View reminder
            <ArrowRight size={ICON_SIZES.compact} aria-hidden />
          </a>
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCreateAnother}
          className="w-full rounded-xl py-3.5 text-sm shadow-subtle"
        >
          Create another reminder
        </Button>
      </section>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
        <Check
          size={14}
          aria-hidden
          className="shrink-0 text-accent-soft"
          strokeWidth={2.2}
        />
        <span>Your reminder is saved and your notifications are set.</span>
      </div>
    </FadeUp>
  );
}
