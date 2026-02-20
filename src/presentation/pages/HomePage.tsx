import { useMemo } from "react";
import type { DIContainer } from "@infrastructure/di/container";
import type { UpdateTodoInput } from "@domain/entities/Todo";
import { useTodos } from "@presentation/hooks/useTodos";
import { useCategories } from "@presentation/hooks/useCategories";
import { useTodosRealtime } from "@presentation/hooks/useTodosRealtime";
import { useUIStore, useEditingTodo, type StatusFilter } from "@presentation/stores/uiStore";
import { TodoAddModal, type TodoAddFormData } from "@presentation/components/todo/TodoAddModal";
import { TodoEditModal } from "@presentation/components/todo/TodoEditModal";
import { Header } from "@presentation/components/common/Header";
import { TodayView } from "@presentation/components/views/TodayView";
import { BottomTabBar } from "@presentation/components/navigation/BottomTabBar";
import { CalendarView } from "@presentation/components/calendar/CalendarView";

export interface HomePageProps {
  container: DIContainer;
}

const EMPTY_MESSAGES: Record<StatusFilter, string> = {
  all: "No todos yet. Add one above!",
  active: "No active todos",
  completed: "No completed todos yet",
};

function buildFilterOptions(
  statusFilter: StatusFilter,
  categoryFilter: string | null
): { completed?: boolean; categoryId?: string; dueDate?: Date } {
  const today = new Date();
  const categoryOption = categoryFilter ? { categoryId: categoryFilter } : {};

  return {
    dueDate: today,
    ...(statusFilter !== "all" && { completed: statusFilter === "completed" }),
    ...categoryOption,
  };
}

export function HomePage({ container }: HomePageProps) {
  useTodosRealtime();

  const statusFilter = useUIStore((s) => s.statusFilter);
  const categoryFilter = useUIStore((s) => s.categoryFilter);
  const isAddTodoModalOpen = useUIStore((s) => s.isAddTodoModalOpen);
  const activeTab = useUIStore((s) => s.activeTab);
  const setStatusFilter = useUIStore((s) => s.setStatusFilter);
  const setCategoryFilter = useUIStore((s) => s.setCategoryFilter);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const openAddTodoModal = useUIStore((s) => s.openAddTodoModal);
  const closeAddTodoModal = useUIStore((s) => s.closeAddTodoModal);
  const openEditTodoModal = useUIStore((s) => s.openEditTodoModal);
  const closeEditTodoModal = useUIStore((s) => s.closeEditTodoModal);
  const editingTodo = useEditingTodo();

  const todoFilterOptions = useMemo(
    () => buildFilterOptions(statusFilter, categoryFilter),
    [statusFilter, categoryFilter]
  );

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
    <div className="min-h-screen bg-bg-primary pb-20" data-testid="home-page">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <Header onAddClick={openAddTodoModal} />

        {activeTab === "today" && (
          <TodayView
            todos={todos}
            categories={categories}
            isLoading={isLoading}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            onStatusFilterChange={setStatusFilter}
            onCategoryFilterChange={setCategoryFilter}
            onToggleComplete={toggleTodo}
            onDelete={deleteTodo}
            onEdit={openEditTodoModal}
            emptyMessage={EMPTY_MESSAGES[statusFilter]}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarView
            container={container}
            categories={categories}
            onToggleComplete={toggleTodo}
            onDelete={deleteTodo}
            onEdit={openEditTodoModal}
          />
        )}

        <TodoAddModal
          open={isAddTodoModalOpen}
          onOpenChange={(open) => {
            if (!open) closeAddTodoModal();
          }}
          onSubmit={handleAddTodo}
          categories={categories}
        />

        <TodoEditModal
          todo={editingTodo}
          onOpenChange={(open) => {
            if (!open) closeEditTodoModal();
          }}
          onSubmit={handleUpdateTodo}
          categories={categories}
        />
      </div>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
