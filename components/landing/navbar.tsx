"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLenis } from "lenis/react";

import { Button } from "@/components/ui/button";
import { LogoLink } from "@/components/shared/logo";
import { ThemeMenu } from "@/components/shared/theme-menu";
import { EASE, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "What to remember", href: "#remember" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Two bars that morph into an X. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-3 w-[18px]">
      <motion.span
        className="absolute left-0 h-[1.5px] w-full rounded-full bg-current"
        animate={open ? { top: "50%", rotate: 45, y: "-50%" } : { top: "0%", rotate: 0, y: "0%" }}
        transition={SPRING.snappy}
      />
      <motion.span
        className="absolute left-0 h-[1.5px] w-full rounded-full bg-current"
        animate={open ? { top: "50%", rotate: -45, y: "-50%" } : { top: "100%", rotate: 0, y: "-100%" }}
        transition={SPRING.snappy}
      />
    </span>
  );
}

/**
 * Marketing navbar. Transparent at the top; condenses into a floating
 * capsule on scroll; hides on scroll-down, returns on scroll-up.
 * Mobile: full-screen sheet with large staggered links.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCondensed(y > 24);
    setHidden(y > 640 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE.outExpo }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
      >
        <motion.div
          layout
          transition={SPRING.soft}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-full border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
            condensed
              ? "max-w-[880px] border-border bg-surface/80 py-1.5 pr-1.5 pl-4 shadow-elevated backdrop-blur-xl backdrop-saturate-150"
              : "max-w-[1320px] border-transparent bg-transparent py-2 pr-2 pl-2 sm:pl-4",
          )}
        >
          <LogoLink />

          <nav aria-label="Primary" className="hidden md:block" onPointerLeave={() => setHovered(null)}>
            <ul className="flex items-center">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onPointerEnter={() => setHovered(link.href)}
                    onFocus={() => setHovered(link.href)}
                    className="relative block px-4 py-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {hovered === link.href && (
                      <motion.span
                        layoutId="nav-hover"
                        transition={SPRING.snappy}
                        className="absolute inset-0 -z-10 rounded-full bg-surface-subtle"
                      />
                    )}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <ThemeMenu className="hidden sm:block" />
            <Button asChild variant="ghost" size="sm" className="hidden h-9 md:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="h-9 px-4">
              <Link href="/reminders/new">
                <span className="hidden sm:inline">Start a reminder</span>
                <span className="sm:hidden">Start</span>
              </Link>
            </Button>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="relative z-[60] flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-subtle md:hidden"
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE.inOutQuart }}
            className="fixed inset-0 z-40 flex flex-col bg-background px-5 pt-28 pb-8 md:hidden"
          >
            <nav aria-label="Mobile" className="flex-1">
              <ul className="flex flex-col">
                {[...NAV_LINKS, { label: "Log in", href: "/login" }].map((link, i) => (
                  <li key={link.href} className="overflow-hidden border-b border-border">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.7, ease: EASE.outExpo, delay: 0.15 + i * 0.06 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-5 text-[2rem] leading-none font-medium tracking-[-0.04em]"
                      >
                        {link.label}
                        <ArrowUpRight size={22} aria-hidden className="text-faint" />
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE.outExpo, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <Button asChild size="lg" className="flex-1">
                <Link href="/reminders/new" onClick={() => setOpen(false)}>
                  Start a reminder
                </Link>
              </Button>
              <ThemeMenu placement="top" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
