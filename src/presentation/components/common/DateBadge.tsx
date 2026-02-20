import { Calendar } from "lucide-react";
import { formatKoreanDateShort } from "@shared/utils/date";
import { cn } from "@shared/utils/cn";

interface DateBadgeProps {
  date: Date;
  className?: string;
}

export function DateBadge({ date, className }: DateBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-txt-tertiary", className)}>
      <Calendar className="h-3 w-3" data-testid="calendar-icon" />
      {formatKoreanDateShort(date)}
    </span>
  );
}
