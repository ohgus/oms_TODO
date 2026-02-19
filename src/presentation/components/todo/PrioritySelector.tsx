import { Star } from "lucide-react";
import type { Priority } from "@domain/entities/Todo";
import { cn } from "@shared/utils/cn";

export interface PrioritySelectorProps {
  value: Priority;
  onChange: (value: Priority) => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 1, label: "낮음" },
  { value: 2, label: "보통" },
  { value: 3, label: "높음" },
];

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="flex gap-2">
      {PRIORITY_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${option.label} (${option.value})`}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
              isSelected
                ? "bg-accent-light text-accent-primary border-accent-primary"
                : "bg-bg-surface text-txt-secondary border-border-subtle"
            )}
          >
            <span className="flex items-center gap-0.5">
              {Array.from({ length: option.value }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    isSelected
                      ? "fill-accent-primary text-accent-primary"
                      : "fill-txt-secondary text-txt-secondary"
                  )}
                  data-filled="true"
                />
              ))}
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
