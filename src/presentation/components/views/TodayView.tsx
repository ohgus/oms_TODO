import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";
import type { StatusFilter as StatusFilterType } from "@presentation/stores/uiStore";
import { StatusFilter } from "@presentation/components/todo/StatusFilter";
import { CategoryFilter } from "@presentation/components/category/CategoryFilter";
import { TodoList } from "@presentation/components/todo/TodoList";

export interface TodayViewProps {
  todos: Todo[];
  categories: Category[];
  isLoading: boolean;
  statusFilter: StatusFilterType;
  categoryFilter: string | null;
  onStatusFilterChange: (filter: StatusFilterType) => void;
  onCategoryFilterChange: (categoryId: string | null) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  emptyMessage: string;
}

export function TodayView({
  todos,
  categories,
  isLoading,
  statusFilter,
  categoryFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
  onToggleComplete,
  onDelete,
  onEdit,
  emptyMessage,
}: TodayViewProps) {
  return (
    <>
      {/* Filters */}
      <section className="space-y-3 mb-6" aria-label="Filters">
        <StatusFilter selectedStatus={statusFilter} onSelect={onStatusFilterChange} />
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategoryId={categoryFilter ?? undefined}
            onSelect={(id) => onCategoryFilterChange(id ?? null)}
          />
        )}
      </section>

      {/* Todo List */}
      <section aria-label="Todo list">
        {isLoading ? (
          <div className="text-center py-8" data-testid="loading-indicator">
            <p className="text-txt-secondary">Loading...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            categories={categories}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
            emptyMessage={emptyMessage}
          />
        )}
      </section>
    </>
  );
}
