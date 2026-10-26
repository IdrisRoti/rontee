"use client";

import * as React from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import type { CategoryKey } from "@/lib/categories";
import { EASE } from "@/lib/motion";
import {
  EMPTY_DRAFT,
  TIMING_OFFSETS,
  guessCategory,
  guessDate,
  guessRepeat,
  clearDraft,
  saveDraft,
  type ReminderDraft,
  type RepeatOption,
  type TimingOffset,
} from "@/lib/reminder-draft";
import { useHeldDraft, useWide } from "@/lib/use-client";
import { Shared, SHARED } from "@/components/shared/page-transition";
import { DraftNote, PaperConfetti, type EditTarget } from "./draft-note";
import { FlowHeader } from "./flow-header";
import { ReadyGuest } from "./ready-guest";
import { ReadySaved } from "./ready-saved";
import { StepTimings, timingHasPassed } from "./step-timings";
import { AutoHeight } from "./step-ui";
import { StepWhat } from "./step-what";
import { StepWhen } from "./step-when";

type WizardStep = 1 | 2 | 3 | "ready" | "saved";
const ORDER: ReadonlyArray<WizardStep> = [1, 2, 3, "ready", "saved"];

function sortTimings(timings: TimingOffset[]): TimingOffset[] {
  return [...timings].sort((a, b) => TIMING_OFFSETS.indexOf(a) - TIMING_OFFSETS.indexOf(b));
}

