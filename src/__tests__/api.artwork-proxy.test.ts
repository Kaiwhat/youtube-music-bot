import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import api from "../routes/api.ts";

const originalFetch = globalThis.fetch;

function stubFetch(replacement: typeof fetch): void {
  globalThis.fetch = replacement;
}

function restoreFetch(): void {
  globalThis.fetch = originalFetch;
}

describe("/api/artwork-proxy", () => {
  beforeEach(() => {
    restoreFetch();
  });

  afterEach(() => {
    restoreFetch();
  });

  test("should reject requests without a url", async () => {
    const response = await api.request("/artwork-proxy");

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: 'Query parameter "url" is required',
    });
  });

  test("should reject artwork urls outside the allowlist", async () => {
    const response = await api.request(
      "/artwork-proxy?url=https%3A%2F%2Fexample.com%2Fcover.jpg",
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: "Artwork URL is not allowed",
    });
  });

  test("should stream allowed artwork responses", async () => {
    stubFetch((async (input: string | URL | Request) => {
      expect(String(input)).toBe("https://i.ytimg.com/vi/test-track/hqdefault.jpg");

      return new Response("image-bytes", {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
    }) as unknown as typeof fetch);

    const response = await api.request(
      "/artwork-proxy?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2Ftest-track%2Fhqdefault.jpg",
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/jpeg");
    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=3600, stale-while-revalidate=86400",
    );
    expect(await response.text()).toBe("image-bytes");
  });

  test("should reject upstream non-image responses", async () => {
    stubFetch((async () => {
      return new Response("not-an-image", {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }) as unknown as typeof fetch);

    const response = await api.request(
      "/artwork-proxy?url=https%3A%2F%2Flh3.googleusercontent.com%2Fcover=s512-c-k-c0x00ffffff-no-rj",
    );

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      success: false,
      error: "Upstream response is not an image",
    });
  });
});
