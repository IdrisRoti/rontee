"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Global motion settings: always respect the user's
 * prefers-reduced-motion preference.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
