"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Logo } from "@/components/shared/logo";
import { ThemeMenu } from "@/components/shared/theme-menu";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Use cases", href: "#use-cases" },
      { label: "FAQ", href: "#faq" },
      { label: "Create a reminder", href: "/reminders/new" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign up", href: "/signup" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
] as const;

/** Dark footer with link columns and an oversized wordmark that rises into place. */
export function Footer() {
  const ref = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? "0%" : "45%", "0%"]);

  return (
    <footer ref={ref} className="relative overflow-hidden px-4 pt-16 sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-2 gap-10 border-t border-border pt-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              A personal memory assistant for the dates that matter.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-2">
              <p className="type-eyebrow mb-4 text-faint">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group relative text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {l.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-between gap-4 font-mono text-[11px] tracking-wide text-faint uppercase">
          <span>© {new Date().getFullYear()} Rontee</span>
          <span className="hidden sm:inline">Never forget what matters</span>
          <ThemeMenu placement="top" />
        </div>
      </div>

      {/* Giant wordmark */}
      <div aria-hidden className="pointer-events-none relative mt-6 select-none">
        <motion.p
          style={{ y }}
          className="flex items-end justify-center text-[29vw] leading-[0.74] font-semibold tracking-[-0.075em] text-foreground"
        >
          rontee
          <span className="mb-[0.08em] ml-[0.02em] inline-block size-[0.14em] rounded-full bg-ember" />
        </motion.p>
      </div>
    </footer>
  );
}
