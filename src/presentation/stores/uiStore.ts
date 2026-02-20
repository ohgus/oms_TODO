import { create } from "zustand";
import type { Todo } from "@domain/entities/Todo";

export type StatusFilter = "all" | "active" | "completed";
export type ActiveTab = "today" | "calendar";

interface UIState {
  statusFilter: StatusFilter;
  categoryFilter: string | null;
  isAddTodoModalOpen: boolean;
  editingTodo: Todo | null;
  activeTab: ActiveTab;
  selectedCalendarDate: Date | null;
  calendarMonth: Date;
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
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedCalendarDate: (date: Date | null) => void;
  navigateCalendarMonth: (direction: "prev" | "next") => void;
}

type UIStore = UIState & UIActions;

const now = new Date();

const initialState: UIState = {
  statusFilter: "all",
  categoryFilter: null,
  isAddTodoModalOpen: false,
  editingTodo: null,
  activeTab: "today",
  selectedCalendarDate: now,
  calendarMonth: new Date(now.getFullYear(), now.getMonth(), 1),
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

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedCalendarDate: (date) => set({ selectedCalendarDate: date }),

  navigateCalendarMonth: (direction) =>
    set((state) => {
      const current = state.calendarMonth;
      const offset = direction === "next" ? 1 : -1;
      return {
        calendarMonth: new Date(current.getFullYear(), current.getMonth() + offset, 1),
      };
    }),
}));

// Selector hooks for better performance
export const useStatusFilter = () => useUIStore((state) => state.statusFilter);
export const useCategoryFilter = () => useUIStore((state) => state.categoryFilter);
export const useIsAddTodoModalOpen = () => useUIStore((state) => state.isAddTodoModalOpen);
export const useEditingTodo = () => useUIStore((state) => state.editingTodo);
export const useActiveTab = () => useUIStore((state) => state.activeTab);
export const useSelectedCalendarDate = () => useUIStore((state) => state.selectedCalendarDate);
export const useCalendarMonth = () => useUIStore((state) => state.calendarMonth);
