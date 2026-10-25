/**
 * Rontee motion language.
 * - Entrances: expo-out, 0.7–1.1s, short distances, masked line reveals.
 * - Interactions: springs (snappy for controls, soft for surfaces).
 * - Scroll scenes: GSAP ScrollTrigger scrubbed to Lenis.
 * Everything collapses to instant under prefers-reduced-motion.
 */
export const EASE = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const;

export const SPRING = {
  /** Buttons, toggles, sliding highlights. */
  snappy: { type: "spring", stiffness: 520, damping: 38, mass: 0.7 },
  /** Cards, panels, menus. */
  soft: { type: "spring", stiffness: 220, damping: 28, mass: 0.9 },
  /** Cursor-follow / magnetic. */
  magnetic: { type: "spring", stiffness: 180, damping: 16, mass: 0.4 },
} as const;

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 1.0,
} as const;
