"use client";

import { ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/shared/motion";
import { ICON_SIZES } from "@/lib/icons";

const EXAMPLES = [
  "Mom's birthday",
  "Passport renewal",
  "Car insurance renewal",
  "Wedding anniversary",
] as const;

type StepWhatProps = {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
};

/**
 * Step 1 "Remember" — natural-language writing surface with
 * quick examples. Guests start here with no account.
 */
export function StepWhat({ value, onChange, onContinue }: StepWhatProps) {
  const trimmed = value.trim();

  return (
    <FadeUp y={20} className="flex w-full flex-col">
      <div className="mb-8 text-left">
        <span className="mb-2 inline-block text-[11px] font-bold tracking-wider text-accent-soft uppercase">
          Step 1 of 3 · Remember
        </span>
        <h1 id="wizard-heading" tabIndex={-1} className="text-[34px] leading-[1.15] font-bold tracking-tight text-foreground outline-none sm:text-[42px]">
          What do you want Rontee to remember?
        </h1>
        <p className="mt-3 text-base leading-relaxed font-normal text-muted sm:text-lg">
          Tell Rontee what you don&rsquo;t want to forget, in your own words.
        </p>
      </div>

      <div className="bg-surface p-6 transition-colors focus-within:border-accent/50 sm:p-7 rounded-2xl border border-border shadow-subtle">
        <div className="flex items-start gap-3">
          <label htmlFor="reminder-what" className="sr-only">
            What do you want Rontee to remember?
          </label>
          <textarea
            id="reminder-what"
            rows={3}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && trimmed) {
                event.preventDefault();
                onContinue();
              }
            }}
            placeholder="Dad's 60th birthday on September 28"
            autoComplete="off"
            className="w-full resize-none border-0 bg-transparent p-0 text-[22px] leading-snug font-normal text-foreground outline-none placeholder:text-muted/70 sm:text-[26px]"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              title="Clear text"
              aria-label="Clear text"
              className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
            >
              <X size={ICON_SIZES.prominent} aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <span className="shrink-0 text-xs font-medium text-muted">Examples:</span>
        <div className="flex flex-wrap items-center gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onChange(example)}
              className="rounded-full border border-border bg-surface-subtle px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-border hover:bg-surface hover:text-foreground"
            >
              {example.replace(/ on .*| in .*| due .*| reservations$/, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3.5 sm:mt-14">
        <Button
          type="button"
          onClick={onContinue}
          disabled={!trimmed}
          className="w-full rounded-full px-8 py-3.5 text-[15px] font-semibold shadow-elevated sm:w-auto sm:min-w-[200px]"
        >
          Continue
          <ArrowRight size={ICON_SIZES.default} aria-hidden />
        </Button>
        <p className="mt-1 text-center text-[13px] font-normal text-muted">
          No account needed yet · You can create this reminder before signing
          up.
        </p>
      </div>
    </FadeUp>
  );
}
