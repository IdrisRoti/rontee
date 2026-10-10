import { format, subDays } from "date-fns";

export type RepeatOption = "once" | "weekly" | "monthly" | "yearly";

export const REPEAT_OPTIONS: ReadonlyArray<{
  value: RepeatOption;
  label: string;
}> = [
  { value: "once", label: "Doesn't repeat" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
  { value: "yearly", label: "Every year" },
];

/** Days-before offsets offered on step 3. `0` renders as "On the day". */
export const TIMING_OFFSETS = [30, 14, 7, 3, 1, 0] as const;
export type TimingOffset = (typeof TIMING_OFFSETS)[number];

export type ReminderDraft = {
  /** Free-text "what", e.g. "Dad's 60th birthday on September 28". */
  what: string;
  /** The date to remember. Null until step 2 is completed. */
  date: Date | null;
  repeat: RepeatOption;
  /** Selected days-before offsets. Must be non-empty to continue. */
  timings: TimingOffset[];
};

export const EMPTY_DRAFT: ReminderDraft = {
  what: "",
  date: null,
  repeat: "yearly",
  timings: [30, 7, 1],
};

export function repeatLabel(repeat: RepeatOption): string {
  switch (repeat) {
    case "once":
      return "Doesn't repeat";
    case "weekly":
      return "Repeats every week";
    case "monthly":
      return "Repeats every month";
    case "yearly":
      return "Repeats every year";
  }
}

/** "Repeats every year on September 28." — empty when `once`. */
export function repeatFeedback(repeat: RepeatOption, date: Date): string {
  if (repeat === "once") return "";
  if (repeat === "yearly")
    return `Repeats every year on ${format(date, "MMMM d")}.`;
  if (repeat === "monthly")
    return `Repeats every month on the ${format(date, "do")}.`;
  return `Repeats every week on ${format(date, "EEEE")}.`;
}

/** "September 28, 2026 · Repeats every year" summary fragment. */
export function dateRepeatSummary(date: Date, repeat: RepeatOption): string {
  return `${format(date, "MMMM d, yyyy")} · ${repeatLabel(repeat)}`;
}

export function timingLabel(offset: TimingOffset): string {
  return offset === 0 ? "On the day" : `${offset} day${offset === 1 ? "" : "s"} before`;
}

/** Calendar date on which a timing fires, relative to the remembered date. */
export function timingDate(remembered: Date, offset: TimingOffset): Date {
  return subDays(remembered, offset);
}

export function formatTimingDate(remembered: Date, offset: TimingOffset): string {
  return format(timingDate(remembered, offset), "MMM d, yyyy");
}

const DRAFT_STORAGE_KEY = "rontee:reminder-draft";

type StoredDraft = {
  what: string;
  date: string | null;
  repeat: RepeatOption;
  timings: TimingOffset[];
};

/** Holds the guest draft across the signup detour (client only). */
export function saveDraft(draft: ReminderDraft): void {
  try {
    const stored: StoredDraft = {
      what: draft.what,
      date: draft.date ? draft.date.toISOString() : null,
      repeat: draft.repeat,
      timings: draft.timings,
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Private mode / quota — the flow still works in-memory.
  }
}

/** Restores a held draft, or null when absent/invalid/expired shape. */
export function loadDraft(): ReminderDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    const date = parsed.date ? new Date(parsed.date) : null;
    if (!parsed.what?.trim() || !date || Number.isNaN(date.getTime()))
      return null;
    const repeat: RepeatOption =
      parsed.repeat === "once" ||
      parsed.repeat === "weekly" ||
      parsed.repeat === "monthly" ||
      parsed.repeat === "yearly"
        ? parsed.repeat
        : "yearly";
    const timings = (parsed.timings ?? []).filter((t): t is TimingOffset =>
      (TIMING_OFFSETS as readonly number[]).includes(t),
    );
    if (timings.length === 0) return null;
    return { what: parsed.what.slice(0, 280), date, repeat, timings };
  } catch {
    return null;
  }
}
