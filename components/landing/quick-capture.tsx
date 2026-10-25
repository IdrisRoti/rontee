"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "Mum’s birthday on May 12",
  "Passport expires next March",
  "Netflix trial ends Friday",
  "Car insurance renews in August",
  "Our anniversary, June 21",
] as const;

const SUGGESTIONS = [
  { label: "A birthday", value: "Mum’s birthday on May 12", color: "bg-blush" },
  { label: "A renewal", value: "Passport renewal", color: "bg-sky" },
  { label: "A free trial", value: "Netflix trial ends Friday", color: "bg-sage" },
  { label: "A deadline", value: "Uni application due Friday", color: "bg-butter" },
] as const;

/** Types and deletes example reminders while the field is empty. */
function useCyclingPlaceholder(active: boolean) {
  const reduce = useReducedMotion();
  const [state, setState] = React.useState({ index: 0, chars: 0, deleting: false });

  React.useEffect(() => {
    if (!active || reduce) return;
    const text = EXAMPLES[state.index];
    let wait = state.deleting ? 22 : 48;
    if (!state.deleting && state.chars === text.length) wait = 1900;
    if (state.deleting && state.chars === 0) wait = 280;
    const id = window.setTimeout(() => {
      setState((s) => {
        const t = EXAMPLES[s.index];
        if (!s.deleting && s.chars === t.length) return { ...s, deleting: true };
        if (s.deleting && s.chars === 0)
          return { index: (s.index + 1) % EXAMPLES.length, chars: 0, deleting: false };
        return { ...s, chars: s.chars + (s.deleting ? -1 : 1) };
      });
    }, wait);
    return () => window.clearTimeout(id);
  }, [active, reduce, state]);

  return reduce ? EXAMPLES[0] : EXAMPLES[state.index].slice(0, state.chars);
}

/**
 * "What do you want to remember?" — starts the guest flow with step 1
 * prefilled (`/reminders/new?q=`). Suggestion chips fill the field.
 */
export function QuickCapture({
  className,
  id = "quick-capture",
  showSuggestions = true,
}: {
  className?: string;
  id?: string;
  showSuggestions?: boolean;
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const placeholder = useCyclingPlaceholder(!value && !focused);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const q = value.trim();
    router.push(q ? `/reminders/new?q=${encodeURIComponent(q)}` : "/reminders/new");
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={submit} role="search" aria-label="Start a reminder">
        <motion.div
          animate={{ scale: focused ? 1.012 : 1 }}
          transition={SPRING.soft}
          className={cn(
            "group relative flex h-16 items-center gap-2 rounded-full border bg-surface p-2 pl-6 shadow-float transition-colors duration-300",
            focused ? "border-border-strong" : "border-border",
          )}
        >
          <label htmlFor={id} className="sr-only">
            What do you want to remember?
          </label>
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              id={id}
              name="q"
              autoComplete="off"
              maxLength={280}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={focused ? "What do you want to remember?" : ""}
              className="w-full bg-transparent text-base tracking-[-0.01em] text-foreground outline-none placeholder:text-faint"
            />
            {!value && !focused && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-base tracking-[-0.01em] text-faint"
              >
                {placeholder}
                <span className="animate-caret text-foreground/50" />
              </span>
            )}
          </div>
          <button
            type="submit"
            className="group/btn relative flex h-12 shrink-0 items-center gap-2 overflow-hidden rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform duration-200 active:scale-[0.97]"
          >
            <span className="hidden sm:inline">Remember this</span>
            <span className="sm:hidden">Start</span>
            <span className="relative flex size-4 overflow-hidden">
              <ArrowRight
                size={16}
                aria-hidden
                className="absolute transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-5"
              />
              <ArrowRight
                size={16}
                aria-hidden
                className="absolute -translate-x-5 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0"
              />
            </span>
          </button>
        </motion.div>
      </form>

      {showSuggestions && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-0.5 text-sm text-muted">Or try</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setValue(s.value);
                inputRef.current?.focus();
              }}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:-rotate-1 hover:border-border-strong active:translate-y-0"
            >
              <span aria-hidden className={cn("size-2 rounded-full", s.color)} />
              {s.label}
            </button>
          ))}
          <AnimatePresence>
            {value && (
              <motion.button
                type="button"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.3, ease: EASE.outExpo }}
                onClick={() => {
                  setValue("");
                  inputRef.current?.focus();
                }}
                className="px-2 py-1.5 text-[13px] text-faint underline-offset-4 hover:text-foreground hover:underline"
              >
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
