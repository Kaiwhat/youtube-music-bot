import { useState, useCallback } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { MainLayout } from "@/components/layout/MainLayout";
import { SearchModal } from "@/components/search/SearchModal";
import { PlayerSection } from "@/components/player/PlayerSection";
import { QueueSection } from "@/components/queue/QueueSection";
import { LyricsDisplay } from "@/components/lyrics/LyricsDisplay";
import { ToastProvider } from "@/components/ui/toast";

function App() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // 初始化 WebSocket 連接
  useWebSocket();

  // 穩定的函數引用，避免不必要的事件監聽器重新綁定
  const handleSearchOpen = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  // 初始化全局快捷鍵
  useKeyboardShortcuts({
    onSearchOpen: handleSearchOpen,
  });

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  return (
    <ToastProvider>
      <MainLayout onSearchClick={handleSearchClick}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：播放器 */}
          <div className="space-y-6">
            <PlayerSection />
          </div>

          {/* 右側：播放佇列和歌詞 */}
          <div className="space-y-6">
            <QueueSection />
            <LyricsDisplay />
          </div>
        </div>
      </MainLayout>

      {/* 搜尋彈窗 */}
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </ToastProvider>
  );
}

export default App;
