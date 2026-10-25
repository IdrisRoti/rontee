/**
 * Reminder categories (product plan) and their pastel colour.
 * Colour = category everywhere: paper notes, chips, calendar dots, app lists.
 * Text on a pastel is always `text-ink` (dark in both themes).
 */
export const CATEGORIES = {
  personal: { label: "Personal", hint: "Birthdays & anniversaries", bg: "bg-blush", dot: "bg-blush" },
  financial: { label: "Financial", hint: "Bills & subscriptions", bg: "bg-sage", dot: "bg-sage" },
  documents: { label: "Documents", hint: "Passports & renewals", bg: "bg-sky", dot: "bg-sky" },
  work: { label: "Work & study", hint: "Deadlines & milestones", bg: "bg-butter", dot: "bg-butter" },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
