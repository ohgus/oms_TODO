import { create } from "zustand";

export type StatusFilter = "all" | "active" | "completed";

interface UIState {
  statusFilter: StatusFilter;
  categoryFilter: string | null;
  isAddTodoModalOpen: boolean;
}

interface UIActions {
  setStatusFilter: (filter: StatusFilter) => void;
  setCategoryFilter: (categoryId: string | null) => void;
  toggleAddTodoModal: () => void;
  openAddTodoModal: () => void;
  closeAddTodoModal: () => void;
  resetFilters: () => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  statusFilter: "all",
  categoryFilter: null,
  isAddTodoModalOpen: false,
};

export const useUIStore = create<UIStore>((set) => ({
  ...initialState,

  setStatusFilter: (filter) => set({ statusFilter: filter }),

  setCategoryFilter: (categoryId) => set({ categoryFilter: categoryId }),

  toggleAddTodoModal: () => set((state) => ({ isAddTodoModalOpen: !state.isAddTodoModalOpen })),

  openAddTodoModal: () => set({ isAddTodoModalOpen: true }),

  closeAddTodoModal: () => set({ isAddTodoModalOpen: false }),

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
