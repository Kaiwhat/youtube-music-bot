import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QueueContent } from "./QueueContent";
import { usePlayerStore } from "@/stores/playerStore";

export const QueueSection = () => {
  const queue = usePlayerStore((state) => state.playbackState.queue);

  return (
    <Card className="desktop-side-panel h-full min-h-0 flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-xl">播放佇列 ({queue.length})</CardTitle>
        <p className="text-sm text-[var(--text-secondary)]">
          接下來會播放的歌曲清單，第一首會是下一首登場。
        </p>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden">
        <QueueContent className="h-full" />
      </CardContent>
    </Card>
  );
};
