import type { Metadata } from "next";

import { ReminderWizard } from "@/components/reminders/wizard";
import { PageTransition } from "@/components/shared/page-transition";

export const metadata: Metadata = {
  title: "Create a reminder",
  description: "Tell Rontee what you don't want to forget. No account needed to start.",
  alternates: { canonical: "/reminders/new" },
};

/**
 * Guest-first create-reminder flow: Remember → When → Remind me → ready.
 * Search params are read here (not with useSearchParams + Suspense) so the
 * wizard renders in the same commit as the navigation — that's what lets
 * the landing page's capture field morph into the writing card.
 */
export default async function NewReminderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const recovered = sp.recovered === "1";

  return (
    <PageTransition>
      <div className="w-full">
        <ReminderWizard initialWhat={q} recovered={recovered} />
      </div>
    </PageTransition>
  );
}
