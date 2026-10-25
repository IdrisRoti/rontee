import { addDays, addMonths, format, isBefore, startOfDay, subDays } from "date-fns";

import type { CategoryKey } from "@/lib/categories";

export type RepeatOption = "once" | "weekly" | "monthly" | "yearly";

export const REPEAT_OPTIONS: ReadonlyArray<{
  value: RepeatOption;
  label: string;
}> = [
  { value: "once", label: "Just once" },
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
  /** Optional category (product plan step 1). Null = plain note. */
  category: CategoryKey | null;
  /** The date to remember. Null until step 2 is completed. */
  date: Date | null;
  repeat: RepeatOption;
  /** Selected days-before offsets. Must be non-empty to continue. */
  timings: TimingOffset[];
};

export const EMPTY_DRAFT: ReminderDraft = {
  what: "",
  category: null,
  date: null,
  repeat: "yearly",
  timings: [7, 1],
};

export function repeatLabel(repeat: RepeatOption): string {
  switch (repeat) {
    case "once":
      return "Just once";
    case "weekly":
      return "Every week";
    case "monthly":
      return "Every month";
    case "yearly":
      return "Every year";
  }
}

/** "Every year on 12 May." — empty when `once`. */
export function repeatFeedback(repeat: RepeatOption, date: Date): string {
  if (repeat === "once") return "Just this once. We won’t bring it up again after.";
  if (repeat === "yearly") return `Every year on ${format(date, "d MMMM")}.`;
  if (repeat === "monthly") return `Every month on the ${format(date, "do")}.`;
  return `Every ${format(date, "EEEE")}.`;
}

/** "Tue 12 May 2026 · Every year" summary fragment. */
export function dateRepeatSummary(date: Date, repeat: RepeatOption): string {
  return `${format(date, "EEE d MMM yyyy")} · ${repeatLabel(repeat)}`;
}

export function timingLabel(offset: TimingOffset): string {
  if (offset === 0) return "On the day";
  if (offset === 7) return "1 week before";
  if (offset === 14) return "2 weeks before";
  if (offset === 30) return "1 month before";
  return `${offset} day${offset === 1 ? "" : "s"} before`;
}

/** Calendar date on which a timing fires, relative to the remembered date. */
export function timingDate(remembered: Date, offset: TimingOffset): Date {
  return subDays(remembered, offset);
}

export function formatTimingDate(remembered: Date, offset: TimingOffset): string {
  return format(timingDate(remembered, offset), "EEE d MMM");
}

/* ------------------------------------------------------------------ */
/* Friendly guesses from what the person typed. Always overridable.     */
/* ------------------------------------------------------------------ */

const CATEGORY_HINTS: ReadonlyArray<[CategoryKey, RegExp]> = [
  ["documents", /\b(passport|visa|licen[cs]e|id card|mot|registration|permit|lease|renew(al)?)\b/i],
  ["financial", /\b(rent|bill|trial|subscription|netflix|spotify|insurance|tax|council|mortgage|loan|payment|invoice|bank)\b/i],
  ["work", /\b(deadline|exam|uni|university|application|meeting|review|interview|assignment|essay|due|dentist|doctor|appointment)\b/i],
  ["personal", /\b(birthday|bday|anniversary|wedding|mum|mom|dad|grandma|grandad|nan|sister|brother|friend|party|call)\b/i],
];

export function guessCategory(text: string): CategoryKey | null {
  for (const [key, re] of CATEGORY_HINTS) if (re.test(text)) return key;
  return null;
}

export function guessRepeat(text: string): RepeatOption | null {
  if (/\b(birthday|bday|anniversary)\b/i.test(text)) return "yearly";
  if (/\b(rent|every month|monthly|council tax)\b/i.test(text)) return "monthly";
  if (/\b(every week|weekly|every (mon|tues|wednes|thurs|fri|satur|sun)day)\b/i.test(text)) return "weekly";
  if (/\b(trial|deadline|due|appointment|exam|interview|expires?|renew(al)?)\b/i.test(text)) return "once";
  return null;
}

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const MONTH_RE = "(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";

/**
 * Spots a day + month in free text ("May 12", "12th May", "28 Sept").
 * Returns the next occurrence from today, or null.
 */
export function guessDate(text: string, today = new Date()): Date | null {
  const t = text.toLowerCase();
  const a = new RegExp(`\\b${MONTH_RE}\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b`).exec(t);
  const b = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?${MONTH_RE}\\b`).exec(t);
  let month: number | null = null;
  let day: number | null = null;
  if (a) {
    month = MONTHS.findIndex((m) => m.startsWith(a[1].slice(0, 3)));
    day = Number(a[2]);
  } else if (b) {
    month = MONTHS.findIndex((m) => m.startsWith(b[2].slice(0, 3)));
    day = Number(b[1]);
  } else if (/\btomorrow\b/.test(t)) {
    return startOfDay(addDays(today, 1));
  } else if (/\bnext week\b/.test(t)) {
    return startOfDay(addDays(today, 7));
  } else if (/\bnext month\b/.test(t)) {
    return startOfDay(addMonths(today, 1));
  }
  if (month === null || month < 0 || !day || day > 31) return null;
  let date = new Date(today.getFullYear(), month, day);
  if (date.getMonth() !== month) return null; // e.g. 31 June
  if (isBefore(date, startOfDay(today))) date = new Date(today.getFullYear() + 1, month, day);
  return date;
}

/* ------------------------------------------------------------------ */
/* Guest draft persistence across the signup detour                     */
/* ------------------------------------------------------------------ */

const DRAFT_STORAGE_KEY = "rontee:reminder-draft";
const CATEGORY_KEYS: ReadonlyArray<CategoryKey> = ["personal", "financial", "documents", "work"];

type StoredDraft = {
  what: string;
  category: CategoryKey | null;
  date: string | null;
  repeat: RepeatOption;
  timings: TimingOffset[];
};

/** Holds the guest draft across the signup detour (client only). */
export function saveDraft(draft: ReminderDraft): void {
  try {
    const stored: StoredDraft = {
      what: draft.what,
      category: draft.category,
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
    if (!parsed.what?.trim() || !date || Number.isNaN(date.getTime())) return null;
    const repeat: RepeatOption =
      parsed.repeat === "once" || parsed.repeat === "weekly" || parsed.repeat === "monthly" || parsed.repeat === "yearly"
        ? parsed.repeat
        : "yearly";
    const timings = (parsed.timings ?? []).filter((t): t is TimingOffset =>
      (TIMING_OFFSETS as readonly number[]).includes(t),
    );
    if (timings.length === 0) return null;
    const category = parsed.category && CATEGORY_KEYS.includes(parsed.category) ? parsed.category : null;
    return { what: parsed.what.slice(0, 280), category, date, repeat, timings };
  } catch {
    return null;
  }
}
