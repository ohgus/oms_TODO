import { useRef } from "react";
import { Calendar, X } from "lucide-react";
import { formatKoreanDate } from "@shared/utils/date";
import { cn } from "@shared/utils/cn";

export interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

function formatDateToInput(date?: Date): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "날짜를 선택하세요",
  className,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.showPicker?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      onChange(new Date(val + "T00:00:00"));
    } else {
      onChange(undefined);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <button
      type="button"
      data-testid="date-picker"
      onClick={handleClick}
      className={cn(
        "flex items-center justify-between w-full h-11 px-3.5 bg-bg-primary rounded-xl border border-border-subtle transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <span
        className={cn(
          "text-sm font-medium",
          value ? "text-txt-primary" : "text-txt-tertiary"
        )}
      >
        {value ? formatKoreanDate(value) : placeholder}
      </span>

      <span className="flex items-center gap-1.5">
        {value && (
          <button
            type="button"
            data-testid="date-picker-clear"
            onClick={handleClear}
            className="text-txt-tertiary hover:text-txt-secondary p-0.5 rounded"
            aria-label="날짜 초기화"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Calendar
          data-testid="date-picker-calendar-icon"
          className="h-[18px] w-[18px] text-accent-primary"
        />
      </span>

      <input
        ref={inputRef}
        type="date"
        data-testid="date-picker-hidden-input"
        value={formatDateToInput(value)}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </button>
  );
}
