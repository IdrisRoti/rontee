import Link from "next/link";

import { Shared, SHARED } from "@/components/shared/page-transition";
import { cn } from "@/lib/utils";

type MarkProps = {
  className?: string;
  /** Inverted: light tile with ink letter. */
  inverted?: boolean;
};

/**
 * Rontee R mark — a lowercase "r" whose shoulder reaches for an ember
 * dot: the one thing being remembered. Same geometry as app/icon.svg.
 */
export function LogoMark({ className, inverted = false }: MarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("size-7 shrink-0", className)}
    >
      <rect
        width="32"
        height="32"
        rx="9"
        className={inverted ? "fill-primary-foreground" : "fill-primary"}
      />
      <path
        d="M11.5 23V10.5M11.5 16c0-3.4 2.3-5.6 6-5.6"
        strokeWidth="3.2"
        strokeLinecap="round"
        className={inverted ? "stroke-primary" : "stroke-primary-foreground"}
      />
      <circle cx="22.4" cy="10.6" r="2.5" className="fill-ember" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  markClassName?: string;
  /** Hide the wordmark below sm (mark only). */
  compact?: boolean;
};

/** Mark + lowercase wordmark. Text is real text so it inherits Geist. */
export function Logo({ className, markClassName, compact = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span
        className={cn(
          "text-[1.3rem] leading-none font-semibold tracking-[-0.055em] text-foreground",
          compact && "max-sm:sr-only",
        )}
      >
        rontee
      </span>
    </span>
  );
}

/** Home link. The logo is a shared element, so it glides between pages instead of reappearing. */
export function LogoLink({ className, compact }: LogoProps) {
  return (
    <Shared name={SHARED.logo}>
      <Link
        href="/"
        aria-label="Rontee home"
        transitionTypes={["nav-back"]}
        className={cn("rounded-lg transition-opacity hover:opacity-80", className)}
      >
        <Logo compact={compact} />
      </Link>
    </Shared>
  );
}
