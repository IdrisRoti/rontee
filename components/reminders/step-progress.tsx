import * as React from "react";

import { cn } from "@/lib/utils";

const STEPS = [
  { number: "01", label: "Remember" },
  { number: "02", label: "When" },
  { number: "03", label: "Remind me" },
] as const;

type StepProgressProps = {
  /** 1-indexed active step. */
  current: 1 | 2 | 3;
};

/**
 * Quiet 3-step indicator from the Stitch create-reminder flow:
 * active step in teal, completed steps muted with a teal dot,
 * upcoming steps muted. Connector hairlines between.
 */
export function StepProgress({ current }: StepProgressProps) {
  return (
    <div
      className="flex w-full items-center"
      role="list"
      aria-label={`Step ${current} of 3`}
    >
      {STEPS.map((step, index) => {
        const stepNumber = (index + 1) as 1 | 2 | 3;
        const isActive = stepNumber === current;
        const isDone = stepNumber < current;
        return (
          <React.Fragment key={step.number}>
            {index > 0 && (
              <div
                aria-hidden
                className="mx-2 h-px min-w-3 flex-1 bg-border sm:mx-3"
              />
            )}
            <div
              role="listitem"
              aria-current={isActive ? "step" : undefined}
              className="flex shrink-0 items-center gap-2"
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border",
                  (isActive || isDone) && "border-accent/40 bg-accent-subtle",
                  !isActive && !isDone && "border-border bg-surface-subtle",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "rounded-full",
                    isActive && "size-2 bg-accent",
                    isDone && "size-1.5 bg-accent",
                    !isActive && !isDone && "size-1.5 bg-muted/50",
                  )}
                />
              </span>
              <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                <span
                  className={cn(
                    "text-xs",
                    isActive
                      ? "font-bold text-accent-soft"
                      : "font-semibold text-muted",
                  )}
                >
                  {step.number}
                </span>
                <span
                  className={cn(
                    "hidden text-sm min-[420px]:inline",
                    isActive
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted",
                  )}
                >
                  {step.label}
                </span>
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
