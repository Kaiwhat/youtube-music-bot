/**
 * YouTube 縮略圖解析度級別
 */
export const ThumbnailQuality = {
  /** 120x90 */
  DEFAULT: "default",
  /** 320x180 */
  MEDIUM: "mqdefault",
  /** 480x360 */
  HIGH: "hqdefault",
  /** 640x480 */
  STANDARD: "sddefault",
  /** 1280x720 (可能不可用) */
  MAXRES: "maxresdefault",
} as const;

export type ThumbnailQuality =
  (typeof ThumbnailQuality)[keyof typeof ThumbnailQuality];

const THUMBNAIL_QUALITY_FALLBACKS: Record<ThumbnailQuality, ThumbnailQuality[]> =
  {
    [ThumbnailQuality.MAXRES]: [
      ThumbnailQuality.MAXRES,
      ThumbnailQuality.STANDARD,
      ThumbnailQuality.HIGH,
      ThumbnailQuality.MEDIUM,
      ThumbnailQuality.DEFAULT,
    ],
    [ThumbnailQuality.STANDARD]: [
      ThumbnailQuality.STANDARD,
      ThumbnailQuality.HIGH,
      ThumbnailQuality.MEDIUM,
      ThumbnailQuality.DEFAULT,
    ],
    [ThumbnailQuality.HIGH]: [
      ThumbnailQuality.HIGH,
      ThumbnailQuality.MEDIUM,
      ThumbnailQuality.DEFAULT,
    ],
    [ThumbnailQuality.MEDIUM]: [
      ThumbnailQuality.MEDIUM,
      ThumbnailQuality.DEFAULT,
    ],
    [ThumbnailQuality.DEFAULT]: [ThumbnailQuality.DEFAULT],
  };

/**
 * 將 YouTube 縮略圖 URL 轉換為指定解析度
 *
 * @param url 原始縮略圖 URL
 * @param quality 目標解析度級別（預設：HIGH）
 * @returns 高解析度縮略圖 URL
 *
 * @example
 * ```ts
 * const thumbnail = "https://i.ytimg.com/vi/VIDEO_ID/default.jpg";
 * const hqThumbnail = getHighQualityThumbnail(thumbnail);
 * // Returns: "https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg"
 * ```
 */
export function getHighQualityThumbnail(
  url: string,
  quality: ThumbnailQuality = ThumbnailQuality.HIGH,
): string {
  if (!url) return url;

  // 匹配 YouTube 縮略圖 URL 模式
  const match = url.match(
    /\/vi\/([^/]+)\/(default|mqdefault|hqdefault|sddefault|maxresdefault)\.jpg/,
  );

  if (!match) {
    // 不是標準 YouTube 縮略圖格式，直接返回
    return url;
  }

  const videoId = match[1];
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * 針對 YouTube / YouTube Music 的縮圖 URL 做較高解析度轉換。
 * 支援標準 i.ytimg 與 lh3.googleusercontent 的 size suffix。
 */
export function getOptimizedThumbnail(
  url: string,
  quality: ThumbnailQuality = ThumbnailQuality.HIGH,
): string {
  if (!url) return url;

  const youtubeThumbnail = getHighQualityThumbnail(url, quality);
  if (youtubeThumbnail !== url) {
    return youtubeThumbnail;
  }

  if (url.includes("googleusercontent.com")) {
    const suffixPattern = /=w\d+-h\d+(-[a-z0-9-]+)?$/i;

    if (suffixPattern.test(url)) {
      if (quality === ThumbnailQuality.MAXRES) {
        return url.replace(suffixPattern, "=s720-c-k-c0x00ffffff-no-rj");
      }

      if (quality === ThumbnailQuality.STANDARD) {
        return url.replace(suffixPattern, "=s512-c-k-c0x00ffffff-no-rj");
      }

      return url.replace(suffixPattern, "=s360-c-k-c0x00ffffff-no-rj");
    }
  }

  return url;
}

export function getOptimizedThumbnailCandidates(
  url: string,
  preferredQuality: ThumbnailQuality = ThumbnailQuality.HIGH,
): string[] {
  if (!url) {
    return [];
  }

  const candidates = THUMBNAIL_QUALITY_FALLBACKS[preferredQuality].map(
    (quality) => getOptimizedThumbnail(url, quality),
  );

  candidates.push(url);

  return Array.from(new Set(candidates.filter(Boolean)));
}
