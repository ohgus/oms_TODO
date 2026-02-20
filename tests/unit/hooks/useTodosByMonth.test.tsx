import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useTodosByMonth } from "@presentation/hooks/useTodosByMonth";
import type { Todo } from "@domain/entities/Todo";
import type { ITodoRepository } from "@domain/repositories/ITodoRepository";

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Feb Task",
    completed: false,
    priority: 2,
    dueDate: new Date(2026, 1, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Feb Task 2",
    completed: true,
    priority: 1,
    dueDate: new Date(2026, 1, 20),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const createMockRepository = (): ITodoRepository => ({
  create: vi.fn().mockResolvedValue(mockTodos[0]),
  findById: vi.fn().mockResolvedValue(null),
  findAll: vi.fn().mockResolvedValue(mockTodos),
  update: vi.fn().mockResolvedValue(mockTodos[0]),
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

describe("useTodosByMonth", () => {
  let mockRepository: ITodoRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    vi.clearAllMocks();
  });

  it("월별 TODO를 조회해야 한다", async () => {
    const month = new Date(2026, 1, 1); // Feb 2026

    const { result } = renderHook(() => useTodosByMonth(mockRepository, month), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.todos).toEqual(mockTodos);
  });

  it("dueDateRange 필터를 전달해야 한다", async () => {
    const month = new Date(2026, 1, 1);

    renderHook(() => useTodosByMonth(mockRepository, month), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    const calledFilter = (mockRepository.findAll as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(calledFilter).toHaveProperty("dueDateRange");
    expect(calledFilter.dueDateRange.from.getMonth()).toBe(1);
    expect(calledFilter.dueDateRange.to.getMonth()).toBe(1);
  });

  it("월 변경 시 다른 queryKey로 조회해야 한다", async () => {
    const month1 = new Date(2026, 1, 1);
    const month2 = new Date(2026, 2, 1);

    const wrapper = createWrapper();

    const { result, rerender } = renderHook(
      ({ month }) => useTodosByMonth(mockRepository, month),
      { wrapper, initialProps: { month: month1 } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    rerender({ month: month2 });

    await waitFor(() => {
      expect(mockRepository.findAll).toHaveBeenCalledTimes(2);
    });
  });
});
