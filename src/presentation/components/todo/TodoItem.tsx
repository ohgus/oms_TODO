import { Pencil, Trash2 } from "lucide-react";
import type { Todo } from "@domain/entities/Todo";
import { Button } from "@presentation/components/ui/button";
import { Checkbox } from "@presentation/components/ui/checkbox";
import { Badge } from "@presentation/components/ui/badge";
import { PriorityStars } from "@presentation/components/todo/PriorityStars";
import { DateBadge } from "@presentation/components/common/DateBadge";
import { cn } from "@shared/utils/cn";

export interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  categoryName?: string;
  categoryColor?: string;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onDelete,
  onEdit,
  categoryName,
  categoryColor,
}: TodoItemProps) {
  return (
    <div className="flex flex-col gap-2 p-3 bg-bg-surface rounded-lg border sm:flex-row sm:items-center sm:gap-4" data-testid="todo-item">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div data-testid="checkbox-wrapper" className="flex items-center justify-center min-h-11 min-w-11">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggleComplete(todo.id)}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
            data-testid="todo-checkbox"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium truncate",
              todo.completed && "line-through text-txt-secondary"
            )}
            data-testid="todo-title"
          >
            {todo.title}
          </p>
          {todo.dueDate && (
            <DateBadge date={todo.dueDate} className="mt-0.5" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pl-11 sm:pl-0">
        <PriorityStars level={todo.priority} />

        {categoryName && (
          <Badge
            variant="secondary"
            className="text-xs"
            style={categoryColor ? { backgroundColor: categoryColor, color: "#fff" } : undefined}
          >
            <span
              data-testid="category-color"
              className="sr-only"
              style={{ backgroundColor: categoryColor }}
            />
            {categoryName}
          </Badge>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 h-9 w-9"
            onClick={() => onEdit(todo)}
            aria-label={`Edit "${todo.title}"`}
            data-testid="edit-button"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 h-9 w-9 text-accent-red hover:text-accent-red"
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete "${todo.title}"`}
            data-testid="delete-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
