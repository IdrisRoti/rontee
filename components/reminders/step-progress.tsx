"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type FlowStage = 1 | 2 | 3 | "done";

const LABELS = ["Remember", "When", "Remind me"] as const;

/**
 * Header progress: three segments that fill as you go, the current label
 * highlighted, and a friendly "All done" once the reminder is ready.
 */
export function StepProgress({ stage, className }: { stage: FlowStage; className?: string }) {
  const current = stage === "done" ? 4 : stage;
  const left = stage === "done" ? 0 : 3 - stage;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-center gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={Math.min(current, 3)} aria-label="Reminder steps">
        {LABELS.map((label, i) => {
          const n = i + 1;
          const filled = n < current || stage === "done";
          const active = n === current;
          return (
            <div key={label} className="flex items-center gap-2">
              <span className="relative h-1.5 w-10 overflow-hidden rounded-full bg-border sm:w-14">
                <motion.span
                  className={cn("absolute inset-y-0 left-0 rounded-full", stage === "done" ? "bg-sage" : "bg-primary")}
                  initial={false}
                  animate={{ width: filled ? "100%" : active ? "45%" : "0%" }}
                  transition={{ duration: 0.6, ease: EASE.outExpo }}
                />
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative h-4 w-48 text-center text-xs">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={String(stage)}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={SPRING.soft}
            className="absolute inset-x-0 flex items-center justify-center gap-1.5 text-muted"
          >
            {stage === "done" ? (
              <>
                <Check size={13} strokeWidth={3} aria-hidden className="text-sage" />
                <span className="font-semibold text-foreground">All done</span>
              </>
            ) : (
              <>
                <span className="font-semibold text-foreground">{LABELS[stage - 1]}</span>
                <span aria-hidden>·</span>
                <span>
                  Step {stage} of 3{left > 0 ? `, ${left} to go` : ", last one"}
                </span>
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
