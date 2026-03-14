import { formatTime } from "@/utils/format";

interface TimeDisplayProps {
  current: number;
  total: number;
}

export const TimeDisplay = ({ current, total }: TimeDisplayProps) => {
  return (
    <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
      <span>{formatTime(current)}</span>
      <span>{formatTime(total)}</span>
    </div>
  );
};
