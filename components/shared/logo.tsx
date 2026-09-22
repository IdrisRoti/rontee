import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

/**
 * Rontee wordmark (canonical Stitch spec, SVG).
 * Orbit ring + two accent dots + lowercase wordmark.
 * Replace with final brand asset when it lands (public/logo/).
 */
export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("flex items-center", className)} aria-hidden={false}>
      <svg
        className="h-7 w-auto md:h-8"
        fill="none"
        viewBox="0 0 120 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g transform="translate(4, 8)">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeDasharray="48 14"
            strokeLinecap="round"
            strokeWidth="2.2"
            className="text-foreground"
          />
          <circle cx="12" cy="12" r="3.5" className="fill-accent" />
          <circle cx="19" cy="7" r="2" className="fill-accent" />
        </g>
        <text
          x="36"
          y="25"
          fontFamily="Manrope, sans-serif"
          fontSize="20"
          fontWeight="700"
          letterSpacing="-0.04em"
          className="fill-foreground"
        >
          rontee
        </text>
      </svg>
    </span>
  );
}

export function LogoLink({ className }: LogoProps) {
  return (
    <Link
      href="#"
      aria-label="Rontee home"
      className={cn(
        "rounded-md transition-opacity hover:opacity-90",
        className,
      )}
    >
      <Logo />
    </Link>
  );
}
