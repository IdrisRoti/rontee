import * as React from "react";

import { cn } from "@/lib/utils";

type TextProps = {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "as">;

/** Restrained semantic type scale. Display is reserved for marketing. */
export function Display({ as: Tag = "p", className, ...props }: TextProps) {
  return <Tag className={cn("type-display text-foreground", className)} {...props} />;
}

export function H1({ as: Tag = "h1", className, ...props }: TextProps) {
  return <Tag className={cn("type-h1 text-foreground", className)} {...props} />;
}

export function H2({ as: Tag = "h2", className, ...props }: TextProps) {
  return <Tag className={cn("type-h2 text-foreground", className)} {...props} />;
}

export function H3({ as: Tag = "h3", className, ...props }: TextProps) {
  return <Tag className={cn("type-h3 text-foreground", className)} {...props} />;
}

export function Body({ as: Tag = "p", className, ...props }: TextProps) {
  return <Tag className={cn("type-body text-foreground", className)} {...props} />;
}

export function BodySmall({ as: Tag = "p", className, ...props }: TextProps) {
  return (
    <Tag className={cn("type-body-small text-foreground", className)} {...props} />
  );
}

export function Caption({ as: Tag = "p", className, ...props }: TextProps) {
  return <Tag className={cn("type-caption", className)} {...props} />;
}

export function LabelText({ as: Tag = "span", className, ...props }: TextProps) {
  return <Tag className={cn("type-label text-foreground", className)} {...props} />;
}
