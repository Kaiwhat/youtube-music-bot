import { useEffect } from "react";

interface UseKeyboardShortcutsOptions {
  onSearchOpen?: () => void;
}

/**
 * 全局鍵盤快捷鍵 Hook
 *
 * 支援的快捷鍵：
 * - ⌘K (macOS) / Ctrl+K (Windows/Linux): 打開搜尋
 */
export const useKeyboardShortcuts = ({
  onSearchOpen,
}: UseKeyboardShortcutsOptions = {}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 如果焦點在輸入框內，不觸發快捷鍵
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // ⌘K (Mac) 或 Ctrl+K (Windows/Linux) - 打開搜尋
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        onSearchOpen?.();
      }

      // 可以在此添加更多快捷鍵
      // 例如：空格鍵播放/暫停、方向鍵前進/後退等
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSearchOpen]);
};
