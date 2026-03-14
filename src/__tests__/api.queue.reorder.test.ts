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

describe("/api/queue/reorder", () => {
  beforeEach(() => {
    restoreMethods();
    __resetQueueServiceForTests();
  });

  afterEach(() => {
    restoreMethods();
    __resetQueueServiceForTests();
  });

  test("should reject non-integer indexes", async () => {
    const response = await api.request("/queue/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex: 0, toIndex: 1.5 }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: "fromIndex and toIndex must be integers",
    });
  });

  test("should reorder queue successfully", async () => {
    const queueService = getQueueService();
    let capturedArgs: [number, number] | null = null;

    stubMethod(queueService, "reorderQueue", ((fromIndex: number, toIndex: number) => {
      capturedArgs = [fromIndex, toIndex];
    }) as typeof queueService.reorderQueue);

    const response = await api.request("/queue/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex: 3, toIndex: 1 }),
    });

    expect(response.status).toBe(200);
    expect(capturedArgs!).toEqual([3, 1]);
    expect(await response.json()).toEqual({
      success: true,
      data: { message: "Queue reordered" },
    });
  });

  test("should surface invalid indexes from the service", async () => {
    const queueService = getQueueService();

    stubMethod(queueService, "reorderQueue", (() => {
      throw new RangeError("Invalid queue index");
    }) as typeof queueService.reorderQueue);

    const response = await api.request("/queue/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex: 5, toIndex: 0 }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      success: false,
      error: "Invalid queue index",
    });
  });
});
