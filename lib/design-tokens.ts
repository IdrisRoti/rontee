/**
 * Rontee semantic design tokens — documentation mirror of app/globals.css
 * (the CSS is the source of truth). Components use Tailwind semantic classes
 * (bg-background, text-foreground, bg-primary, text-ember, ...).
 * Do not scatter raw hex values in components.
 */
export const ronteeTokens = {
  light: {
    background: "#F5F4F0",
    surface: "#FFFFFF",
    surfaceSubtle: "#EDECE7",
    foreground: "#0F0F0E",
    muted: "#67665F",
    faint: "#A3A19A",
    border: "#E3E1DB",
    borderStrong: "#D1CFC8",
    primary: "#0F0F0E",
    primaryForeground: "#FAFAF7",
    ember: "#E8572A",
    emberSubtle: "#FBE8DF",
  },
  dark: {
    background: "#0B0B0A",
    surface: "#141413",
    surfaceSubtle: "#1B1B19",
    surfaceElevated: "#1F1F1D",
    foreground: "#EDEBE5",
    muted: "#96948D",
    faint: "#5C5B56",
    border: "#262624",
    borderStrong: "#363531",
    primary: "#EDEBE5",
    primaryForeground: "#0B0B0A",
    ember: "#FF6A3D",
    emberSubtle: "#2B1810",
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32 },
  iconSizes: { compact: 16, default: 18, prominent: 20 },
} as const;

export type RonteeTokens = typeof ronteeTokens;
