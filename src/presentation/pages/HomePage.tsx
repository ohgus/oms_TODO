import { CheckSquare, Plus } from "lucide-react";
import type { DIContainer } from "@infrastructure/di/container";
import type { UpdateTodoInput } from "@domain/entities/Todo";
import { useTodos } from "@presentation/hooks/useTodos";
import { useCategories } from "@presentation/hooks/useCategories";
import { useTodosRealtime } from "@presentation/hooks/useTodosRealtime";
import {
  useUIStore,
  useEditingTodo,
  type StatusFilter as StatusFilterType,
} from "@presentation/stores/uiStore";
import { TodoAddModal, type TodoAddFormData } from "@presentation/components/todo/TodoAddModal";
import { TodoEditModal } from "@presentation/components/todo/TodoEditModal";
import { TodoList } from "@presentation/components/todo/TodoList";
import { StatusFilter } from "@presentation/components/todo/StatusFilter";
import { CategoryFilter } from "@presentation/components/category/CategoryFilter";
import { Button } from "@presentation/components/ui/button";

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

  const statusFilter = useUIStore((s) => s.statusFilter);
  const categoryFilter = useUIStore((s) => s.categoryFilter);
  const isAddTodoModalOpen = useUIStore((s) => s.isAddTodoModalOpen);
  const setStatusFilter = useUIStore((s) => s.setStatusFilter);
  const setCategoryFilter = useUIStore((s) => s.setCategoryFilter);
  const openAddTodoModal = useUIStore((s) => s.openAddTodoModal);
  const closeAddTodoModal = useUIStore((s) => s.closeAddTodoModal);
  const openEditTodoModal = useUIStore((s) => s.openEditTodoModal);
  const closeEditTodoModal = useUIStore((s) => s.closeEditTodoModal);
  const editingTodo = useEditingTodo();

  const todoFilterOptions = buildFilterOptions(statusFilter, categoryFilter);

  const {
    todos,
    isLoading: isTodosLoading,
    isError: isTodosError,
    addTodo,
    updateTodo,
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

  const handleAddTodo = async (data: TodoAddFormData) => {
    if (!data.title.trim()) return;
    await addTodo({
      title: data.title,
      categoryId: data.categoryId,
      priority: data.priority,
      dueDate: data.dueDate,
    });
    closeAddTodoModal();
  };

  const handleUpdateTodo = async (id: string, data: UpdateTodoInput) => {
    await updateTodo({ id, ...data });
    closeEditTodoModal();
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
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-accent-primary" />
            <h1 className="text-2xl font-bold text-txt-primary">TODO</h1>
          </div>
          <Button
            onClick={openAddTodoModal}
            size="icon"
            className="min-h-11 min-w-11 bg-accent-primary text-white hover:bg-accent-primary/90"
            aria-label="Add todo"
            data-testid="add-todo-button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Filters */}
        <section className="space-y-3 mb-6" aria-label="Filters">
          <StatusFilter selectedStatus={statusFilter} onSelect={setStatusFilter} />
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              selectedCategoryId={categoryFilter ?? undefined}
              onSelect={(id) => setCategoryFilter(id ?? null)}
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
              onToggleComplete={toggleTodo}
              onDelete={deleteTodo}
              onEdit={openEditTodoModal}
              emptyMessage={EMPTY_MESSAGES[statusFilter]}
            />
          )}
        </section>

        {/* Add Todo Modal */}
        <TodoAddModal
          open={isAddTodoModalOpen}
          onOpenChange={(open) => {
            if (!open) closeAddTodoModal();
          }}
          onSubmit={handleAddTodo}
          categories={categories}
        />

        {/* Edit Todo Modal */}
        <TodoEditModal
          todo={editingTodo}
          onOpenChange={(open) => {
            if (!open) closeEditTodoModal();
          }}
          onSubmit={handleUpdateTodo}
          categories={categories}
        />
      </div>
    </div>
  );
}
