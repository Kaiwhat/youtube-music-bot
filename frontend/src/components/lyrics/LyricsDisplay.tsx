import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LyricsContent } from "./LyricsContent";

interface LyricsDisplayProps {
  isVisible?: boolean;
}

export const LyricsDisplay = ({ isVisible = true }: LyricsDisplayProps) => {
  return (
    <Card className="desktop-side-panel h-full min-h-0 flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-xl">歌詞</CardTitle>
        <p className="text-sm text-[var(--text-secondary)]">
          聚焦正在播放的句子，讓閱讀和旋律一起推進。
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden min-h-0">
        <LyricsContent isVisible={isVisible} />
      </CardContent>
    </Card>
  );
};
