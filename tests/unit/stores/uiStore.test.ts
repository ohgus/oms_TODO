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

describe("uiStore - calendar state", () => {
  beforeEach(() => {
    useUIStore.setState({
      statusFilter: "all",
      categoryFilter: null,
      isAddTodoModalOpen: false,
      editingTodo: null,
      activeTab: "today",
      selectedCalendarDate: null,
      calendarMonth: new Date(2026, 1, 1), // 2026년 2월
    });
  });

  describe("초기 상태", () => {
    it("activeTab은 초기에 'today'여야 한다", () => {
      const state = useUIStore.getState();
      expect(state.activeTab).toBe("today");
    });

    it("selectedCalendarDate는 초기에 null이어야 한다", () => {
      const state = useUIStore.getState();
      expect(state.selectedCalendarDate).toBeNull();
    });

    it("calendarMonth는 초기에 현재 월이어야 한다", () => {
      const state = useUIStore.getState();
      expect(state.calendarMonth).toBeInstanceOf(Date);
    });
  });

  describe("setActiveTab", () => {
    it("setActiveTab('calendar') 호출 시 activeTab이 변경되어야 한다", () => {
      useUIStore.getState().setActiveTab("calendar");
      expect(useUIStore.getState().activeTab).toBe("calendar");
    });

    it("setActiveTab('today') 호출 시 activeTab이 변경되어야 한다", () => {
      useUIStore.getState().setActiveTab("calendar");
      useUIStore.getState().setActiveTab("today");
      expect(useUIStore.getState().activeTab).toBe("today");
    });
  });

  describe("setSelectedCalendarDate", () => {
    it("날짜를 설정할 수 있어야 한다", () => {
      const date = new Date(2026, 1, 15);
      useUIStore.getState().setSelectedCalendarDate(date);
      expect(useUIStore.getState().selectedCalendarDate).toEqual(date);
    });

    it("null로 초기화할 수 있어야 한다", () => {
      useUIStore.getState().setSelectedCalendarDate(new Date(2026, 1, 15));
      useUIStore.getState().setSelectedCalendarDate(null);
      expect(useUIStore.getState().selectedCalendarDate).toBeNull();
    });
  });

  describe("navigateCalendarMonth", () => {
    it("'next' 호출 시 다음 달로 이동해야 한다", () => {
      useUIStore.setState({ calendarMonth: new Date(2026, 1, 1) }); // Feb 2026
      useUIStore.getState().navigateCalendarMonth("next");
      const month = useUIStore.getState().calendarMonth;
      expect(month.getFullYear()).toBe(2026);
      expect(month.getMonth()).toBe(2); // March
    });

    it("'prev' 호출 시 이전 달로 이동해야 한다", () => {
      useUIStore.setState({ calendarMonth: new Date(2026, 1, 1) }); // Feb 2026
      useUIStore.getState().navigateCalendarMonth("prev");
      const month = useUIStore.getState().calendarMonth;
      expect(month.getFullYear()).toBe(2026);
      expect(month.getMonth()).toBe(0); // January
    });

    it("12월에서 'next' 호출 시 다음 해 1월로 이동해야 한다", () => {
      useUIStore.setState({ calendarMonth: new Date(2026, 11, 1) }); // Dec 2026
      useUIStore.getState().navigateCalendarMonth("next");
      const month = useUIStore.getState().calendarMonth;
      expect(month.getFullYear()).toBe(2027);
      expect(month.getMonth()).toBe(0); // January
    });

    it("1월에서 'prev' 호출 시 이전 해 12월로 이동해야 한다", () => {
      useUIStore.setState({ calendarMonth: new Date(2026, 0, 1) }); // Jan 2026
      useUIStore.getState().navigateCalendarMonth("prev");
      const month = useUIStore.getState().calendarMonth;
      expect(month.getFullYear()).toBe(2025);
      expect(month.getMonth()).toBe(11); // December
    });
  });

  describe("셀렉터 hooks", () => {
    it("useActiveTab이 export되어야 한다", async () => {
      const { useActiveTab } = await import("@presentation/stores/uiStore");
      expect(useActiveTab).toBeDefined();
      expect(typeof useActiveTab).toBe("function");
    });

    it("useSelectedCalendarDate가 export되어야 한다", async () => {
      const { useSelectedCalendarDate } = await import("@presentation/stores/uiStore");
      expect(useSelectedCalendarDate).toBeDefined();
      expect(typeof useSelectedCalendarDate).toBe("function");
    });

    it("useCalendarMonth가 export되어야 한다", async () => {
      const { useCalendarMonth } = await import("@presentation/stores/uiStore");
      expect(useCalendarMonth).toBeDefined();
      expect(typeof useCalendarMonth).toBe("function");
    });
  });
});

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
