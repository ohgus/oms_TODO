import { create } from "zustand";
import type { Todo } from "@domain/entities/Todo";

export type StatusFilter = "all" | "active" | "completed";

interface UIState {
  statusFilter: StatusFilter;
  categoryFilter: string | null;
  isAddTodoModalOpen: boolean;
  editingTodo: Todo | null;
}

interface UIActions {
  setStatusFilter: (filter: StatusFilter) => void;
  setCategoryFilter: (categoryId: string | null) => void;
  toggleAddTodoModal: () => void;
  openAddTodoModal: () => void;
  closeAddTodoModal: () => void;
  openEditTodoModal: (todo: Todo) => void;
  closeEditTodoModal: () => void;
  resetFilters: () => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  statusFilter: "all",
  categoryFilter: null,
  isAddTodoModalOpen: false,
  editingTodo: null,
};

export const useUIStore = create<UIStore>((set) => ({
  ...initialState,

  setStatusFilter: (filter) => set({ statusFilter: filter }),

  setCategoryFilter: (categoryId) => set({ categoryFilter: categoryId }),

  toggleAddTodoModal: () => set((state) => ({ isAddTodoModalOpen: !state.isAddTodoModalOpen })),

  openAddTodoModal: () => set({ isAddTodoModalOpen: true }),

  closeAddTodoModal: () => set({ isAddTodoModalOpen: false }),

  openEditTodoModal: (todo) => set({ editingTodo: todo }),

  closeEditTodoModal: () => set({ editingTodo: null }),

  resetFilters: () =>
    set({
      statusFilter: "all",
      categoryFilter: null,
    }),
}));

// Selector hooks for better performance
export const useStatusFilter = () => useUIStore((state) => state.statusFilter);
export const useCategoryFilter = () => useUIStore((state) => state.categoryFilter);
export const useIsAddTodoModalOpen = () => useUIStore((state) => state.isAddTodoModalOpen);
export const useEditingTodo = () => useUIStore((state) => state.editingTodo);
