import type { Track } from "@/types";
import { useAlbumDialogStore } from "@/stores/albumDialogStore";
import { cn } from "@/lib/utils";
import { Disc3 } from "lucide-react";

interface OpenAlbumButtonProps {
  album: Track["album"];
  trackTitle?: string;
  className?: string;
}

export const OpenAlbumButton = ({
  album,
  trackTitle,
  className,
}: OpenAlbumButtonProps) => {
  const openAlbum = useAlbumDialogStore((state) => state.openAlbum);

  if (!album) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => openAlbum(album)}
      className={cn(
        "inline-flex min-w-0 items-center gap-1 text-left text-xs font-medium text-[var(--accent)] transition-opacity hover:opacity-80",
        className,
      )}
      aria-label={
        trackTitle
          ? `開啟專輯：${album.name}（歌曲：${trackTitle}）`
          : `開啟專輯：${album.name}`
      }
      title={`開啟專輯：${album.name}`}
    >
      <Disc3 className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{album.name}</span>
    </button>
  );
};
