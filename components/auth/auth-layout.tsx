"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { LogoLink } from "@/components/shared/logo";
import { ThemeMenu } from "@/components/shared/theme-menu";
import { useHeldDraft, useWide } from "@/lib/use-client";
import { AuthArt, HeldDraft, type AuthArtKind } from "./auth-art";

type AuthLayoutProps = {
  /** Which paper corner to show beside the form. */
  art: AuthArtKind;
  /** Top-right context link, e.g. "Log in" on signup. */
  headerAction?: { label: string; href: string };
  /** Show the guest's held draft (signup/login only). */
  showDraft?: boolean;
  children: React.ReactNode;
};

/**
 * Friendly auth shell: calm header, the form on the left and a paper
 * corner on the right. When a guest arrives with a held draft, the draft
 * note itself comes along (shared element) so they can see it's safe.
 */
export function AuthLayout({ art, headerAction, showDraft = false, children }: AuthLayoutProps) {
  const wide = useWide();
  const held = useHeldDraft(showDraft);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="w-full">
        <div className="mx-auto flex h-20 max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-8">
          <LogoLink compact />
          <div className="flex items-center gap-1">
            {headerAction && (
              <Link
                href={headerAction.href}
                className="flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors hover:bg-surface-subtle"
              >
                {headerAction.label}
              </Link>
            )}
            <ThemeMenu />
            <Link
              href="/"
              transitionTypes={["nav-back"]}
              className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
            >
              <X size={16} aria-hidden />
              <span className="hidden sm:inline">Close</span>
              <span className="sr-only sm:hidden">Close and go home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1120px] flex-1 grid-cols-1 items-start gap-16 px-4 pt-4 pb-16 sm:px-8 sm:pt-10 lg:pt-14 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-20 lg:pb-20">
        <section className="mx-auto w-full max-w-[440px] lg:mx-0">
          {held && !wide && <HeldDraft draft={held} compact />}
          {children}
        </section>

        {held ? (
          wide && (
            <aside aria-label="Your reminder">
              <HeldDraft draft={held} />
            </aside>
          )
        ) : (
          // CSS-hidden on small screens so phones never flash the desk.
          <aside aria-label="A few things people remember with Rontee" className="hidden lg:block">
            <AuthArt kind={art} />
          </aside>
        )}
      </main>

      <footer className="w-full">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-4 text-[13px] text-muted sm:px-8">
          <span>© 2026 Rontee</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
