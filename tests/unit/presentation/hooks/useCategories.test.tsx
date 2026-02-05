import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCategories } from "@presentation/hooks/useCategories";
import type { Category } from "@domain/entities/Category";
import type { ICategoryRepository } from "@domain/repositories/ICategoryRepository";

const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Work",
    color: "#6366f1",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "cat-2",
    name: "Personal",
    color: "#22c55e",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "cat-3",
    name: "Shopping",
    color: "#f59e0b",
    createdAt: new Date("2024-01-03"),
  },
];

const createMockRepository = (): ICategoryRepository => ({
  create: vi.fn().mockResolvedValue(mockCategories[0]),
  findById: vi.fn().mockResolvedValue(mockCategories[0]),
  findAll: vi.fn().mockResolvedValue(mockCategories),
  findByName: vi.fn().mockResolvedValue(null),
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

describe("useCategories", () => {
  let mockRepository: ICategoryRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    vi.clearAllMocks();
  });

  describe("카테고리 목록 조회", () => {
    it("초기 로딩 상태를 반환해야 한다", () => {
      const { result } = renderHook(() => useCategories(mockRepository), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.categories).toEqual([]);
    });

    it("카테고리 목록을 성공적으로 조회해야 한다", async () => {
      const { result } = renderHook(() => useCategories(mockRepository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.categories).toEqual(mockCategories);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it("에러 발생 시 에러 상태를 반환해야 한다", async () => {
      const errorRepository = {
        ...createMockRepository(),
        findAll: vi.fn().mockRejectedValue(new Error("Failed to fetch")),
      };

      const { result } = renderHook(() => useCategories(errorRepository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe("Failed to fetch");
    });
  });

  describe("카테고리 추가", () => {
    it("새 카테고리를 추가할 수 있어야 한다", async () => {
      const newCategory: Category = {
        id: "cat-4",
        name: "Health",
        color: "#ef4444",
        createdAt: new Date(),
      };

      const repository = {
        ...createMockRepository(),
        create: vi.fn().mockResolvedValue(newCategory),
        findByName: vi.fn().mockResolvedValue(null),
      };

      const { result } = renderHook(() => useCategories(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addCategory({ name: "Health", color: "#ef4444" });
      });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Health", color: "#ef4444" })
      );
    });

    it("빈 이름으로 카테고리를 추가하면 에러가 발생해야 한다", async () => {
      const { result } = renderHook(() => useCategories(mockRepository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.addCategory({ name: "" });
        })
      ).rejects.toThrow("Category name is required");
    });

    it("중복된 이름으로 카테고리를 추가하면 에러가 발생해야 한다", async () => {
      const repository = {
        ...createMockRepository(),
        findByName: vi.fn().mockResolvedValue(mockCategories[0]),
      };

      const { result } = renderHook(() => useCategories(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.addCategory({ name: "Work" });
        })
      ).rejects.toThrow("Category already exists");
    });

    it("기본 색상으로 카테고리를 추가할 수 있어야 한다", async () => {
      const newCategory: Category = {
        id: "cat-4",
        name: "Default Color",
        color: "#6366f1",
        createdAt: new Date(),
      };

      const repository = {
        ...createMockRepository(),
        create: vi.fn().mockResolvedValue(newCategory),
        findByName: vi.fn().mockResolvedValue(null),
      };

      const { result } = renderHook(() => useCategories(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addCategory({ name: "Default Color" });
      });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Default Color" })
      );
    });
  });

  describe("카테고리 삭제", () => {
    it("카테고리를 삭제할 수 있어야 한다", async () => {
      const repository = {
        ...createMockRepository(),
        findById: vi.fn().mockResolvedValue(mockCategories[0]),
        delete: vi.fn().mockResolvedValue(undefined),
      };

      const { result } = renderHook(() => useCategories(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteCategory("cat-1");
      });

      expect(repository.delete).toHaveBeenCalledWith("cat-1");
    });

    it("존재하지 않는 카테고리를 삭제하면 에러가 발생해야 한다", async () => {
      const repository = {
        ...createMockRepository(),
        findById: vi.fn().mockResolvedValue(null),
      };

      const { result } = renderHook(() => useCategories(repository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.deleteCategory("non-existent");
        })
      ).rejects.toThrow("Category not found");
    });
  });

  describe("카테고리 조회", () => {
    it("ID로 카테고리를 조회할 수 있어야 한다", async () => {
      const { result } = renderHook(() => useCategories(mockRepository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const category = result.current.getCategoryById("cat-1");
      expect(category).toEqual(mockCategories[0]);
    });

    it("존재하지 않는 ID로 조회하면 undefined를 반환해야 한다", async () => {
      const { result } = renderHook(() => useCategories(mockRepository), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const category = result.current.getCategoryById("non-existent");
      expect(category).toBeUndefined();
    });
  });
});
