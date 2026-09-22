import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const surfaceVariants = cva("rounded-xl border border-border", {
  variants: {
    variant: {
      default: "bg-surface shadow-subtle",
      subtle: "bg-surface-subtle shadow-none",
      elevated: "bg-surface-elevated shadow-elevated",
      transparent: "border-transparent bg-transparent shadow-none",
    },
    padding: {
      none: "p-0",
      sm: "p-5",
      md: "p-5 md:p-8",
      lg: "p-8 md:p-10",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "sm",
  },
});

type SurfaceProps = React.ComponentProps<"div"> &
  VariantProps<typeof surfaceVariants>;

/**
 * Semantic surface. Use only when grouping is meaningful —
 * prefer whitespace + typography over boxing everything.
 */
export function Surface({ variant, padding, className, ...props }: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      className={cn(surfaceVariants({ variant, padding, className }))}
      {...props}
    />
  );
}

export { surfaceVariants };
