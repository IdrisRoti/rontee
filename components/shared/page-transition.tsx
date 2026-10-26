import * as React from "react";
import { ViewTransition } from "react";

/**
 * Wrap each page's content (in page.tsx, not a layout — layouts persist,
 * so enter/exit never fire there). Navigation tagged `nav-forward` /
 * `nav-back` slides; anything else gets a soft blur-crossfade.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

/**
 * An element that persists across pages (same `name` on both sides) and
 * morphs between its old and new position/size.
 */
export function Shared({ name, children }: { name: string; children: React.ReactElement }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

/** Names of elements shared between pages. */
export const SHARED = {
  logo: "rontee-logo",
  capture: "rontee-capture",
  /** The guest's draft note: wizard "ready" ↔ signup/login. */
  draft: "rontee-draft",
} as const;
