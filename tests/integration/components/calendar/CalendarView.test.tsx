import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CalendarView } from "@presentation/components/calendar/CalendarView";
import { useUIStore } from "@presentation/stores/uiStore";
import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";
import type { ITodoRepository } from "@domain/repositories/ITodoRepository";
import type { ICategoryRepository } from "@domain/repositories/ICategoryRepository";
import { DIContainer } from "@infrastructure/di/container";

const today = new Date();

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Today Task",
    completed: false,
    priority: 2,
    dueDate: today,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Another Task",
    completed: false,
    priority: 1,
    dueDate: new Date(today.getFullYear(), today.getMonth(), 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCategories: Category[] = [
  { id: "cat-1", name: "Work", color: "#6366f1", createdAt: new Date() },
];

const createMockTodoRepository = (): ITodoRepository => ({
  create: vi.fn().mockResolvedValue(mockTodos[0]),
  findById: vi.fn().mockResolvedValue(null),
  findAll: vi.fn().mockResolvedValue(mockTodos),
  update: vi.fn().mockResolvedValue(mockTodos[0]),
  delete: vi.fn().mockResolvedValue(undefined),
});

const createMockCategoryRepository = (): ICategoryRepository => ({
  create: vi.fn().mockResolvedValue(mockCategories[0]),
  findById: vi.fn().mockResolvedValue(null),
  findAll: vi.fn().mockResolvedValue(mockCategories),
  findByName: vi.fn().mockResolvedValue(null),
  delete: vi.fn().mockResolvedValue(undefined),
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe("CalendarView", () => {
  let container: DIContainer;
  const user = userEvent.setup();

  beforeEach(() => {
    container = new DIContainer(createMockTodoRepository(), createMockCategoryRepository());
    useUIStore.setState({
      calendarMonth: new Date(today.getFullYear(), today.getMonth(), 1),
      selectedCalendarDate: today,
    });
    vi.clearAllMocks();
  });

  it("요일 헤더(일~토)를 표시해야 한다", async () => {
    render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("일")).toBeInTheDocument();
    expect(screen.getByText("월")).toBeInTheDocument();
    expect(screen.getByText("화")).toBeInTheDocument();
    expect(screen.getByText("수")).toBeInTheDocument();
    expect(screen.getByText("목")).toBeInTheDocument();
    expect(screen.getByText("금")).toBeInTheDocument();
    expect(screen.getByText("토")).toBeInTheDocument();
  });

  it("월 네비게이션 헤더를 표시해야 한다", () => {
    render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    const monthYear = `${today.getFullYear()}년 ${today.getMonth() + 1}월`;
    expect(screen.getByText(monthYear)).toBeInTheDocument();
  });

  it("이전/다음 월 버튼이 있어야 한다", () => {
    render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText("이전 달")).toBeInTheDocument();
    expect(screen.getByLabelText("다음 달")).toBeInTheDocument();
  });

  it("다음 달 버튼 클릭 시 월이 변경되어야 한다", async () => {
    render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByLabelText("다음 달"));

    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const expectedText = `${nextMonth.getFullYear()}년 ${nextMonth.getMonth() + 1}월`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it("캘린더 그리드에 날짜가 렌더링되어야 한다", () => {
    render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    // 현재 달의 15일이 표시되어야 함
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("이번 주 TODO 섹션을 표시해야 한다", () => {
    render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("이번 주 TODO")).toBeInTheDocument();
  });

  describe("선택 날짜 섹션", () => {
    it("캘린더 뷰 진입 시 선택 날짜 섹션이 표시되어야 한다", () => {
      useUIStore.setState({
        calendarMonth: new Date(2026, 1, 1),
        selectedCalendarDate: new Date(2026, 1, 20),
      });

      render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      const selectedSection = screen.getByLabelText("선택 날짜 TODO");
      expect(selectedSection).toBeInTheDocument();
    });
  });

  describe("캘린더 그리드 카드 스타일", () => {
    it("캘린더 그리드가 카드 스타일 래퍼로 감싸져 있어야 한다", () => {
      render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      const calendarGrid = screen.getByTestId("calendar-grid-card");
      expect(calendarGrid).toBeInTheDocument();
      expect(calendarGrid.className).toContain("bg-bg-surface");
      expect(calendarGrid.className).toContain("rounded-xl");
      expect(calendarGrid.className).toContain("shadow");
    });
  });

  describe("요일/날짜 색상", () => {
    it("일요일 헤더는 빨간색(text-accent-red)이어야 한다", () => {
      render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      const sunHeader = screen.getByText("일");
      expect(sunHeader.className).toContain("text-accent-red");
    });

    it("토요일 헤더는 초록색(text-accent-primary)이어야 한다", () => {
      render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      const satHeader = screen.getByText("토");
      expect(satHeader.className).toContain("text-accent-primary");
    });

    it("평일 헤더는 text-txt-tertiary이어야 한다", () => {
      render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      const monHeader = screen.getByText("월");
      expect(monHeader.className).toContain("text-txt-tertiary");
    });

    it("일요일 날짜는 빨간색이어야 한다", () => {
      // 2026년 2월 1일은 일요일
      useUIStore.setState({
        calendarMonth: new Date(2026, 1, 1),
        selectedCalendarDate: new Date(2026, 1, 10),
      });

      render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      const dayButtons = screen.getAllByRole("button").filter((btn) => btn.textContent === "1");
      const feb1 = dayButtons[0]; // 2월 1일 (일요일)
      const feb1DateSpan = feb1.querySelector("span")!;
      expect(feb1DateSpan.className).toContain("text-accent-red");
    });

    it("토요일 날짜는 초록색이어야 한다", () => {
      // 2026년 2월 7일은 토요일
      useUIStore.setState({
        calendarMonth: new Date(2026, 1, 1),
        selectedCalendarDate: new Date(2026, 1, 10),
      });

      render(<CalendarView container={container} categories={mockCategories} onToggleComplete={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />, {
        wrapper: createWrapper(),
      });

      const dayButtons = screen.getAllByRole("button").filter((btn) => btn.textContent === "7");
      const feb7 = dayButtons[0]; // 2월 7일 (토요일)
      const feb7DateSpan = feb7.querySelector("span")!;
      expect(feb7DateSpan.className).toContain("text-accent-primary");
    });
  });
});
