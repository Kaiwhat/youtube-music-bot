import type { ArtworkThemeState } from "@/hooks/useArtworkTheme";
import { ArtworkThemeBackdrop } from "./ArtworkThemeBackdrop";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  onSearchClick?: () => void;
  artworkTheme: ArtworkThemeState;
}

export const MainLayout = ({
  children,
  onSearchClick,
  artworkTheme,
}: MainLayoutProps) => {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <ArtworkThemeBackdrop theme={artworkTheme} />
      <div className="relative z-10 flex h-screen flex-col overflow-hidden">
        <Header onSearchClick={onSearchClick} />
        <main className="flex-1 overflow-hidden min-h-0">
        {/* 桌面版：有 padding 和 max-width */}
          <div className="hidden lg:block mx-auto h-full max-w-[1480px] px-6 py-5 min-h-0">
            {children}
          </div>
          {/* 手機版：全高度 */}
          <div className="lg:hidden h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
