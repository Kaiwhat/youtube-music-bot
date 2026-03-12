import { ConnectionStatus } from "./ConnectionStatus";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header = ({ onSearchClick }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          🎵 YouTube Music Bot
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={onSearchClick}
            className="gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            搜尋音樂
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-xs text-gray-600">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <ConnectionStatus />
        </div>
      </div>
    </header>
  );
};
