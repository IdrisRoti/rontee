/**
 * Lucide icon sizing conventions.
 * - compact (16): dense controls, inline metadata, small buttons
 * - default (18): normal UI
 * - prominent (20): emphasized controls
 * Single icon library: lucide-react.
 */
export const ICON_SIZES = {
  compact: 16,
  default: 18,
  prominent: 20,
} as const;

export type IconSizeName = keyof typeof ICON_SIZES;
