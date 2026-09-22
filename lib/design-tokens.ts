/**
 * Rontee semantic design tokens.
 * Single source of truth for documentation / future theming.
 * Components should use Tailwind semantic classes (bg-background, text-foreground,
 * border-border, bg-accent, ...) which map to these values via globals.css.
 * Do not scatter raw hex values in components.
 */
export const ronteeTokens = {
  light: {
    background: "#FAFAF9",
    surface: "#FFFFFF",
    foreground: "#111111",
    muted: "#6B7280",
    border: "#E8E8E8",
    accent: "#159F91",
    accentForeground: "#FFFFFF",
    accentSubtle: "#E8F7F4",
  },
  dark: {
    background: "#0D1110",
    surface: "#151A18",
    foreground: "#F5F7F6",
    muted: "#9AA5A1",
    border: "#252C29",
    accent: "#19B89F",
    accentForeground: "#062A25",
    accentSubtle: "#102F2A",
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 16,
  },
  iconSizes: {
    compact: 16,
    default: 18,
    prominent: 20,
  },
} as const;

export type RonteeTokens = typeof ronteeTokens;
