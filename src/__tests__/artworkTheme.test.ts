import { describe, expect, test } from "bun:test";
import {
  buildArtworkBackdropStyle,
  getDefaultArtworkThemeTokens,
  normalizeArtworkThemeTokens,
} from "../../frontend/src/utils/artworkTheme.ts";

describe("artwork theme helpers", () => {
  test("should fall back to the default theme tokens when no palette is available", () => {
    expect(normalizeArtworkThemeTokens(null, "dark")).toEqual(
      getDefaultArtworkThemeTokens("dark"),
    );
  });

  test("should clamp overly saturated palettes into a safer accent range", () => {
    const tokens = normalizeArtworkThemeTokens(
      {
        Vibrant: {
          rgb: [255, 0, 200],
          population: 42,
        },
      },
      "light",
    );

    const saturation = rgbToHsl(parseColor(tokens["--accent"]))[1];
    expect(saturation).toBeLessThanOrEqual(0.63);
  });

  test("should keep dark mode page backgrounds in a low-luminance range", () => {
    const tokens = normalizeArtworkThemeTokens(
      {
        DarkVibrant: {
          rgb: [235, 112, 40],
          population: 64,
        },
      },
      "dark",
    );

    expect(averageChannel(parseColor(tokens["--page-top"]))).toBeLessThan(70);
    expect(averageChannel(parseColor(tokens["--page-bottom"]))).toBeLessThan(50);
  });

  test("should build a layered backdrop gradient from theme tokens", () => {
    const tokens = getDefaultArtworkThemeTokens("light");
    const style = buildArtworkBackdropStyle(tokens);

    expect(style.backgroundColor).toBe(tokens["--page-bottom"]);
    expect(style.backgroundImage).toContain(tokens["--page-accent"]);
    expect(style.backgroundImage).toContain(tokens["--accent-soft"]);
    expect(style.backgroundImage).toContain(tokens["--accent-glow"]);
  });
});

function parseColor(color: string): [number, number, number] {
  const match = color.match(/rgb\((\d+)\s+(\d+)\s+(\d+)/);

  if (!match) {
    throw new Error(`Unsupported color format: ${color}`);
  }

  return [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
  ];
}

function averageChannel([red, green, blue]: [number, number, number]): number {
  return (red + green + blue) / 3;
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
