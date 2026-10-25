"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { ThemeMenu } from "@/components/shared/theme-menu";
import { Logo } from "@/components/shared/logo";
import { ICON_SIZES } from "@/lib/icons";

/**
 * Minimal flow header from the Stitch create-reminder screens:
 * wordmark + theme toggle + Cancel. No nav links, no CTA.
 */
export function FlowHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
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

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeMenu />
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
          >
            Cancel
            <X size={ICON_SIZES.compact} aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}
