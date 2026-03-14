import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ThumbnailQuality,
  type ThumbnailQuality as ThumbnailQualityType,
  getOptimizedThumbnailCandidates,
} from "@/utils/thumbnail";

const CROSSFADE_DURATION_MS = 640;

export interface AnimatedAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  thumbnailQuality?: ThumbnailQualityType;
}

const AnimatedAvatar = React.forwardRef<HTMLDivElement, AnimatedAvatarProps>(
  (
    {
      className,
      src,
      alt,
      fallback,
      size = "md",
      thumbnailQuality = ThumbnailQuality.HIGH,
      ...props
    },
    ref,
  ) => {
    const candidateSources = React.useMemo(
      () =>
        src ? getOptimizedThumbnailCandidates(src, thumbnailQuality) : [],
      [src, thumbnailQuality],
    );
    const candidateKey = React.useMemo(
      () => candidateSources.join("|"),
      [candidateSources],
    );
    const [activeSrc, setActiveSrc] = React.useState<string | undefined>(
      candidateSources[0],
    );
    const [previousSrc, setPreviousSrc] = React.useState<string | undefined>();
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const transitionTimeoutRef = React.useRef<number | null>(null);
    const cleanupFrameRef = React.useRef<number | null>(null);
    const requestIdRef = React.useRef(0);
    const activeSrcRef = React.useRef<string | undefined>(candidateSources[0]);

    React.useEffect(() => {
      activeSrcRef.current = activeSrc;
    }, [activeSrc]);

    const clearTransitionHandles = React.useCallback(() => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      if (cleanupFrameRef.current !== null) {
        window.cancelAnimationFrame(cleanupFrameRef.current);
        cleanupFrameRef.current = null;
      }
    }, []);

    React.useEffect(() => {
      return () => {
        clearTransitionHandles();
      };
    }, [clearTransitionHandles]);

    React.useEffect(() => {
      requestIdRef.current += 1;
      const requestId = requestIdRef.current;
      clearTransitionHandles();

      if (candidateSources.length === 0) {
        setActiveSrc(undefined);
        setPreviousSrc(undefined);
        setIsTransitioning(false);
        return;
      }

      let cancelled = false;

      void resolveFirstLoadableImage(candidateSources)
        .then((resolvedSrc) => {
          if (
            cancelled ||
            requestId !== requestIdRef.current ||
            !resolvedSrc
          ) {
            return;
          }

          if (!activeSrcRef.current) {
            setActiveSrc(resolvedSrc);
            setPreviousSrc(undefined);
            setIsTransitioning(false);
            return;
          }

          if (resolvedSrc === activeSrcRef.current) {
            setPreviousSrc(undefined);
            setIsTransitioning(false);
            return;
          }

          setPreviousSrc(activeSrcRef.current);
          setActiveSrc(resolvedSrc);
          setIsTransitioning(false);

          cleanupFrameRef.current = window.requestAnimationFrame(() => {
            if (cancelled || requestId !== requestIdRef.current) {
              return;
            }

            setIsTransitioning(true);
          });

          transitionTimeoutRef.current = window.setTimeout(() => {
            if (cancelled || requestId !== requestIdRef.current) {
              return;
            }

            setPreviousSrc(undefined);
            transitionTimeoutRef.current = null;
            setIsTransitioning(false);
          }, CROSSFADE_DURATION_MS);
        })
        .catch(() => {
          if (cancelled || requestId !== requestIdRef.current) {
            return;
          }

          setActiveSrc(undefined);
          setPreviousSrc(undefined);
          setIsTransitioning(false);
        });

      return () => {
        cancelled = true;
        clearTransitionHandles();
      };
    }, [candidateKey, candidateSources, clearTransitionHandles]);

    const showFallback = !activeSrc && !previousSrc;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-md",
          size === "sm" && "h-10 w-10",
          size === "md" && "h-12 w-12",
          size === "lg" && "h-16 w-16",
          className,
        )}
        {...props}
      >
        {previousSrc ? (
          <img
            src={previousSrc}
            alt={alt || ""}
            className={cn(
              "artwork-crossfade-previous h-full w-full object-cover",
              isTransitioning && "artwork-crossfade-previous-exit",
            )}
            decoding="async"
          />
        ) : null}

        {activeSrc ? (
          <img
            src={activeSrc}
            alt={alt || ""}
            className={cn(
              "artwork-crossfade-current h-full w-full object-cover",
              previousSrc && "artwork-crossfade-current-prepared",
              isTransitioning && "artwork-crossfade-current-enter",
            )}
            decoding="async"
            onError={() => {
              if (!previousSrc) {
                setActiveSrc(undefined);
              }
            }}
          />
        ) : null}

        {showFallback ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
            {fallback || (
              <svg
                className="h-1/2 w-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);

AnimatedAvatar.displayName = "AnimatedAvatar";

async function resolveFirstLoadableImage(
  sources: string[],
): Promise<string | undefined> {
  for (const source of sources) {
    try {
      await preloadImage(source);
      return source;
    } catch {
      continue;
    }
  }

  return undefined;
}

function preloadImage(source: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Failed to load image: ${source}`));
    image.src = source;
  });
}

export { AnimatedAvatar };
