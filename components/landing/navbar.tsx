"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Contrast, Menu, Moon, Sun, X } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { LogoLink } from "@/components/shared/logo";
import { ICON_SIZES } from "@/lib/icons";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "What to remember", href: "#what-to-remember" },
  { label: "Log in", href: "#login" },
] as const;

type ThemeChoice = "light" | "system" | "dark";

const THEME_OPTIONS: ReadonlyArray<{
  value: ThemeChoice;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Contrast },
  { value: "dark", label: "Dark", Icon: Moon },
];

/**
 * Theme dropdown from the canonical landing spec:
 * Light / System / Dark, closes on outside click or Escape.
 */
function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open ]);

  const resolved: ThemeChoice =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";
  // Gate on mounted so the first client render matches the server HTML.
  // next-themes resolves the real theme after mount; reading it during
  // hydration produces an aria-checked mismatch.
  const current: ThemeChoice = mounted ? resolved : "system";
  const ActiveIcon =
    !mounted || current === "system"
      ? Contrast
      : current === "dark"
        ? Moon
        : Sun;

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Theme appearance"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full"
      >
        <ActiveIcon size={ICON_SIZES.prominent} aria-hidden />
      </Button>
      <div
        role="menu"
        aria-label="Theme"
        className={cn(
          "absolute right-0 z-50 mt-2 w-36 rounded-xl border border-border bg-surface py-1.5 shadow-elevated",
          open ? "block" : "hidden",
        )}
      >
        {THEME_OPTIONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            role="menuitemradio"
            aria-checked={current === value}
            type="button"
            onClick={() => {
              setTheme(value);
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-surface-subtle hover:text-foreground",
              current === value ? "font-semibold text-foreground" : "text-muted",
            )}
          >
            <Icon size={17} aria-hidden />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Landing navbar from the canonical final Stitch design.
 * Desktop: links + theme dropdown + inline CTA.
 * Mobile (per Mobile Light spec): compact bar + hamburger menu panel.
 * No auth UI — "Log in" is an anchor placeholder until auth is built.
 */
export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:h-20 md:px-8 lg:px-10">
        <LogoLink />

        <div className="flex items-center gap-2 md:gap-7 lg:gap-8">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 text-[15px] font-medium text-muted md:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ThemeMenu />

          <Button
            asChild
            className="hidden rounded-full px-5 sm:px-6 md:inline-flex"
          >
            <Link href="#cta">Create a reminder</Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full md:hidden"
          >
            {open ? (
              <X size={24} aria-hidden />
            ) : (
              <Menu size={24} aria-hidden />
            )}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-background md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-4 px-5 py-6">
          <nav
            aria-label="Mobile"
            className="flex flex-col gap-3.5 text-base font-medium text-muted"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button asChild className="w-full rounded-full py-3">
            <Link href="#cta" onClick={() => setOpen(false)}>
              Create a reminder
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
