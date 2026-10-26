"use client";

import * as React from "react";

import { loadDraft, type ReminderDraft } from "@/lib/reminder-draft";

const noopSubscribe = () => () => {};

/** Live media query. `serverValue` is used for SSR and hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  return React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Desktop layout (lg and up). Server renders the wide layout. */
export function useWide() {
  return useMediaQuery("(min-width: 1024px)", true);
}

/**
 * The guest's held draft (localStorage, so null on the server and during
 * hydration). On a client-side navigation it's there in the first render,
 * which is what lets the note morph between pages.
 */
export function useHeldDraft(enabled = true): ReminderDraft | null {
  return React.useSyncExternalStore(noopSubscribe, () => (enabled ? loadDraft() : null), () => null);
}
