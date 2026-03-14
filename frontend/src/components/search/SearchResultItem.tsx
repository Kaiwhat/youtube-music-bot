import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatTime } from "@/utils/format";
import type { Track } from "@/types";
import { Plus, Shuffle } from "lucide-react";
import { ThumbnailQuality } from "@/utils/thumbnail";

interface SearchResultItemProps {
  result: Track;
  onAdd: (track: Track) => void;
  onCreateMix: (track: Track) => void;
  isAdding?: boolean;
  isCreatingMix?: boolean;
}

export const SearchResultItem = ({
  result,
  onAdd,
  onCreateMix,
  isAdding,
  isCreatingMix,
}: SearchResultItemProps) => {
  return (
    <Card className="rounded-[30px] p-5">
      <div className="flex items-center gap-5">
        <Avatar
          src={result.thumbnail}
          alt={result.title}
          size="lg"
          className="rounded-[20px] border border-[color:var(--surface-border)]"
          thumbnailQuality={ThumbnailQuality.HIGH}
        />
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-xl font-semibold text-[var(--text-primary)]">
            {result.title}
          </h3>
          <p className="truncate text-sm text-[var(--text-secondary)]">
            {result.artist}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {formatTime(result.duration)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Button
            onClick={() => onAdd(result)}
            disabled={isAdding || isCreatingMix}
            size="sm"
            className="h-14 rounded-[22px] px-7 text-base"
          >
            {isAdding ? (
              "加入中..."
            ) : (
              <>
                <Plus className="mr-1 h-4 w-4" />
                加入佇列
              </>
            )}
          </Button>
          <Button
            onClick={() => onCreateMix(result)}
            disabled={isAdding || isCreatingMix}
            size="sm"
            variant="outline"
            title="創建 Mix 混合播放清單"
            className="h-14 w-14 rounded-[20px] px-0"
          >
            {isCreatingMix ? "建立中..." : <Shuffle className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};
