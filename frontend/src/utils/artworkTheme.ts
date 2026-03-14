export type ArtworkThemeMode = "light" | "dark";

export const ARTWORK_THEME_TOKEN_NAMES = [
  "--page-top",
  "--page-bottom",
  "--page-accent",
  "--accent",
  "--accent-soft",
  "--accent-glow",
  "--player-tint",
  "--dynamic-ring",
] as const;

export type ArtworkThemeTokenName =
  (typeof ARTWORK_THEME_TOKEN_NAMES)[number];

export type ArtworkThemeTokens = Record<ArtworkThemeTokenName, string>;

export interface ArtworkBackdropStyle {
  backgroundColor: string;
  backgroundImage: string;
}

export interface ArtworkPaletteSwatch {
  rgb: [number, number, number];
  population: number;
}

export type ArtworkPalette = Record<string, ArtworkPaletteSwatch | null>;

const DEFAULT_ARTWORK_THEME_TOKENS: Record<
  ArtworkThemeMode,
  ArtworkThemeTokens
> = {
  light: {
    "--page-top": "rgb(251 253 255)",
    "--page-bottom": "rgb(237 242 248)",
    "--page-accent": "rgb(77 114 213 / 0.12)",
    "--accent": "rgb(31 63 146)",
    "--accent-soft": "rgb(54 84 176 / 0.14)",
    "--accent-glow": "rgb(66 102 198 / 0.28)",
    "--player-tint": "rgb(54 84 176 / 0.12)",
    "--dynamic-ring": "rgb(66 102 198 / 0.18)",
  },
  dark: {
    "--page-top": "rgb(13 19 32)",
    "--page-bottom": "rgb(7 11 18)",
    "--page-accent": "rgb(86 131 255 / 0.18)",
    "--accent": "rgb(125 167 255)",
    "--accent-soft": "rgb(118 162 255 / 0.2)",
    "--accent-glow": "rgb(90 135 255 / 0.32)",
    "--player-tint": "rgb(118 162 255 / 0.16)",
    "--dynamic-ring": "rgb(125 167 255 / 0.28)",
  },
};

const LIGHT_BASE_TOP: [number, number, number] = [251, 253, 255];
const LIGHT_BASE_BOTTOM: [number, number, number] = [237, 242, 248];
const DARK_BASE_TOP: [number, number, number] = [13, 19, 32];
const DARK_BASE_BOTTOM: [number, number, number] = [7, 11, 18];

export function getDefaultArtworkThemeTokens(
  mode: ArtworkThemeMode,
): ArtworkThemeTokens {
  return { ...DEFAULT_ARTWORK_THEME_TOKENS[mode] };
}

export function buildArtworkProxyUrl(url: string): string {
  return `/api/artwork-proxy?url=${encodeURIComponent(url)}`;
}

export function buildArtworkBackdropStyle(
  tokens: ArtworkThemeTokens,
): ArtworkBackdropStyle {
  return {
    backgroundColor: tokens["--page-bottom"],
    backgroundImage: [
      `radial-gradient(circle at 14% 12%, ${tokens["--page-accent"]}, transparent 34%)`,
      `radial-gradient(circle at 84% 18%, ${tokens["--accent-soft"]}, transparent 30%)`,
      `radial-gradient(circle at 76% 84%, ${tokens["--accent-glow"]}, transparent 34%)`,
      `linear-gradient(180deg, ${tokens["--page-top"]} 0%, ${tokens["--page-bottom"]} 100%)`,
    ].join(", "),
  };
}