/** Direction-aware step slide: forward exits left / enters from right. */
const STEP_VARIANTS = {
  enter: (d: number) => ({ opacity: 0, x: d * 56, filter: "blur(8px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (d: number) => ({ opacity: 0, x: d * -56, filter: "blur(8px)" }),
};

/**
 * Guest-first create-reminder flow: Remember → When → Remind me → ready.
 * The draft note is one continuous object across all of it. Steps slide by
 * direction, the panel height animates, and the note flies to the centre
 * when the reminder is ready. Prefills from `?q=` (via the page); restores after signup
 * via `?recovered=1`.
 */
export function ReminderWizard({ initialWhat = "", recovered = false }: { initialWhat?: string; recovered?: boolean }) {
  const wide = useWide();

  const [step, setStep] = React.useState<WizardStep>(1);
  const [dir, setDir] = React.useState<1 | -1>(1);
  const [draft, setDraft] = React.useState<ReminderDraft>(() => {
    const what = initialWhat.slice(0, 280);
    return { ...EMPTY_DRAFT, timings: [...EMPTY_DRAFT.timings], what, category: guessCategory(what) };
  });
  const [categoryTouched, setCategoryTouched] = React.useState(false);
  const [repeatTouched, setRepeatTouched] = React.useState(false);
  const [dateGuessed, setDateGuessed] = React.useState(false);

  // Back from signup: the held draft lives in localStorage, which the server can't see.
  // Read it after hydration (server snapshot = null) and adopt it once, during render.
  const held = useHeldDraft(recovered);
  const [adopted, setAdopted] = React.useState(false);
  if (held && !adopted) {
    setAdopted(true);
    setDraft(held);
    setStep("saved");
  }

  // Hold the draft while the guest creates an account; let it go once it's saved.
  React.useEffect(() => {
    if (step === "ready") saveDraft(draft);
    if (step === "saved") clearDraft();
  }, [step, draft]);

  const goTo = (next: WizardStep) => {
    setDir(ORDER.indexOf(next) >= ORDER.indexOf(step) ? 1 : -1);
    setStep(next);
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---- step transitions with friendly guesses ---- */

  const toWhen = () => {
    if (!draft.what.trim()) return;
    const guessedDate = draft.date ? null : guessDate(draft.what);
    const guessedRepeat = repeatTouched ? null : guessRepeat(draft.what);
    setDraft((d) => ({ ...d, date: d.date ?? guessedDate, repeat: guessedRepeat ?? d.repeat }));
    if (guessedDate) setDateGuessed(true);
    goTo(2);
  };

  const toRemind = () => {
    if (!draft.date) return;
    const date = draft.date;
    // Drop nudges that would land in the past; keep at least "on the day".
    setDraft((d) => {
      const ok = d.timings.filter((t) => !timingHasPassed(date, t));
      return { ...d, timings: ok.length ? ok : [0] };
    });
    goTo(3);
  };

  const toReady = () => {
    if (!draft.date) return;
    const date = draft.date;
    setDraft((d) => ({ ...d, timings: d.timings.filter((t) => !timingHasPassed(date, t)) }));
    goTo("ready");
  };

  const edit = (target: EditTarget) => goTo(target);

  /* ---- field setters ---- */

  const setWhat = (what: string) =>
    setDraft((d) => ({ ...d, what: what.slice(0, 280), category: categoryTouched ? d.category : guessCategory(what) }));
  const setCategory = (category: CategoryKey | null) => {
    setCategoryTouched(true);
    setDraft((d) => ({ ...d, category }));
  };
  const setDate = (date: Date) => {
    setDateGuessed(false);
    setDraft((d) => ({ ...d, date }));
  };
  const setRepeat = (repeat: RepeatOption) => {
    setRepeatTouched(true);
    setDraft((d) => ({ ...d, repeat }));
  };
  const toggleTiming = (offset: TimingOffset) =>
    setDraft((d) => ({
      ...d,
      timings: sortTimings(d.timings.includes(offset) ? d.timings.filter((t) => t !== offset) : [...d.timings, offset]),
    }));

  const reset = () => {
    setCategoryTouched(false);
    setRepeatTouched(false);
    setDateGuessed(false);
    setDraft({ ...EMPTY_DRAFT, timings: [...EMPTY_DRAFT.timings] });
    goTo(1);
  };

  const inFlow = step === 1 || step === 2 || step === 3;
  const stage = inFlow ? step : "done";

  return (
    <div className="flex min-h-dvh flex-col">
      <FlowHeader stage={stage} />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 pt-6 pb-24 sm:px-8 sm:pt-12">
        <LayoutGroup>
          <AnimatePresence mode="popLayout" initial={false}>
            {inFlow ? (
              <motion.div
                key="flow"
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20"
              >
                <div className="min-w-0">
                  {!wide && (
                    <div className="mb-8">
                      <DraftNote draft={draft} size="compact" writing={step === 1} onEdit={step > 1 ? edit : undefined} />
                    </div>
                  )}

                  <AutoHeight>
                    <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                      <motion.section
                        key={step}
                        custom={dir}
                        variants={STEP_VARIANTS}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.55, ease: EASE.outExpo }}
                        aria-labelledby="wizard-heading"
                      >
                        {step === 1 && (
                          <StepWhat
                            value={draft.what}
                            category={draft.category}
                            categoryGuessed={!categoryTouched}
                            onChange={setWhat}
                            onCategory={setCategory}
                            onContinue={toWhen}
                          />
                        )}
                        {step === 2 && (
                          <StepWhen
                            date={draft.date}
                            dateGuessed={dateGuessed}
                            repeat={draft.repeat}
                            onDateChange={setDate}
                            onRepeatChange={setRepeat}
                            onBack={() => goTo(1)}
                            onContinue={toRemind}
                          />
                        )}
                        {step === 3 && draft.date && (
                          <StepTimings
                            date={draft.date}
                            timings={draft.timings}
                            onToggleTiming={toggleTiming}
                            onBack={() => goTo(2)}
                            onCreate={toReady}
                          />
                        )}
                      </motion.section>
                    </AnimatePresence>
                  </AutoHeight>
                </div>

                {wide && (
                  <aside aria-label="Your reminder so far">
                    <div className="sticky top-32">
                      <p className="type-hand mb-5 text-xl text-muted">your reminder so far…</p>
                      <DraftNote
                        draft={draft}
                        size="aside"
                        writing={step === 1}
                        showTimings={step === 3}
                        onEdit={step > 1 ? edit : undefined}
                      />
                      <p className="mt-6 text-[13px] text-faint">Tap any part of the note to change it.</p>
                    </div>
                  </aside>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-auto flex max-w-[560px] flex-col items-center pt-4"
              >
                <div className="relative mb-10 w-full max-w-[420px]">
                  <PaperConfetti />
                  {/* Shared with the auth pages: the note travels to signup and back. */}
                  <Shared name={SHARED.draft}>
                    <DraftNote draft={draft} size="hero" stamp={step === "saved" ? "saved" : null} />
                  </Shared>
                </div>
                {step === "ready" && <ReadyGuest onEdit={() => goTo(3)} />}
                {step === "saved" && <ReadySaved draft={draft} onCreateAnother={reset} />}
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </main>
    </div>
  );
}
