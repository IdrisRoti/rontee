import Link from "next/link";

import { Logo } from "@/components/shared/logo";

const FOOTER_LINKS = [
  { label: "How it works", href: "#how-it-works", accent: false },
  { label: "What to remember", href: "#what-to-remember", accent: false },
  { label: "Log in", href: "#login", accent: false },
  { label: "Create a reminder", href: "#cta", accent: true },
  { label: "Privacy", href: "#", accent: false },
  { label: "Terms", href: "#", accent: false },
] as const;

/**
 * Quiet landing footer — canonical links and tagline.
 * Mobile: centered stack. Desktop: spacious row.
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface px-5 py-8 transition-colors sm:px-8 sm:py-12 lg:px-10">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center sm:max-w-[1280px] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-left">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link href="#" aria-label="Rontee home" className="rounded-md">
            <span className="[&_svg]:h-6">
              <Logo />
            </span>
          </Link>
          <span
            aria-hidden
            className="hidden text-border sm:inline"
          >
            ·
          </span>
          <span className="text-xs font-medium text-muted">
            Never forget what matters.
          </span>
        </div>

        <nav
          aria-label="Footer"
          className="mt-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-muted sm:mt-0 sm:gap-7"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                link.accent
                  ? "text-accent transition-opacity hover:opacity-80"
                  : "transition-colors hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
