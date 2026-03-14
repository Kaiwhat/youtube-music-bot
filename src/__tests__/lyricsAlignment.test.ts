import { describe, expect, test } from "bun:test";
import {
  calculateLyricScrollTop,
  isLyricScrollAligned,
} from "../../frontend/src/utils/lyricsAlignment.ts";

describe("lyrics alignment helpers", () => {
  test("should center an active lyric within the viewport", () => {
    expect(
      calculateLyricScrollTop({
        activeOffsetTop: 500,
        activeHeight: 48,
        viewportHeight: 400,
        scrollHeight: 1600,
      }),
    ).toBe(324);
  });

  test("should clamp scroll target to zero", () => {
    expect(
      calculateLyricScrollTop({
        activeOffsetTop: 40,
        activeHeight: 48,
        viewportHeight: 400,
        scrollHeight: 1200,
      }),
    ).toBe(0);
  });

  test("should clamp scroll target to the maximum scroll range", () => {
    expect(
      calculateLyricScrollTop({
        activeOffsetTop: 1400,
        activeHeight: 60,
        viewportHeight: 400,
        scrollHeight: 1500,
      }),
    ).toBe(1100);
  });

  test("should detect aligned scroll positions within tolerance", () => {
    expect(isLyricScrollAligned(320, 321)).toBe(true);
    expect(isLyricScrollAligned(320, 325)).toBe(false);
  });
});
