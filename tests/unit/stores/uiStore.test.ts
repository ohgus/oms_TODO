import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@presentation/stores/uiStore";
import type { Todo } from "@domain/entities/Todo";

const mockTodo: Todo = {
  id: "todo-1",
  title: "Test Todo",
  completed: false,
  priority: 2,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const mockTodo2: Todo = {
  id: "todo-2",
  title: "Another Todo",
  completed: true,
  priority: 3,
  dueDate: new Date("2026-03-01"),
  createdAt: new Date("2026-01-02"),
  updatedAt: new Date("2026-01-02"),
};

describe("uiStore - editingTodo", () => {
  beforeEach(() => {
    useUIStore.setState({
      statusFilter: "all",
      categoryFilter: null,
      isAddTodoModalOpen: false,
      editingTodo: null,
    });
  });

  describe("초기 상태", () => {
    it("editingTodo는 초기에 null이어야 한다", () => {
      const state = useUIStore.getState();
      expect(state.editingTodo).toBeNull();
    });
  });

  describe("openEditTodoModal", () => {
    it("openEditTodoModal(todo) 호출 시 editingTodo가 해당 todo로 설정되어야 한다", () => {
      useUIStore.getState().openEditTodoModal(mockTodo);
      expect(useUIStore.getState().editingTodo).toEqual(mockTodo);
    });

    it("다른 todo로 openEditTodoModal 호출 시 editingTodo가 교체되어야 한다", () => {
      useUIStore.getState().openEditTodoModal(mockTodo);
      useUIStore.getState().openEditTodoModal(mockTodo2);
      expect(useUIStore.getState().editingTodo).toEqual(mockTodo2);
    });
  });

  describe("closeEditTodoModal", () => {
    it("closeEditTodoModal() 호출 시 editingTodo가 null로 초기화되어야 한다", () => {
      useUIStore.getState().openEditTodoModal(mockTodo);
      expect(useUIStore.getState().editingTodo).toEqual(mockTodo);

      useUIStore.getState().closeEditTodoModal();
      expect(useUIStore.getState().editingTodo).toBeNull();
    });

    it("editingTodo가 이미 null일 때 closeEditTodoModal 호출해도 안전해야 한다", () => {
      useUIStore.getState().closeEditTodoModal();
      expect(useUIStore.getState().editingTodo).toBeNull();
    });
  });

  describe("useEditingTodo 셀렉터", () => {
    it("useEditingTodo가 export되어야 한다", async () => {
      const { useEditingTodo } = await import("@presentation/stores/uiStore");
      expect(useEditingTodo).toBeDefined();
      expect(typeof useEditingTodo).toBe("function");
    });
  });
});
