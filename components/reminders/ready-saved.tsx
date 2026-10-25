"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { FadeIn } from "@/components/shared/kinetic";
import { Button } from "@/components/ui/button";
import { formatTimingDate, type ReminderDraft } from "@/lib/reminder-draft";

/** Saved confirmation (after the signup detour, or for signed-in users). */
export function ReadySaved({ draft, onCreateAnother }: { draft: ReminderDraft; onCreateAnother: () => void }) {
  const dates = draft.date ? draft.timings.map((t) => formatTimingDate(draft.date as Date, t)) : [];
  const list =
    dates.length > 1 ? `${dates.slice(0, -1).join(", ")} and ${dates[dates.length - 1]}` : (dates[0] ?? "");

  return (
    <div className="flex flex-col items-center text-center">
      <FadeIn immediate delay={0.35}>
        <h1 id="wizard-heading" tabIndex={-1} className="type-h1 text-balance outline-none">
          All set! <span className="type-serif">We’ve got it from here.</span>
        </h1>
      </FadeIn>
      <FadeIn immediate delay={0.45}>
        <p className="type-body-lg mx-auto mt-4 max-w-md text-pretty text-muted">
          {list ? <>We’ll give you a nudge on {list}. You can forget about it until then.</> : "You can forget about it now."}
        </p>
      </FadeIn>
      <FadeIn immediate delay={0.55} className="mt-8 flex w-full max-w-sm flex-col gap-2.5 sm:flex-row">
        <Button type="button" size="lg" className="flex-1" onClick={onCreateAnother}>
          <Plus aria-hidden />
          Add another
        </Button>
        <Button asChild variant="secondary" size="lg" className="flex-1">
          <Link href="/" transitionTypes={["nav-back"]}>
            Back to home
          </Link>
        </Button>
      </FadeIn>
    </div>
  );
}
