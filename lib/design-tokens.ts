/**
 * Rontee semantic design tokens — documentation mirror of app/globals.css
 * (the CSS is the source of truth). Components use Tailwind semantic classes
 * (bg-background, text-foreground, bg-primary, text-ember, bg-butter, ...).
 * Category colours live in lib/categories.ts. No raw hex in components.
 */
export const ronteeTokens = {
  light: {
    background: "#F7F2E8",
    surface: "#FFFDF8",
    surfaceSubtle: "#EFE8DA",
    foreground: "#1E1B16",
    muted: "#6B6358",
    faint: "#A69D8F",
    border: "#E6DDCC",
    borderStrong: "#D6CBB6",
    primary: "#1E1B16",
    primaryForeground: "#FFFDF8",
    ember: "#E8573A",
    emberSubtle: "#FBE3DA",
    butter: "#F6D86B",
    sage: "#A8C3A0",
    sky: "#A9C9E8",
    blush: "#F2B8B0",
  },
  dark: {
    background: "#27231E",
    surface: "#302B25",
    surfaceSubtle: "#3A342D",
    surfaceElevated: "#3B352E",
    foreground: "#F5EFE4",
    muted: "#BDB3A4",
    faint: "#857B6D",
    border: "#423B33",
    borderStrong: "#554C41",
    primary: "#F5EFE4",
    primaryForeground: "#27231E",
    ember: "#F2735A",
    emberSubtle: "#4A2C22",
    butter: "#E6CA62",
    sage: "#9AB493",
    sky: "#9DBCD9",
    blush: "#E2AAA2",
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32 },
  iconSizes: { compact: 16, default: 18, prominent: 20 },
} as const;

export type RonteeTokens = typeof ronteeTokens;
