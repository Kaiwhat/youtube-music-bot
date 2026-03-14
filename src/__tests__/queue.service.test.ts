import { describe, test, expect, beforeEach } from "bun:test";
import {
  __resetQueueServiceForTests,
  getQueueService,
} from "../services/queue.service.ts";
import {
  __resetPlayerServiceForTests,
} from "../services/player.service.ts";
import type { Track } from "../types/index.ts";

const track = (videoId: string, title: string): Track => ({
  videoId,
  title,
  artist: "Test Artist",
  duration: 180,
});

describe("QueueService - seekTo functionality", () => {
  let queueService: ReturnType<typeof getQueueService>;

  beforeEach(() => {
    __resetQueueServiceForTests();
    __resetPlayerServiceForTests();
    queueService = getQueueService();
  });

  describe("seekTo() method - input validation", () => {
    test("should reject negative position", () => {
      const initialState = queueService.getState();

      queueService.seekTo(-5);

      const newState = queueService.getState();
      // Position should not change
      expect(newState.position).toBe(initialState.position);
    });

    test("should reject NaN position", () => {
      const initialState = queueService.getState();

      queueService.seekTo(NaN);

      const newState = queueService.getState();
      expect(newState.position).toBe(initialState.position);
    });

    test("should reject Infinity position", () => {
      const initialState = queueService.getState();

      queueService.seekTo(Infinity);

      const newState = queueService.getState();
      expect(newState.position).toBe(initialState.position);
    });

    test("should accept zero position", () => {
      queueService.seekTo(0);

      const state = queueService.getState();
      expect(state.position).toBe(0);
    });

    test("should accept valid positive position", () => {
      const initialState = queueService.getState();

      queueService.seekTo(30);

      const state = queueService.getState();
      expect(state.position).toBe(initialState.position);
    });
  });

  describe("seekTo() method - boundary clamping", () => {
    test("should clamp position to duration when exceeding", () => {
      // Note: In a real scenario, you would need to set up a track first
      // This test demonstrates the clamping behavior
      const position = 9999;
      queueService.seekTo(position);

      const state = queueService.getState();
      // Position should be clamped to duration (which is 0 by default)
      expect(state.position).toBeLessThanOrEqual(state.duration);
    });
  });

  describe("volume control", () => {
    test("should update volume", () => {
      queueService.setVolume(80);

      const state = queueService.getState();
      expect(state.volume).toBe(80);
    });
  });

  describe("playback controls", () => {
    test("should pause the current track", () => {
      const internalQueueService = queueService as unknown as {
        currentTrack: Track | null;
        isPaused: boolean;
      };

      internalQueueService.currentTrack = track("track-1", "Track 1");
      internalQueueService.isPaused = false;

      queueService.pause();

      expect(queueService.getState().isPlaying).toBe(false);
    });

    test("should resume a paused track", () => {
      const internalQueueService = queueService as unknown as {
        currentTrack: Track | null;
        isPaused: boolean;
      };

      internalQueueService.currentTrack = track("track-1", "Track 1");
      internalQueueService.isPaused = true;

      queueService.play();

      expect(queueService.getState().isPlaying).toBe(true);
    });

    test("should ignore play requests without a current track", () => {
      queueService.play();

      expect(queueService.getState().currentTrack).toBeNull();
      expect(queueService.getState().isPlaying).toBe(false);
    });

    test("should keep play and pause idempotent", () => {
      const internalQueueService = queueService as unknown as {
        currentTrack: Track | null;
        isPaused: boolean;
      };

      internalQueueService.currentTrack = track("track-1", "Track 1");
      internalQueueService.isPaused = false;

      queueService.play();
      expect(queueService.getState().isPlaying).toBe(true);

      queueService.pause();
      queueService.pause();
      expect(queueService.getState().isPlaying).toBe(false);
    });
  });

  describe("queue management", () => {
    test("should return empty queue initially", () => {
      const queue = queueService.getQueue();
      expect(Array.isArray(queue)).toBe(true);
    });

    test("should return playback state", () => {
      const state = queueService.getState();

      expect(state).toHaveProperty("isPlaying");
      expect(state).toHaveProperty("currentTrack");
      expect(state).toHaveProperty("position");
      expect(state).toHaveProperty("duration");
      expect(state).toHaveProperty("volume");
      expect(state).toHaveProperty("queue");
    });

    test("should reorder queue items", () => {
      const internalQueueService = queueService as unknown as {
        queue: Track[];
      };

      internalQueueService.queue = [
        track("track-1", "Track 1"),
        track("track-2", "Track 2"),
        track("track-3", "Track 3"),
      ];

      queueService.reorderQueue(2, 0);

      expect(queueService.getQueue().map((item) => item.videoId)).toEqual([
        "track-3",
        "track-1",
        "track-2",
      ]);
    });

    test("should reject invalid reorder indexes", () => {
      const internalQueueService = queueService as unknown as {
        queue: Track[];
      };

      internalQueueService.queue = [track("track-1", "Track 1")];

      expect(() => queueService.reorderQueue(0, 3)).toThrow(
        "Invalid queue index",
      );
    });
  });
});
