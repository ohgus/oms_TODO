import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useTodos } from "@presentation/hooks/useTodos";
import type { Todo } from "@domain/entities/Todo";
import type { ITodoRepository } from "@domain/repositories/ITodoRepository";

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Test Todo 1",
    description: "Description 1",
    completed: false,
    categoryId: "cat-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Test Todo 2",
    completed: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "Test Todo 3",
    completed: false,
    categoryId: "cat-2",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
];

const createMockRepository = (): ITodoRepository => ({
  create: vi.fn().mockResolvedValue(mockTodos[0]),
  findById: vi.fn().mockResolvedValue(mockTodos[0]),
  findAll: vi.fn().mockResolvedValue(mockTodos),
  update: vi.fn().mockResolvedValue({ ...mockTodos[0], completed: true }),
  delete: vi.fn().mockResolvedValue(undefined),
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe("useTodos", () => {
  let mockRepository: ITodoRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    vi.clearAllMocks();
  });

  describe("Todo 목록 조회", () => {
    it("초기 로딩 상태를 반환해야 한다", () => {
      const { result } = renderHook(() => useTodos(mockRepository), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.todos).toEqual([]);
    });

    it("Todo 목록을 성공적으로 조회해야 한다", async () => {
      const { result } = renderHook(() => useTodos(mockRepository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.todos).toEqual(mockTodos);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it("에러 발생 시 에러 상태를 반환해야 한다", async () => {
      const errorRepository = {
        ...createMockRepository(),
        findAll: vi.fn().mockRejectedValue(new Error("Failed to fetch")),
      };

      const { result } = renderHook(() => useTodos(errorRepository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe("Failed to fetch");
    });
  });

  describe("Todo 추가", () => {
    it("새 Todo를 추가할 수 있어야 한다", async () => {
      const newTodo: Todo = {
        id: "4",
        title: "New Todo",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const repository = {
        ...createMockRepository(),
        create: vi.fn().mockResolvedValue(newTodo),
      };

      const { result } = renderHook(() => useTodos(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addTodo({ title: "New Todo" });
      });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "New Todo", completed: false })
      );
    });

    it("빈 제목으로 Todo를 추가하면 에러가 발생해야 한다", async () => {
      const { result } = renderHook(() => useTodos(mockRepository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.addTodo({ title: "" });
        })
      ).rejects.toThrow("Title is required");
    });
  });

  describe("Todo 업데이트", () => {
    it("Todo 완료 상태를 토글할 수 있어야 한다", async () => {
      const repository = {
        ...createMockRepository(),
        findById: vi.fn().mockResolvedValue(mockTodos[0]),
        update: vi.fn().mockResolvedValue({ ...mockTodos[0], completed: true }),
      };

      const { result } = renderHook(() => useTodos(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleTodo("1");
      });

      expect(repository.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: "1", completed: true })
      );
    });

    it("Todo 제목을 수정할 수 있어야 한다", async () => {
      const repository = {
        ...createMockRepository(),
        findById: vi.fn().mockResolvedValue(mockTodos[0]),
        update: vi.fn().mockResolvedValue({ ...mockTodos[0], title: "Updated Title" }),
      };

      const { result } = renderHook(() => useTodos(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateTodo({ id: "1", title: "Updated Title" });
      });

      expect(repository.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: "1", title: "Updated Title" })
      );
    });

    it("존재하지 않는 Todo를 업데이트하면 에러가 발생해야 한다", async () => {
      const repository = {
        ...createMockRepository(),
        findById: vi.fn().mockResolvedValue(null),
      };

      const { result } = renderHook(() => useTodos(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.updateTodo({ id: "non-existent", title: "Test" });
        })
      ).rejects.toThrow("Todo not found");
    });
  });

  describe("Todo 삭제", () => {
    it("Todo를 삭제할 수 있어야 한다", async () => {
      const repository = {
        ...createMockRepository(),
        findById: vi.fn().mockResolvedValue(mockTodos[0]),
        delete: vi.fn().mockResolvedValue(undefined),
      };

      const { result } = renderHook(() => useTodos(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteTodo("1");
      });

      expect(repository.delete).toHaveBeenCalledWith("1");
    });

    it("존재하지 않는 Todo를 삭제하면 에러가 발생해야 한다", async () => {
      const repository = {
        ...createMockRepository(),
        findById: vi.fn().mockResolvedValue(null),
      };

      const { result } = renderHook(() => useTodos(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.deleteTodo("non-existent");
        })
      ).rejects.toThrow("Todo not found");
    });
  });

  describe("필터링", () => {
    it("완료된 Todo만 필터링할 수 있어야 한다", async () => {
      const completedTodos = mockTodos.filter((t) => t.completed);
      const repository = {
        ...createMockRepository(),
        findAll: vi.fn().mockResolvedValue(completedTodos),
      };

      const { result } = renderHook(() => useTodos(repository, { completed: true }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(repository.findAll).toHaveBeenCalledWith({ completed: true });
      expect(result.current.todos).toEqual(completedTodos);
    });

    it("미완료된 Todo만 필터링할 수 있어야 한다", async () => {
      const activeTodos = mockTodos.filter((t) => !t.completed);
      const repository = {
        ...createMockRepository(),
        findAll: vi.fn().mockResolvedValue(activeTodos),
      };

      const { result } = renderHook(() => useTodos(repository, { completed: false }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(repository.findAll).toHaveBeenCalledWith({ completed: false });
      expect(result.current.todos).toEqual(activeTodos);
    });

    it("카테고리별로 필터링할 수 있어야 한다", async () => {
      const categoryTodos = mockTodos.filter((t) => t.categoryId === "cat-1");
      const repository = {
        ...createMockRepository(),
        findAll: vi.fn().mockResolvedValue(categoryTodos),
      };

      const { result } = renderHook(() => useTodos(repository, { categoryId: "cat-1" }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(repository.findAll).toHaveBeenCalledWith({ categoryId: "cat-1" });
      expect(result.current.todos).toEqual(categoryTodos);
    });
  });
});
