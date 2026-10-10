import * as React from "react";
import type { Metadata } from "next";

import { FlowHeader } from "@/components/reminders/flow-header";
import { ReminderWizard } from "@/components/reminders/wizard";

export const metadata: Metadata = {
  title: "Create a reminder",
  description:
    "Tell Rontee what you don't want to forget — no account needed to start.",
};

/**
 * Guest-first create-reminder flow from Stitch:
 * Remember → When → Remind me → account gate → saved.
 * No backend yet: the draft lives in client state until signup.
 */
export default function NewReminderPage() {
  return (
    <div className="flex min-h-full w-full max-w-full flex-col overflow-x-clip bg-background text-foreground">
      <FlowHeader />
      <main className="flex w-full max-w-full flex-1 flex-col overflow-x-clip">
        <div className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          <React.Suspense>
            <ReminderWizard />
          </React.Suspense>
        </div>
      </main>
      <footer className="w-full border-t border-border px-6 py-5 sm:px-12">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
          <span>© 2026 Rontee. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <span aria-hidden>·</span>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
