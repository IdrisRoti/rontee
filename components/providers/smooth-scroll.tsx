"use client";

import * as React from "react";
import { ReactLenis } from "lenis/react";

/**
 * Gentle Lenis smooth scroll for marketing pages. App screens keep native
 * scroll. Skipped entirely under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis root options={{ autoRaf: true, lerp: 0.1, anchors: { offset: -80 } }}>
      {children}
    </ReactLenis>
  );
}
