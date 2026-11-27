import type { CSSProperties } from "react";

// Colour themes for the embedded tool. Each one overrides the site's colour
// tokens inside the frame, so every part of the tool follows it.
export const EMBED_THEMES = {
  light: {
    label: "Light",
    page: "#ffffff",
    vars: {
      "--background": "oklch(0.97 0.002 80)",
      "--card": "oklch(1 0 0)",
      "--foreground": "oklch(0.186 0.008 48.3)",
      "--muted": "oklch(0.94 0.003 80)",
      "--muted-foreground": "oklch(0.46 0.012 70)",
    },
  },
  dark: {
    label: "Dark",
    page: "#0f0e0d",
    vars: {
      "--background": "oklch(0.24 0.005 60)",
      "--card": "oklch(0.19 0.005 60)",
      "--foreground": "oklch(0.97 0.004 80)",
      "--muted": "oklch(0.27 0.005 60)",
      "--muted-foreground": "oklch(0.74 0.01 70)",
    },
  },
  cream: {
    label: "Cream",
    page: "oklch(0.98 0.004 80)",
    vars: {},
  },
} satisfies Record<string, { label: string; page: string; vars: Record<string, string> }>;

export type EmbedTheme = keyof typeof EMBED_THEMES;

export function isEmbedTheme(value: unknown): value is EmbedTheme {
  return typeof value === "string" && value in EMBED_THEMES;
}

export function embedThemeStyle(theme: EmbedTheme): CSSProperties {
  return { ...EMBED_THEMES[theme].vars, background: EMBED_THEMES[theme].page } as CSSProperties;
}
