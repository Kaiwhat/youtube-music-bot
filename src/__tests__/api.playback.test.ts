import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import api from "../routes/api.ts";
import {
  __resetQueueServiceForTests,
  getQueueService,
} from "../services/queue.service.ts";

type RestorableMethod = {
  target: Record<string, unknown>;
  key: string;
  original: unknown;
};

const restores: RestorableMethod[] = [];

function stubMethod<T extends object, K extends keyof T>(
  target: T,
  key: K,
  replacement: T[K],
): void {
  restores.push({
    target: target as Record<string, unknown>,
    key: key as string,
    original: target[key],
  });
  target[key] = replacement;
}

function restoreMethods(): void {
  while (restores.length > 0) {
    const restore = restores.pop()!;
    restore.target[restore.key] = restore.original;
  }
}

describe("/api/play and /api/pause", () => {
  beforeEach(() => {
    restoreMethods();
    __resetQueueServiceForTests();
  });

  afterEach(() => {
    restoreMethods();
    __resetQueueServiceForTests();
  });

  test("should call the explicit play method", async () => {
    const queueService = getQueueService();
    let playCalls = 0;

    stubMethod(queueService, "play", (() => {
      playCalls += 1;
    }) as typeof queueService.play);

    const response = await api.request("/play", {
      method: "POST",
    });

    expect(response.status).toBe(200);
    expect(playCalls).toBe(1);
    expect(await response.json()).toEqual({
      success: true,
      data: { message: "Playing" },
    });
  });

  test("should call the explicit pause method", async () => {
    const queueService = getQueueService();
    let pauseCalls = 0;

    stubMethod(queueService, "pause", (() => {
      pauseCalls += 1;
    }) as typeof queueService.pause);

    const response = await api.request("/pause", {
      method: "POST",
    });

    expect(response.status).toBe(200);
    expect(pauseCalls).toBe(1);
    expect(await response.json()).toEqual({
      success: true,
      data: { message: "Paused" },
    });
  });

  test("should surface play failures as 500 responses", async () => {
    const queueService = getQueueService();

    stubMethod(queueService, "play", (() => {
      throw new Error("play failed");
    }) as typeof queueService.play);

    const response = await api.request("/play", {
      method: "POST",
    });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      error: "Failed to play",
    });
  });

  test("should surface pause failures as 500 responses", async () => {
    const queueService = getQueueService();

    stubMethod(queueService, "pause", (() => {
      throw new Error("pause failed");
    }) as typeof queueService.pause);

    const response = await api.request("/pause", {
      method: "POST",
    });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      error: "Failed to pause",
    });
  });
});
