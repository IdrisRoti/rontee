import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { ThemeMenu } from "@/components/shared/theme-menu";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "What to remember", href: "#remember" },
  { label: "FAQ", href: "#faq" },
  { label: "Sign up", href: "/signup" },
  { label: "Log in", href: "/login" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

/** Simple, warm footer. */
export function Footer() {
  return (
    <footer className="px-4 pt-6 pb-10 sm:px-8">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-8 border-t border-border pt-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="type-hand mt-3 text-xl text-muted">Never forget what matters.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex max-w-md flex-wrap gap-x-6 gap-y-3 text-sm text-muted md:justify-end">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1240px] items-center justify-between text-sm text-faint">
        <span>© {new Date().getFullYear()} Rontee. Made with care.</span>
        <ThemeMenu placement="top" />
      </div>
    </footer>
  );
}
