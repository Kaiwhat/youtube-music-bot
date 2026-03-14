import type { ArtworkThemeState } from "@/hooks/useArtworkTheme";
import { buildArtworkBackdropStyle } from "@/utils/artworkTheme";

interface ArtworkThemeBackdropProps {
  theme: ArtworkThemeState;
}

export const ArtworkThemeBackdrop = ({
  theme,
}: ArtworkThemeBackdropProps) => {
  return (
    <div className="app-theme-backdrop" aria-hidden="true">
      {theme.previousTokens ? (
        <div
          className="app-theme-backdrop-layer"
          style={buildArtworkBackdropStyle(theme.previousTokens)}
        />
      ) : null}
      <div
        key={theme.transitionKey}
        className="app-theme-backdrop-layer app-theme-backdrop-layer-enter"
        style={buildArtworkBackdropStyle(theme.currentTokens)}
      />
      <div className="app-theme-backdrop-wash" />
    </div>
  );
};
