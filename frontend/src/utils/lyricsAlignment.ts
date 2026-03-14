interface LyricScrollTargetInput {
  activeOffsetTop: number;
  activeHeight: number;
  viewportHeight: number;
  scrollHeight: number;
}

export function calculateLyricScrollTop({
  activeOffsetTop,
  activeHeight,
  viewportHeight,
  scrollHeight,
}: LyricScrollTargetInput): number {
  if (
    !Number.isFinite(activeOffsetTop) ||
    !Number.isFinite(activeHeight) ||
    !Number.isFinite(viewportHeight) ||
    !Number.isFinite(scrollHeight) ||
    activeOffsetTop < 0 ||
    activeHeight < 0 ||
    viewportHeight <= 0 ||
    scrollHeight <= 0
  ) {
    return 0;
  }

  const rawTarget =
    activeOffsetTop - viewportHeight / 2 + activeHeight / 2;
  const maxScrollTop = Math.max(0, scrollHeight - viewportHeight);

  return Math.min(Math.max(rawTarget, 0), maxScrollTop);
}

export function isLyricScrollAligned(
  scrollTop: number,
  targetScrollTop: number,
  tolerance = 2,
): boolean {
  if (
    !Number.isFinite(scrollTop) ||
    !Number.isFinite(targetScrollTop) ||
    !Number.isFinite(tolerance)
  ) {
    return false;
  }

  return Math.abs(scrollTop - targetScrollTop) <= tolerance;
}
