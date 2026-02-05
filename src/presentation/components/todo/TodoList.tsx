import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";
import { TodoItem } from "./TodoItem";

export interface TodoListProps {
  todos: Todo[];
  categories?: Category[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function LoadingSkeleton() {
  return (
    <div data-testid="todo-list-loading" className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 bg-card rounded-lg border animate-pulse"
        >
          <div className="h-5 w-5 bg-muted rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TodoList({
  todos,
  categories = [],
  onToggleComplete,
  onDelete,
  onEdit,
  isLoading = false,
  emptyMessage = "No todos yet. Add one above!",
}: TodoListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const getCategoryInfo = (categoryId?: string) => {
    if (!categoryId) return { name: undefined, color: undefined };
    const category = categories.find((c) => c.id === categoryId);
    return {
      name: category?.name,
      color: category?.color,
    };
  };

  return (
    <ul role="list" className="space-y-2">
      {todos.map((todo) => {
        const { name, color } = getCategoryInfo(todo.categoryId);
        return (
          <li key={todo.id} role="listitem">
            <TodoItem
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              categoryName={name}
              categoryColor={color}
            />
          </li>
        );
      })}
    </ul>
  );
}
