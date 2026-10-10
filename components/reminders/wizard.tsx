"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { ReadyGuest } from "./ready-guest";
import { ReadySaved } from "./ready-saved";
import { StepProgress } from "./step-progress";
import { StepTimings } from "./step-timings";
import { StepWhat } from "./step-what";
import { StepWhen } from "./step-when";
import {
  EMPTY_DRAFT,
  TIMING_OFFSETS,
  type ReminderDraft,
  type RepeatOption,
  type TimingOffset,
} from "@/lib/reminder-draft";

type WizardStep = 1 | 2 | 3 | "ready" | "saved";

function sortTimings(timings: TimingOffset[]): TimingOffset[] {
  return [...timings].sort(
    (a, b) => TIMING_OFFSETS.indexOf(a) - TIMING_OFFSETS.indexOf(b),
  );
}

/**
 * Guest-first create-reminder wizard from the Stitch flow.
 * Steps 1–3 need no account; the draft is held in local state
 * until the guest creates an account on the "ready" gate.
 * Prefills step 1 from `?q=` (landing-page CTA input).
 */
export function ReminderWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState<WizardStep>(1);
  const [draft, setDraft] = React.useState<ReminderDraft>(() => ({
    ...EMPTY_DRAFT,
    timings: [...EMPTY_DRAFT.timings],
    what: (searchParams.get("q") ?? "").slice(0, 280),
  }));

  const setWhat = (what: string) =>
    setDraft((d) => ({ ...d, what: what.slice(0, 280) }));
  const setDate = (date: Date) => setDraft((d) => ({ ...d, date }));
  const setRepeat = (repeat: RepeatOption) => setDraft((d) => ({ ...d, repeat }));
  const toggleTiming = (offset: TimingOffset) =>
    setDraft((d) => ({
      ...d,
      timings: sortTimings(
        d.timings.includes(offset)
          ? d.timings.filter((t) => t !== offset)
          : [...d.timings, offset],
      ),
    }));

  const reset = () =>
    setDraft({ ...EMPTY_DRAFT, timings: [...EMPTY_DRAFT.timings] });

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      {step !== "ready" && step !== "saved" && (
        <div className="mb-10 sm:mb-12">
          <StepProgress current={step} />
        </div>
      )}

      {step === 1 && (
        <StepWhat
          value={draft.what}
          onChange={setWhat}
          onContinue={() => draft.what.trim() && setStep(2)}
        />
      )}

      {step === 2 && (
        <StepWhen
          what={draft.what}
          date={draft.date}
          repeat={draft.repeat}
          onDateChange={setDate}
          onRepeatChange={setRepeat}
          onEditWhat={() => setStep(1)}
          onContinue={() => {
            if (!draft.date) setDraft((d) => ({ ...d, date: new Date() }));
            setStep(3);
          }}
        />
      )}

      {step === 3 && draft.date && (
        <StepTimings
          what={draft.what}
          date={draft.date}
          repeat={draft.repeat}
          timings={draft.timings}
          onToggleTiming={toggleTiming}
          onEditWhen={() => setStep(2)}
          onCreate={() => draft.timings.length > 0 && setStep("ready")}
        />
      )}

      {step === "ready" && draft.date && (
        <ReadyGuest
          what={draft.what}
          date={draft.date}
          repeat={draft.repeat}
          timings={draft.timings}
          onAccountCreated={() => setStep("saved")}
        />
      )}

      {step === "saved" && draft.date && (
        <ReadySaved
          what={draft.what}
          date={draft.date}
          repeat={draft.repeat}
          timings={draft.timings}
          onCreateAnother={() => {
            reset();
            setStep(1);
          }}
        />
      )}
    </div>
  );
}
