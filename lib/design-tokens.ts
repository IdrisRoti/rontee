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
    accent: "#0F9D8A",
    accentForeground: "#FFFFFF",
    accentSubtle: "#E8F7F4",
    accentSoft: "#0F9D8A",
  },
  dark: {
    background: "#101312",
    surface: "#191E1C",
    surfaceSubtle: "#202724",
    surfaceElevated: "#202724",
    foreground: "#F1F3F2",
    muted: "#A0AAA5",
    border: "#2B3430",
    accent: "#287F70",
    accentForeground: "#FFFFFF",
    accentSubtle: "#17463D",
    accentSoft: "#76BDB0",
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
