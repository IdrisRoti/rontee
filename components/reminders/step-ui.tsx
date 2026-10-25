"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Step title block. The heading receives focus after each step change. */
export function StepHeading({
  title,
  accent,
  children,
  focusOnMount = true,
}: {
  title: string;
  accent: string;
  children?: React.ReactNode;
  focusOnMount?: boolean;
}) {
  const ref = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => {
    if (focusOnMount) ref.current?.focus({ preventScroll: true });
  }, [focusOnMount]);
  return (
    <div className="mb-8">
      <h1 id="wizard-heading" ref={ref} tabIndex={-1} className="type-h1 text-balance outline-none">
        {title} <span className="type-serif">{accent}</span>
      </h1>
      {children && <div className="type-body-lg mt-4 max-w-xl text-pretty text-muted">{children}</div>}
    </div>
  );
}

/** Back + continue, with the primary action on the right. */
export function FlowActions({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  hint,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hint?: React.ReactNode;
}) {
  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <Button type="button" variant="ghost" size="lg" onClick={onBack} className="px-4">
            <ArrowLeft aria-hidden />
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="button" size="lg" onClick={onNext} disabled={nextDisabled} className="group/next min-w-[160px]">
          {nextLabel}
          <ArrowRight aria-hidden className="transition-transform duration-300 ease-out-expo group-hover/next:translate-x-1" />
        </Button>
      </div>
      {hint && <p className="text-right text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

/** Pill option with a sliding selected background (shared `layoutId` per group). */
export function ChoiceChip({
  selected,
  group,
  onClick,
  children,
  dot,
  className,
}: {
  selected: boolean;
  group: string;
  onClick: () => void;
  children: React.ReactNode;
  dot?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-300",
        selected ? "border-transparent text-primary-foreground" : "border-border bg-surface text-foreground hover:border-border-strong",
        className,
      )}
    >
      {selected && (
        <motion.span layoutId={`chip-${group}`} transition={SPRING.snappy} className="absolute inset-0 rounded-full bg-primary" />
      )}
      {dot && <span aria-hidden className={cn("relative size-2.5 rounded-full", dot)} />}
      <span className="relative">{children}</span>
    </button>
  );
}

/**
 * Animates its height to fit its content, so swapping steps grows/shrinks
 * the panel smoothly instead of jumping. Padding keeps focus rings and
 * shadows from being clipped.
 */
export function AutoHeight({ children, className }: { children: React.ReactNode; className?: string }) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | "auto">("auto");

  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div animate={{ height }} transition={SPRING.soft} className={cn("-m-3 overflow-hidden", className)}>
      <div ref={innerRef} className="relative p-3">
        {children}
      </div>
    </motion.div>
  );
}
