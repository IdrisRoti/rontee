"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { ThemeMenu } from "@/components/shared/theme-menu";
import { Logo } from "@/components/shared/logo";
import { ICON_SIZES } from "@/lib/icons";

type AuthLayoutProps = {
  /** Top-right context link, e.g. Log in on signup. Omit on purpose-built screens. */
  headerAction?: { label: string; href: string };
  children: React.ReactNode;
};

/**
 * Shared standalone-auth shell from Stitch:
 * minimal header (wordmark + context link + theme + close),
 * editorial panel beside a 440px form card, quiet footer.
 */
export function AuthLayout({ headerAction, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full max-w-full flex-col overflow-x-clip bg-background text-foreground">
      <header className="w-full border-b border-border/60">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 md:h-20 md:px-8 lg:px-10">
          <Link
            href="/"
            aria-label="Rontee home"
            className="rounded-md transition-opacity hover:opacity-90"
          >
            <span className="[&_svg]:h-7 md:[&_svg]:h-8">
              <Logo />
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">
            {headerAction && (
              <Link
                href={headerAction.href}
                className="px-2 py-1 text-sm font-medium text-muted transition-colors hover:text-accent-soft"
              >
                {headerAction.label}
              </Link>
            )}
            <ThemeMenu />
            <Link
              href="/"
              aria-label="Close and return home"
              className="rounded-full p-2 text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
            >
              <X size={ICON_SIZES.prominent} aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex w-full max-w-full flex-1 flex-col overflow-x-clip">
        <div className="mx-auto grid w-full max-w-[1280px] flex-1 grid-cols-1 items-start gap-10 px-4 py-10 sm:py-14 md:px-8 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pt-16">
          <section className="hidden lg:col-span-6 lg:block xl:col-span-5" aria-label="About Rontee">
            <p className="mb-3 text-xs font-semibold tracking-widest text-accent-soft uppercase">
              Personal memory assistant
            </p>
            <h1 className="mb-4 text-3xl leading-[1.15] font-bold tracking-tight text-foreground lg:text-5xl lg:leading-[1.12]">
              Never forget
              <br />
              what matters.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted lg:text-lg">
              Keep the moments, people, and dates you never want to forget.
            </p>
          </section>

          <section
            className="flex justify-start lg:col-span-6 lg:justify-end xl:col-span-6 xl:col-start-7"
            aria-label="Authentication"
          >
            <div className="w-full max-w-[440px]">{children}</div>
          </section>
        </div>
      </main>

      <footer className="w-full border-t border-border/60">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] flex-row items-center justify-between px-4 text-xs text-muted md:px-8 lg:px-10">
          <span>© 2026 Rontee. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <span aria-hidden>·</span>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
