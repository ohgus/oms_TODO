import { CheckSquare } from "lucide-react";
import type { Todo } from "@domain/entities/Todo";
import type { DIContainer } from "@infrastructure/di/container";
import { useTodos } from "@presentation/hooks/useTodos";
import { useCategories } from "@presentation/hooks/useCategories";
import { useTodosRealtime } from "@presentation/hooks/useTodosRealtime";
import { useUIStore, type StatusFilter as StatusFilterType } from "@presentation/stores/uiStore";
import { TodoForm, type TodoFormData } from "@presentation/components/todo/TodoForm";
import { TodoList } from "@presentation/components/todo/TodoList";
import { StatusFilter } from "@presentation/components/todo/StatusFilter";
import { CategoryFilter } from "@presentation/components/category/CategoryFilter";

export interface HomePageProps {
  container: DIContainer;
}

const EMPTY_MESSAGES: Record<StatusFilterType, string> = {
  all: "No todos yet. Add one above!",
  active: "No active todos",
  completed: "No completed todos yet",
};

function buildFilterOptions(
  statusFilter: StatusFilterType,
  categoryFilter: string | null
): { completed?: boolean; categoryId?: string } | undefined {
  const categoryOption = categoryFilter ? { categoryId: categoryFilter } : {};

  if (statusFilter === "all") {
    return categoryFilter ? categoryOption : undefined;
  }

  return {
    completed: statusFilter === "completed",
    ...categoryOption,
  };
}

export function HomePage({ container }: HomePageProps) {
  // Enable realtime synchronization
  useTodosRealtime();

  const { statusFilter, categoryFilter, setStatusFilter, setCategoryFilter } = useUIStore();

  const todoFilterOptions = buildFilterOptions(statusFilter, categoryFilter);

  const {
    todos,
    isLoading: isTodosLoading,
    isError: isTodosError,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos(container.todoRepository, todoFilterOptions);

  const {
    categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(container.categoryRepository);

  const isLoading = isTodosLoading || isCategoriesLoading;
  const isError = isTodosError || isCategoriesError;

  const handleAddTodo = async (data: TodoFormData) => {
    if (!data.title.trim()) return;
    await addTodo({
      title: data.title,
      categoryId: data.categoryId,
    });
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTodo(id);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  const handleEdit = (_todo: Todo) => {
    // TODO: Implement edit functionality in a future phase
  };

  const handleStatusFilterChange = (status: StatusFilterType) => {
    setStatusFilter(status);
  };

  const handleCategoryFilterChange = (categoryId: string | undefined) => {
    setCategoryFilter(categoryId ?? null);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-accent-red text-lg">Error loading data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary" data-testid="home-page">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <CheckSquare className="h-8 w-8 text-accent-primary" />
          <h1 className="text-2xl font-bold text-txt-primary">TODO</h1>
        </header>

        {/* Add Todo Form */}
        <section className="mb-6" aria-label="Add todo">
          <TodoForm onSubmit={handleAddTodo} categories={categories} />
        </section>

        {/* Filters */}
        <section className="space-y-3 mb-6" aria-label="Filters">
          <StatusFilter selectedStatus={statusFilter} onSelect={handleStatusFilterChange} />
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              selectedCategoryId={categoryFilter ?? undefined}
              onSelect={handleCategoryFilterChange}
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
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
              emptyMessage={EMPTY_MESSAGES[statusFilter]}
            />
          )}
        </section>
      </div>
    </div>
  );
}
