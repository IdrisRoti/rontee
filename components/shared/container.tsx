import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  width?: "default" | "narrow";
};

/**
 * Centered responsive page container.
 * default: 1180px (standard views) / narrow: 740px (reading views).
 * Mobile-first: 20px margins, generous vertical rhythm via parents.
 */
export function Container({
  width = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-5 md:px-8",
        width === "default" ? "max-w-[1180px]" : "max-w-[740px]",
        className,
      )}
      {...props}
    />
  );
}
