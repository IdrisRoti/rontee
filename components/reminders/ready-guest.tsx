"use client";

import { Check, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GoogleMark } from "@/components/auth/auth-widgets";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";
import {
  dateRepeatSummary,
  formatTimingDate,
  timingLabel,
  type RepeatOption,
  type TimingOffset,
} from "@/lib/reminder-draft";

type ReadyGuestProps = {
  what: string;
  date: Date;
  repeat: RepeatOption;
  timings: TimingOffset[];
};

/**
 * "Reminder Ready" guest gate — the draft is held in local storage
 * while the guest creates an account, per the Stitch flow.
 */
export function ReadyGuest({ what, date, repeat, timings }: ReadyGuestProps) {
  return (
    <FadeUp y={20} className="flex w-full flex-col items-center text-center">
      <div
        aria-hidden
        className="mb-6 flex size-12 items-center justify-center rounded-full border border-accent/20 bg-accent-subtle text-accent-soft shadow-subtle"
      >
        <Check size={24} strokeWidth={2.2} />
      </div>

      <p className="mb-2 text-xs font-semibold tracking-wider text-accent-soft uppercase">
        Reminder ready · Step completed
      </p>
      <h1 id="wizard-heading" tabIndex={-1} className="mb-3 text-3xl font-bold tracking-tight text-foreground outline-none sm:text-4xl">
        Your reminder is ready.
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-muted">
        Create a free account to save it permanently and receive your
        reminders.
      </p>

      <section
        aria-label="Reminder summary"
        className="mb-8 w-full rounded-2xl border border-border bg-surface p-6 text-left shadow-elevated"
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
          <span className="inline-flex shrink-0 items-center rounded-full border border-accent/20 bg-accent-subtle px-2.5 py-1 text-xs font-medium whitespace-nowrap text-accent-soft">
            Captured
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
                className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-subtle p-3 text-xs font-medium sm:px-3 sm:py-2.5"
              >
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-soft"
                >
                  <Check size={14} strokeWidth={2.2} />
                </span>
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:flex-col sm:items-start sm:gap-0">
                  <span className="truncate font-semibold text-foreground">
                    {timingLabel(offset)}
                  </span>
                  <span className="shrink-0 text-xs font-normal text-muted sm:mt-0.5 sm:text-[10px]">
                    {formatTimingDate(date, offset)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Account creation" className="flex w-full flex-col gap-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full rounded-xl border-border py-3.5 font-semibold shadow-subtle"
          asChild
        >
          <a href="#" aria-label="Continue with Google (coming soon)">
            <GoogleMark />
            <span>Continue with Google</span>
          </a>
        </Button>
        <Button
          type="button"
          className="w-full rounded-xl bg-foreground py-3.5 font-semibold text-background shadow-subtle hover:bg-foreground/90"
          asChild
        >
          <a href="/signup">
            <Mail size={ICON_SIZES.compact} aria-hidden className="opacity-80" />
            <span>Create account with email</span>
          </a>
        </Button>
      </section>

      <p className="mt-5 text-center text-xs text-muted">
        Already have an account?{" "}
        <a
          href="/login"
          className="ml-1 font-semibold text-accent-soft transition-opacity hover:opacity-80"
        >
          Log in
        </a>
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
        <Lock size={14} aria-hidden className="shrink-0 text-accent-soft" />
        <span>Your reminder is safely held while you set up your account.</span>
      </div>
    </FadeUp>
  );
}
