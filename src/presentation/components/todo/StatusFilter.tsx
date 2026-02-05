import { Button } from "@presentation/components/ui/button";

export type TodoStatus = "all" | "active" | "completed";

export interface StatusFilterProps {
  selectedStatus: TodoStatus;
  onSelect: (status: TodoStatus) => void;
}

const statuses: { value: TodoStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function StatusFilter({ selectedStatus, onSelect }: StatusFilterProps) {
  return (
    <div
      role="group"
      aria-label="Status filter"
      className="flex gap-1 p-1 bg-muted rounded-lg"
      data-testid="status-filter"
    >
      {statuses.map(({ value, label }) => (
        <Button
          key={value}
          variant={selectedStatus === value ? "default" : "ghost"}
          size="sm"
          onClick={() => onSelect(value)}
          aria-pressed={selectedStatus === value}
          className="min-h-11 flex-1 rounded-md transition-colors"
          data-testid={`filter-${value}`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
