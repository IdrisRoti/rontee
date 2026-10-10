"use client";

import * as React from "react";
import { Check, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  onAccountCreated: () => void;
};

function GoogleMark() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * "Reminder Ready" guest gate — the reminder is held locally and the
 * guest must create an account to save it, per the Stitch flow.
 * Auth is still a frontend preview: submitting the email form moves
 * to the saved confirmation without a backend.
 */
export function ReadyGuest({
  what,
  date,
  repeat,
  timings,
  onAccountCreated,
}: ReadyGuestProps) {
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

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
      <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
                className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-subtle px-3 py-2.5 text-xs font-medium"
              >
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-soft"
                >
                  <Check size={14} strokeWidth={2.2} />
                </span>
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

      <section aria-label="Account creation" className="flex w-full flex-col gap-3">
        {!showEmailForm ? (
          <>
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
              onClick={() => setShowEmailForm(true)}
              className="w-full rounded-xl bg-foreground py-3.5 font-semibold text-background shadow-subtle hover:bg-foreground/90"
            >
              <Mail size={ICON_SIZES.compact} aria-hidden className="opacity-80" />
              <span>Create account with email</span>
            </Button>
          </>
        ) : (
          <form
            className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 text-left shadow-subtle"
            onSubmit={(event) => {
              event.preventDefault();
              onAccountCreated();
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="guest-name">Name</Label>
              <Input
                id="guest-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jordan Lee"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="guest-email">Email</Label>
              <Input
                id="guest-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="guest-password">Password</Label>
              <Input
                id="guest-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="8+ characters"
              />
            </div>
            <Button
              type="submit"
              className="mt-1 w-full rounded-xl py-3.5 font-semibold"
            >
              Create account &amp; save reminder
            </Button>
            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="text-xs font-medium text-muted transition-colors hover:text-foreground"
            >
              Back to options
            </button>
          </form>
        )}
      </section>

      <p className="mt-5 text-center text-xs text-muted">
        Already have an account?{" "}
        <a
          href="#"
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
