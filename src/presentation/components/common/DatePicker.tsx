import { useRef } from "react";

import { Calendar, X } from "lucide-react";

import { cn } from "@shared/utils/cn";
import { formatKoreanDate } from "@shared/utils/date";

export interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  id?: string;
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
  id,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      onChange(new Date(val + "T00:00:00"));
    } else {
      onChange(undefined);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(undefined);
  };

  const handleClick = () => {
    try {
      inputRef.current?.showPicker?.();
    } catch {
      // iOS Safari에서는 showPicker()가 실패할 수 있음
      // 모바일에서는 투명 input에 대한 직접 터치로 네이티브 피커가 열림
    }
  };

  return (
    <div
      data-testid="date-picker"
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-between w-full h-11 px-3.5 bg-bg-primary rounded-xl border border-border-subtle transition-colors cursor-pointer",
        className
      )}
    >
      <span
        className={cn(
          "text-sm font-medium pointer-events-none",
          value ? "text-txt-primary" : "text-txt-tertiary"
        )}
      >
        {value ? formatKoreanDate(value) : placeholder}
      </span>

      <span className="flex items-center gap-1.5 pointer-events-none">
        {value && (
          <button
            type="button"
            data-testid="date-picker-clear"
            onClick={handleClear}
            className="text-txt-tertiary hover:text-txt-secondary p-0.5 rounded pointer-events-auto relative z-10"
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
        id={id}
        type="date"
        data-testid="date-picker-input"
        value={formatDateToInput(value)}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label={placeholder}
      />
    </div>
  );
}
