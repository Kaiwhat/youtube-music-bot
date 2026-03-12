import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { SearchInput } from "./SearchInput";
import { SearchResultItem } from "./SearchResultItem";
import { Empty } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/toast";
import { usePlayerStore } from "@/stores/playerStore";
import { api } from "@/services/api";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const searchResults = usePlayerStore((state) => state.searchResults);
  const setSearchResults = usePlayerStore((state) => state.setSearchResults);
  const { showToast } = useToast();

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await api.search(query);
      if (response.success && response.data) {
        setSearchResults(response.data);
        if (response.data.length === 0) {
          showToast({ message: "沒有找到相關歌曲", type: "info" });
        }
      } else {
        showToast({ message: response.error || "搜尋失敗", type: "error" });
      }
    } catch (error) {
      showToast({ message: "搜尋發生錯誤", type: "error" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToQueue = async (videoId: string) => {
    setAddingId(videoId);
    try {
      const response = await api.addToQueue(videoId);
      if (response.success) {
        showToast({ message: "已加入播放佇列", type: "success" });
        // 保持 Modal 開啟，不調用 onOpenChange(false)
      } else {
        showToast({ message: response.error || "加入失敗", type: "error" });
      }
    } catch (error) {
      showToast({ message: "加入發生錯誤", type: "error" });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 flex flex-col">
        <div className="p-6 pb-4 border-b border-gray-200">
          <DialogTitle className="mb-4">搜尋音樂</DialogTitle>
          <SearchInput onSearch={handleSearch} isLoading={isSearching} />
          <DialogClose />
        </div>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="p-6 pt-4">
            {isSearching ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <SearchResultItem
                    key={result.videoId}
                    result={result}
                    onAdd={handleAddToQueue}
                    isAdding={addingId === result.videoId}
                  />
                ))}
              </div>
            ) : (
              <Empty
                title="尚無搜尋結果"
                description="輸入關鍵字開始搜尋音樂"
              />
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            Esc
          </kbd>{" "}
          關閉
        </div>
      </DialogContent>
    </Dialog>
  );
};
