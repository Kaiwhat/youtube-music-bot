import { Card } from "@/components/ui/card";
import { NowPlaying } from "./NowPlaying";
import { ProgressBar } from "./ProgressBar";
import { PlaybackControls } from "./PlaybackControls";
import { VolumeControl } from "./VolumeControl";
import { usePlayerStore } from "@/stores/playerStore";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { formatTime } from "@/utils/format";

interface PlayerSectionProps {
  isIdle?: boolean;
  onSearchClick?: () => void;
}

export const PlayerSection = ({
  isIdle = false,
  onSearchClick,
}: PlayerSectionProps) => {
  const currentTrack = usePlayerStore((state) => state.playbackState.currentTrack);
  const queue = usePlayerStore((state) => state.playbackState.queue);
  const nextTrack = queue[0];
  const shouldShowIdleLayout = isIdle || (!currentTrack && queue.length === 0);

  return (
    <Card
      className={cn(
        "desktop-player-shell surface-card-strong min-h-0 p-0",
        shouldShowIdleLayout
          ? "mx-auto w-full max-w-[920px]"
          : "h-full",
      )}
    >
      <div
        className={cn(
          "relative z-10 flex flex-col",
          shouldShowIdleLayout
            ? "min-h-[620px] px-8 py-12 lg:px-12 lg:py-14"
            : "h-full min-h-[720px] p-8 lg:p-10",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-full w-full min-h-0 flex-col",
            shouldShowIdleLayout
              ? "max-w-[760px] justify-center gap-10"
              : "max-w-[760px] justify-between gap-6",
          )}
        >
          {/* 當前播放資訊 */}
          <NowPlaying
            onSearchClick={onSearchClick}
            showIdleState={shouldShowIdleLayout}
            compact={!shouldShowIdleLayout}
          />

          {!shouldShowIdleLayout ? (
            <div className="flex flex-col gap-6">
              {/* 播放進度條 */}
              <ProgressBar />

              {/* 播放控制與音量 */}
              <div className="flex flex-col gap-6 border-t border-[color:var(--surface-border)] pt-6">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)] xl:items-end">
                  <div className="flex min-h-[132px] flex-col items-start justify-end gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Transport
                    </p>
                    <PlaybackControls />
                  </div>
                  <div className="flex min-h-[132px] flex-col justify-end gap-3 xl:justify-self-end">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Volume
                    </p>
                    <VolumeControl />
                  </div>
                </div>
                <div className="surface-subtle rounded-[24px] border border-[color:var(--dynamic-ring)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Next Up
                  </p>
                  {nextTrack ? (
                    <div className="mt-3 flex items-center gap-4">
                      <Avatar
                        src={nextTrack.thumbnail}
                        alt={nextTrack.title}
                        size="md"
                        thumbnailQuality="sddefault"
                        className="rounded-2xl"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-[var(--text-primary)]">
                          {nextTrack.title}
                        </p>
                        <p className="truncate text-sm text-[var(--text-secondary)]">
                          {nextTrack.artist}
                        </p>
                      </div>
                      <span className="rounded-full border border-[color:var(--dynamic-ring)] bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
                        {formatTime(nextTrack.duration)}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">
                      目前還沒有下一首，建立 Mix 或加入佇列讓音樂繼續流動。
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};
