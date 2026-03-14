const ALLOWED_ARTWORK_HOSTS = [
  "i.ytimg.com",
  "img.youtube.com",
  "yt3.ggpht.com",
  "lh3.googleusercontent.com",
  "googleusercontent.com",
  "ggpht.com",
] as const;

const ALLOWED_ARTWORK_SUFFIXES = [
  ".ytimg.com",
  ".googleusercontent.com",
  ".ggpht.com",
] as const;

export function parseArtworkUrl(value: string | undefined): URL | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

export function isAllowedArtworkUrl(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();

  return (
    ALLOWED_ARTWORK_HOSTS.includes(
      hostname as (typeof ALLOWED_ARTWORK_HOSTS)[number],
    ) ||
    ALLOWED_ARTWORK_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  );
}

export function getArtworkProxyHeaders(contentType: string | null): Headers {
  const headers = new Headers();

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  headers.set(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400",
  );
  headers.set("Vary", "Accept");

  return headers;
}
