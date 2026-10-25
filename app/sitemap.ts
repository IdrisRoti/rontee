import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/** Public, indexable routes only. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/reminders/new`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/signup`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/login`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
