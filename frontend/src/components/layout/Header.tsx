import { ConnectionStatus } from "./ConnectionStatus";
import { Github, Music2, Search } from "lucide-react";

interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header = ({ onSearchClick }: HeaderProps) => {
  return (
    <header className="border-b border-[color:var(--surface-border)] bg-[color:var(--surface-subtle)]/90 px-4 py-3 backdrop-blur-xl lg:px-6 lg:py-4">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
        {/* Logo - 手機版縮小 */}
        <div className="flex items-center gap-3">
          <div className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--surface-border)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm lg:flex">
            <Music2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] lg:text-[1.9rem]">
              <span className="lg:hidden">🎵</span>{" "}
              <span className="hidden sm:inline">YouTube Music Bot</span>
            </h1>
            <p className="hidden text-sm text-[var(--text-secondary)] lg:block">
              Desktop jukebox with synced lyrics and live queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:flex-1 lg:justify-end lg:gap-4">
          {/* 搜尋按鈕 - 手機版隱藏 */}
          <button
            type="button"
            onClick={onSearchClick}
            className="desktop-command-button hidden min-w-[260px] items-center justify-between rounded-2xl border px-4 py-3 text-left transition-transform duration-200 hover:-translate-y-0.5 lg:flex"
          >
            <span className="flex items-center gap-3 text-[var(--text-primary)]">
              <Search className="h-4 w-4 text-[var(--text-secondary)]" />
              <span className="font-medium">搜尋音樂</span>
            </span>
            <kbd className="inline-flex h-7 select-none items-center gap-1 rounded-xl border border-[color:var(--surface-border)] bg-[var(--surface-muted)] px-2.5 font-mono text-xs text-[var(--text-secondary)]">
              <span className="text-[0.65rem]">⌘</span>K
            </kbd>
          </button>

          {/* GitHub 連結 */}
          <a
            href="https://github.com/bs10081/youtube-music-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
            aria-label="前往 GitHub 專案"
          >
            <Github className="h-5 w-5" />
          </a>

          {/* 連線狀態 */}
          <ConnectionStatus />
        </div>
      </div>
    </header>
  );
};
