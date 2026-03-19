export interface ReleaseNotesEntry {
  version: string;
  title: string;
  highlights: string[];
}

const releaseNotesByVersion: Record<string, ReleaseNotesEntry> = {
  "0.4.0": {
    version: "0.4.0",
    title: "播放體驗更新",
    highlights: [
      "歌單列右側的加號按鈕現在會直接將歌曲加入播放佇列。",
      "新增 Cmd/Ctrl + K 快捷鍵，可快速聚焦到搜尋功能。",
      "桌面精簡播放器中的長歌名會改為水平捲動，不再把即將播放區塊往下擠。",
      "歌曲項目可開啟專輯檢視，快速瀏覽同專輯的其他曲目。",
      "新增版本更新說明對話框，可查看此版本的重點變更。",
    ],
  },
};

export function getReleaseNotesForVersion(version: string): ReleaseNotesEntry | null {
  return releaseNotesByVersion[version] ?? null;
}
