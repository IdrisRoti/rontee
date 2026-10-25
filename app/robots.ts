import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Longest match wins: /reminders/new (guest flow) stays crawlable.
      allow: ["/", "/reminders/new"],
      // Authenticated app + token-bound auth steps carry no public content.
      disallow: ["/dashboard", "/reminders", "/calendar", "/settings", "/reset-password"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
