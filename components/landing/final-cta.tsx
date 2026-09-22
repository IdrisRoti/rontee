"use client";

import * as React from "react";
import { Pen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/motion";

/**
 * Closing CTA — canonical quick-create panel.
 * Visual only until reminders are implemented (submits nowhere).
 */
export function FinalCta() {
  const [value, setValue] = React.useState("");

  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="mx-auto max-w-md px-4 pb-16 sm:max-w-[1280px] sm:px-8 sm:pb-28"
    >
      <Reveal>
        <div className="rounded-3xl bg-surface-subtle px-5 py-10 text-center transition-colors sm:mx-auto sm:max-w-4xl sm:px-12 sm:py-20">
          <h2
            id="cta-heading"
            className="text-2xl leading-snug font-extrabold tracking-[-0.035em] text-foreground sm:text-[44px] sm:leading-tight"
          >
            Some things are too important to forget.
          </h2>
          <p className="mt-2 text-xs font-normal text-muted sm:mx-auto sm:mt-3 sm:max-w-xl sm:text-lg">
            Create your first reminder in seconds. No setup fatigue, no
            intrusive notifications.
          </p>

          <form
            className="mx-auto mt-6 flex max-w-xl flex-col gap-2.5 sm:mt-8"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex flex-col gap-2.5 sm:-skew-x-[4deg] sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:border sm:border-border sm:bg-surface sm:p-1.5 sm:px-3 sm:shadow-subtle sm:transition-all sm:focus-within:border-accent">
              <div className="flex items-center rounded-2xl border border-border bg-surface px-3.5 py-1 shadow-subtle transition-colors focus-within:border-accent sm:flex-1 sm:skew-x-[4deg] sm:rounded-full sm:border-0 sm:bg-transparent sm:shadow-none sm:focus-within:border-0">
                <Pen
                  size={12}
                  aria-hidden
                  className="mr-2 shrink-0 text-muted"
                />
                <label htmlFor="cta-reminder-input" className="sr-only">
                  What would you like Rontee to remember?
                </label>
                <input
                  id="cta-reminder-input"
                  type="text"
                  required
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder="What would you like Rontee to remember?"
                  autoComplete="off"
                  className="w-full border-0 bg-transparent py-2.5 text-xs font-medium text-foreground outline-none placeholder:text-muted sm:py-3 sm:text-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-full py-3.5 text-sm sm:w-auto sm:shrink-0 sm:skew-x-[4deg] sm:px-6 sm:py-3"
              >
                Create a reminder
              </Button>
            </div>
          </form>

          <p className="mt-4 text-[11px] font-medium tracking-tight text-muted sm:mt-5 sm:text-xs">
            No credit card required · Free to start · Takes 30 seconds
          </p>
        </div>
      </Reveal>
    </section>
  );
}
