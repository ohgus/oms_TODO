import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { HomePage } from "@presentation/pages/HomePage";
import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";
import type { ITodoRepository } from "@domain/repositories/ITodoRepository";
import type { ICategoryRepository } from "@domain/repositories/ICategoryRepository";
import { DIContainer } from "@infrastructure/di/container";
import { useUIStore } from "@presentation/stores/uiStore";

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    completed: false,
    categoryId: "cat-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Finish project",
    completed: true,
    categoryId: "cat-2",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "Call mom",
    completed: false,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
];

const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Personal",
    color: "#22c55e",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "cat-2",
    name: "Work",
    color: "#6366f1",
    createdAt: new Date("2024-01-02"),
  },
];

const createMockTodoRepository = (): ITodoRepository => ({
  create: vi.fn().mockImplementation(async (todo) => ({
    ...todo,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  findById: vi.fn().mockImplementation(async (id) => mockTodos.find((t) => t.id === id) ?? null),
  findAll: vi.fn().mockResolvedValue(mockTodos),
  update: vi.fn().mockImplementation(async (todo) => todo),
  delete: vi.fn().mockResolvedValue(undefined),
});

const createMockCategoryRepository = (): ICategoryRepository => ({
  create: vi.fn().mockImplementation(async (category) => ({
    ...category,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  })),
  findById: vi
    .fn()
    .mockImplementation(async (id) => mockCategories.find((c) => c.id === id) ?? null),
  findAll: vi.fn().mockResolvedValue(mockCategories),
  findByName: vi
    .fn()
    .mockImplementation(async (name) => mockCategories.find((c) => c.name === name) ?? null),
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

describe("HomePage", () => {
  let mockTodoRepository: ITodoRepository;
  let mockCategoryRepository: ICategoryRepository;
  let container: DIContainer;
  const user = userEvent.setup();

  beforeEach(() => {
    mockTodoRepository = createMockTodoRepository();
    mockCategoryRepository = createMockCategoryRepository();
    container = new DIContainer(mockTodoRepository, mockCategoryRepository);
    vi.clearAllMocks();
    // Reset Zustand store state
    useUIStore.setState({ statusFilter: "all", categoryFilter: null, isAddTodoModalOpen: false });
  });

  describe("페이지 로드", () => {
    it("페이지 제목이 표시되어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByRole("heading", { name: /todo/i })).toBeInTheDocument();
    });

    it("로딩 중에는 로딩 상태가 표시되어야 한다", () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("Todo 목록이 표시되어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      expect(screen.getByText("Finish project")).toBeInTheDocument();
      expect(screen.getByText("Call mom")).toBeInTheDocument();
    });

    it("카테고리 필터가 표시되어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      // Wait for loading to finish first
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Category filter should now show categories
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /personal/i })).toBeInTheDocument();
      });

      expect(screen.getByRole("button", { name: /work/i })).toBeInTheDocument();
    });

    it("상태 필터가 표시되어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
      });

      expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /completed/i })).toBeInTheDocument();
    });
  });

  describe("새 Todo 추가", () => {
    it("입력창에 텍스트를 입력하고 추가할 수 있어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/add a new todo/i);
      await user.type(input, "New task");

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      expect(mockTodoRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "New task" })
      );
    });

    it("빈 입력으로는 Todo를 추가할 수 없어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      expect(mockTodoRepository.create).not.toHaveBeenCalled();
    });

    it("카테고리를 선택하여 Todo를 추가할 수 있어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/add a new todo/i);
      await user.type(input, "Work task");

      // select element with aria-label="Category" (exact match)
      const categorySelect = screen.getByLabelText("Category");
      await user.selectOptions(categorySelect, "cat-2");

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      expect(mockTodoRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Work task", categoryId: "cat-2" })
      );
    });
  });

  describe("Todo 완료 토글", () => {
    it("체크박스를 클릭하면 완료 상태가 토글되어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      const checkbox = screen.getAllByRole("checkbox")[0];
      await user.click(checkbox);

      expect(mockTodoRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: "1", completed: true })
      );
    });
  });

  describe("Todo 삭제", () => {
    it("삭제 버튼을 클릭하면 Todo가 삭제되어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(mockTodoRepository.delete).toHaveBeenCalledWith("1");
    });
  });

  describe("필터링", () => {
    it("Active 필터를 클릭하면 미완료 Todo만 표시되어야 한다", async () => {
      const activeTodos = mockTodos.filter((t) => !t.completed);
      (mockTodoRepository.findAll as ReturnType<typeof vi.fn>).mockResolvedValue(activeTodos);

      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const activeFilter = screen.getByRole("button", { name: /active/i });
      await user.click(activeFilter);

      expect(mockTodoRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ completed: false })
      );
    });

    it("Completed 필터를 클릭하면 완료된 Todo만 표시되어야 한다", async () => {
      const completedTodos = mockTodos.filter((t) => t.completed);
      (mockTodoRepository.findAll as ReturnType<typeof vi.fn>).mockResolvedValue(completedTodos);

      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const completedFilter = screen.getByRole("button", { name: /completed/i });
      await user.click(completedFilter);

      expect(mockTodoRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ completed: true })
      );
    });

    it("카테고리 필터를 클릭하면 해당 카테고리의 Todo만 표시되어야 한다", async () => {
      const categoryTodos = mockTodos.filter((t) => t.categoryId === "cat-1");
      (mockTodoRepository.findAll as ReturnType<typeof vi.fn>).mockResolvedValue(categoryTodos);

      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      const categoryFilter = screen.getByRole("button", { name: /personal/i });
      await user.click(categoryFilter);

      expect(mockTodoRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ categoryId: "cat-1" })
      );
    });

    it("All 필터를 클릭하면 모든 Todo가 표시되어야 한다", async () => {
      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // First click Active
      const activeFilter = screen.getByRole("button", { name: /active/i });
      await user.click(activeFilter);

      // Then click All (get the first one which is in the status filter)
      const allFilters = screen.getAllByRole("button", { name: /all/i });
      await user.click(allFilters[0]);

      expect(mockTodoRepository.findAll).toHaveBeenLastCalledWith(undefined);
    });
  });

  describe("빈 상태", () => {
    it("Todo가 없을 때 빈 상태 메시지가 표시되어야 한다", async () => {
      (mockTodoRepository.findAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.getByText(/no todos/i)).toBeInTheDocument();
      });
    });
  });

  describe("에러 상태", () => {
    it("데이터 로드 실패 시 에러 메시지가 표시되어야 한다", async () => {
      (mockTodoRepository.findAll as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Network error")
      );

      render(<HomePage container={container} />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });
});