export function normalizeArtworkThemeTokens(
  palette: ArtworkPalette | null | undefined,
  mode: ArtworkThemeMode,
): ArtworkThemeTokens {
  const seed = selectSeedSwatch(palette, mode);

  if (!seed) {
    return getDefaultArtworkThemeTokens(mode);
  }

  const [h, s, l] = rgbToHsl(seed.rgb);

  if (mode === "dark") {
    const anchor = hslToRgb(h, clamp(s, 0.22, 0.52), clamp(l, 0.28, 0.4));
    const accent = hslToRgb(
      h,
      clamp(s + 0.1, 0.32, 0.64),
      clamp(l + 0.26, 0.58, 0.72),
    );
    const glow = hslToRgb(
      h,
      clamp(s + 0.06, 0.28, 0.56),
      clamp(l + 0.18, 0.46, 0.62),
    );

    return {
      "--page-top": toColorString(mixRgb(DARK_BASE_TOP, anchor, 0.46)),
      "--page-bottom": toColorString(mixRgb(DARK_BASE_BOTTOM, anchor, 0.2)),
      "--page-accent": toColorString(glow, 0.18),
      "--accent": toColorString(accent),
      "--accent-soft": toColorString(glow, 0.16),
      "--accent-glow": toColorString(glow, 0.34),
      "--player-tint": toColorString(mixRgb(anchor, glow, 0.4), 0.22),
      "--dynamic-ring": toColorString(accent, 0.3),
    };
  }

  const anchor = hslToRgb(h, clamp(s, 0.18, 0.46), clamp(l, 0.42, 0.6));
  const accent = hslToRgb(
    h,
    clamp(s + 0.1, 0.34, 0.62),
    clamp(l - 0.12, 0.3, 0.44),
  );
  const wash = hslToRgb(h, clamp(s, 0.14, 0.34), clamp(l, 0.58, 0.74));

  return {
    "--page-top": toColorString(mixRgb(LIGHT_BASE_TOP, wash, 0.18)),
    "--page-bottom": toColorString(mixRgb(LIGHT_BASE_BOTTOM, anchor, 0.22)),
    "--page-accent": toColorString(anchor, 0.12),
    "--accent": toColorString(accent),
    "--accent-soft": toColorString(anchor, 0.12),
    "--accent-glow": toColorString(anchor, 0.22),
    "--player-tint": toColorString(mixRgb(LIGHT_BASE_TOP, anchor, 0.34), 0.48),
    "--dynamic-ring": toColorString(accent, 0.2),
  };
}

function selectSeedSwatch(
  palette: ArtworkPalette | null | undefined,
  mode: ArtworkThemeMode,
): ArtworkPaletteSwatch | null {
  if (!palette) {
    return null;
  }

  const priority =
    mode === "dark"
      ? [
          "DarkVibrant",
          "Vibrant",
          "DarkMuted",
          "Muted",
          "LightVibrant",
          "LightMuted",
        ]
      : [
          "Vibrant",
          "LightVibrant",
          "Muted",
          "DarkVibrant",
          "LightMuted",
          "DarkMuted",
        ];

  for (const key of priority) {
    const swatch = palette[key];
    if (swatch) {
      return swatch;
    }
  }

  return Object.values(palette)
    .filter((value): value is ArtworkPaletteSwatch => value !== null)
    .sort((left, right) => right.population - left.population)[0] ?? null;
}

function mixRgb(
  from: [number, number, number],
  to: [number, number, number],
  ratio: number,
): [number, number, number] {
  const clampedRatio = clamp(ratio, 0, 1);

  return [
    Math.round(from[0] + (to[0] - from[0]) * clampedRatio),
    Math.round(from[1] + (to[1] - from[1]) * clampedRatio),
    Math.round(from[2] + (to[2] - from[2]) * clampedRatio),
  ];
}

function toColorString(
  rgb: [number, number, number],
  alpha?: number,
): string {
  const [r, g, b] = rgb.map((value) => clamp(Math.round(value), 0, 255));

  if (alpha === undefined) {
    return `rgb(${r} ${g} ${b})`;
  }

  return `rgb(${r} ${g} ${b} / ${trimAlpha(alpha)})`;
}

function trimAlpha(value: number): string {
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function rgbToHsl([
  red,
  green,
  blue,
]: [number, number, number]): [number, number, number] {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return [0, 0, lightness];
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

  switch (max) {
    case r:
      hue = (g - b) / delta + (g < b ? 6 : 0);
      break;
    case g:
      hue = (b - r) / delta + 2;
      break;
    default:
      hue = (r - g) / delta + 4;
      break;
  }

  return [hue / 6, saturation, lightness];
}

function hslToRgb(
  hue: number,
  saturation: number,
  lightness: number,
): [number, number, number] {
  if (saturation === 0) {
    const value = Math.round(lightness * 255);
    return [value, value, value];
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  return [
    Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, hue) * 255),
    Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  ];
}

function hueToRgb(p: number, q: number, t: number): number {
  let next = t;

  if (next < 0) {
    next += 1;
  }
  if (next > 1) {
    next -= 1;
  }
  if (next < 1 / 6) {
    return p + (q - p) * 6 * next;
  }
  if (next < 1 / 2) {
    return q;
  }
  if (next < 2 / 3) {
    return p + (q - p) * (2 / 3 - next) * 6;
  }

  return p;
}
