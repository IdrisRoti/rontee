"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Shared, SHARED } from "@/components/shared/page-transition";
import { useFinePointer } from "@/components/landing/paper";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ChoiceChip, FlowActions, StepHeading } from "./step-ui";

const EXAMPLES = [
  { text: "Mum’s birthday on 12 May", dot: "bg-blush" },
  { text: "Passport renewal", dot: "bg-sky" },
  { text: "Netflix trial ends Friday", dot: "bg-sage" },
  { text: "Uni application due 30 June", dot: "bg-butter" },
] as const;

type StepWhatProps = {
  value: string;
  category: CategoryKey | null;
  categoryGuessed: boolean;
  onChange: (value: string) => void;
  onCategory: (category: CategoryKey | null) => void;
  onContinue: () => void;
};

/** Step 1 — "What shouldn't you forget?" Free text + optional category. */
export function StepWhat({ value, category, categoryGuessed, onChange, onCategory, onContinue }: StepWhatProps) {
  const fieldRef = React.useRef<HTMLTextAreaElement>(null);
  const fine = useFinePointer();
  const trimmed = value.trim();

  // Desktop: start typing straight away, caret at the end of any prefill.
  React.useEffect(() => {
    const el = fieldRef.current;
    if (!fine || !el) return;
    el.focus({ preventScroll: true });
    el.setSelectionRange(el.value.length, el.value.length);
  }, [fine]);

  return (
    <div>
      <StepHeading title="What shouldn’t you" accent="forget?" focusOnMount={false}>
        Write it like you’d tell a friend. If you mention the date, we’ll pick it up for you.
      </StepHeading>

      <Shared name={SHARED.capture}>
        <div className="rounded-[28px] border border-border bg-surface p-5 shadow-float transition-[border-color,box-shadow] duration-300 focus-within:border-border-strong sm:p-6">
          <label htmlFor="reminder-what" className="sr-only">
            What do you want to remember?
          </label>
          <textarea
            ref={fieldRef}
            id="reminder-what"
            rows={2}
            maxLength={280}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && trimmed) {
                e.preventDefault();
                onContinue();
              }
            }}
            placeholder="Dad’s 60th birthday on 28 September"
            autoComplete="off"
            className="w-full resize-none bg-transparent text-[22px] leading-snug tracking-[-0.015em] text-foreground outline-none placeholder:text-faint sm:text-[26px]"
          />
          <div className="mt-3 flex h-8 items-center justify-between text-[13px] text-faint">
            <AnimatePresence initial={false}>
              {value && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => {
                    onChange("");
                    fieldRef.current?.focus();
                  }}
                  className="flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-surface-subtle hover:text-foreground"
                >
                  <X size={14} aria-hidden /> Clear
                </motion.button>
              )}
            </AnimatePresence>
            <span className="ml-auto hidden sm:inline">
              Press <kbd className="rounded border border-border px-1.5 py-0.5 font-sans text-[11px]">Enter</kbd> to continue
            </span>
          </div>
        </div>
      </Shared>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-0.5 text-sm text-muted">Or start with</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.text}
            type="button"
            onClick={() => {
              onChange(ex.text);
              fieldRef.current?.focus();
            }}
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-medium shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:-rotate-1 hover:border-border-strong"
          >
            <span aria-hidden className={cn("size-2 rounded-full", ex.dot)} />
            {ex.text}
          </button>
        ))}
      </div>

      <fieldset className="mt-10">
        <legend className="mb-3 flex items-baseline gap-2 text-base font-semibold">
          What kind of thing is it?
          <span className="text-sm font-normal text-muted">Optional</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
            <ChoiceChip
              key={key}
              group="category"
              selected={category === key}
              onClick={() => onCategory(category === key ? null : key)}
              dot={CATEGORIES[key].dot}
            >
              {CATEGORIES[key].label}
            </ChoiceChip>
          ))}
        </div>
        <div className="mt-3 h-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {category && categoryGuessed && (
              <motion.p
                key={category}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE.outQuart }}
                className="type-hand text-lg text-muted"
              >
                ↑ our guess. Tap another if we got it wrong
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </fieldset>

      <FlowActions onNext={onContinue} nextDisabled={!trimmed} hint={!trimmed ? "Write something first and we’ll take it from there." : undefined} />
    </div>
  );
}
