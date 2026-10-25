/**
 * Site-wide constants for SEO, metadata routes and structured data.
 * NEXT_PUBLIC_SITE_URL overrides the production URL (e.g. custom domain).
 */
export const site = {
  name: "Rontee",
  shortName: "rontee",
  tagline: "Never forget what matters.",
  title: "Rontee — Never forget what matters",
  description:
    "Rontee is a personal reminder app for the dates that matter — birthdays, anniversaries, renewals, subscriptions and deadlines. Tell it once, get a gentle nudge before it's too late.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rontee.vercel.app").replace(/\/$/, ""),
  locale: "en_US",
  keywords: [
    "reminder app",
    "birthday reminder",
    "anniversary reminder",
    "renewal reminder",
    "subscription reminder",
    "free trial reminder",
    "passport expiry reminder",
    "personal reminders",
    "important dates",
    "never forget",
  ],
} as const;
