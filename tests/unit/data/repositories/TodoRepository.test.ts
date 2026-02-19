import { describe, it, expect, vi, beforeEach } from "vitest";
import { SupabaseTodoRepository } from "@data/repositories/SupabaseTodoRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Todo } from "@domain/entities/Todo";

// Mock Supabase client
const createMockSupabaseClient = () => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockSingle = vi.fn();

  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  });

  mockSelect.mockReturnValue({
    eq: mockEq,
    single: mockSingle,
  });

  mockInsert.mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: mockSingle,
    }),
  });

  mockUpdate.mockReturnValue({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: mockSingle,
      }),
    }),
  });

  mockDelete.mockReturnValue({
    eq: mockEq,
  });

  mockEq.mockReturnValue({
    single: mockSingle,
  });

  return {
    client: { from: mockFrom } as unknown as SupabaseClient,
    mockFrom,
    mockSelect,
    mockInsert,
    mockUpdate,
    mockDelete,
    mockEq,
    mockSingle,
  };
};

describe("SupabaseTodoRepository", () => {
  let repository: SupabaseTodoRepository;
  let mockClient: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    repository = new SupabaseTodoRepository(mockClient.client);
  });

  describe("create", () => {
    it("should create a todo and return the created entity", async () => {
      const todoInput: Omit<Todo, "id" | "createdAt" | "updatedAt"> = {
        title: "New Todo",
        description: "Description",
        categoryId: "category-1",
        completed: false,
        priority: 2,
      };

      const dbResponse = {
        id: "todo-1",
        title: "New Todo",
        description: "Description",
        category_id: "category-1",
        completed: false,
        priority: 2,
        due_date: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockClient.mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: dbResponse, error: null }),
          }),
        }),
      });

      const result = await repository.create(todoInput);

      expect(mockClient.mockFrom).toHaveBeenCalledWith("todos");
      expect(result.id).toBe("todo-1");
      expect(result.title).toBe("New Todo");
      expect(result.categoryId).toBe("category-1");
    });

    it("should throw error when insert fails", async () => {
      const todoInput: Omit<Todo, "id" | "createdAt" | "updatedAt"> = {
        title: "New Todo",
        completed: false,
        priority: 2,
      };

      mockClient.mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Insert failed" },
            }),
          }),
        }),
      });

      await expect(repository.create(todoInput)).rejects.toThrow("Insert failed");
    });
  });

  describe("findById", () => {
    it("should return a todo when found", async () => {
      const dbResponse = {
        id: "todo-1",
        title: "Test Todo",
        description: null,
        category_id: null,
        completed: false,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockClient.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: dbResponse, error: null }),
          }),
        }),
      });

      const result = await repository.findById("todo-1");

      expect(mockClient.mockFrom).toHaveBeenCalledWith("todos");
      expect(result).not.toBeNull();
      expect(result?.id).toBe("todo-1");
      expect(result?.title).toBe("Test Todo");
    });

    it("should return null when todo not found", async () => {
      mockClient.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await repository.findById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all todos when no filter provided", async () => {
      const dbResponse = [
        {
          id: "todo-1",
          title: "Todo 1",
          description: null,
          category_id: null,
          completed: false,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: "todo-2",
          title: "Todo 2",
          description: null,
          category_id: null,
          completed: true,
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
        },
      ];

      mockClient.mockFrom.mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: dbResponse, error: null }),
      });

      const result = await repository.findAll();

      expect(mockClient.mockFrom).toHaveBeenCalledWith("todos");
      expect(result).toHaveLength(2);
    });

    it("should apply completed filter", async () => {
      const dbResponse = [
        {
          id: "todo-2",
          title: "Todo 2",
          description: null,
          category_id: null,
          completed: true,
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
        },
      ];

      mockClient.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: dbResponse, error: null }),
        }),
      });

      const result = await repository.findAll({ completed: true });

      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(true);
    });

    it("should apply category filter", async () => {
      const dbResponse = [
        {
          id: "todo-1",
          title: "Todo 1",
          description: null,
          category_id: "category-1",
          completed: false,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockClient.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: dbResponse, error: null }),
        }),
      });

      const result = await repository.findAll({ categoryId: "category-1" });

      expect(result).toHaveLength(1);
      expect(result[0].categoryId).toBe("category-1");
    });

    it("should map priority and due_date from row to todo", async () => {
      const dbResponse = [
        {
          id: "todo-1",
          title: "Todo 1",
          description: null,
          category_id: null,
          completed: false,
          priority: 3,
          due_date: "2026-03-15",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockClient.mockFrom.mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: dbResponse, error: null }),
      });

      const result = await repository.findAll();

      expect(result[0].priority).toBe(3);
      expect(result[0].dueDate).toEqual(new Date("2026-03-15"));
    });

    it("should map null due_date to undefined", async () => {
      const dbResponse = [
        {
          id: "todo-1",
          title: "Todo 1",
          description: null,
          category_id: null,
          completed: false,
          priority: 2,
          due_date: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockClient.mockFrom.mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: dbResponse, error: null }),
      });

      const result = await repository.findAll();

      expect(result[0].priority).toBe(2);
      expect(result[0].dueDate).toBeUndefined();
    });
  });

  describe("update", () => {
    it("should update a todo and return the updated entity", async () => {
      const todoToUpdate: Todo = {
        id: "todo-1",
        title: "Updated Title",
        description: "Updated Description",
        categoryId: "category-1",
        completed: true,
        priority: 2,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      };

      const dbResponse = {
        id: "todo-1",
        title: "Updated Title",
        description: "Updated Description",
        category_id: "category-1",
        completed: true,
        priority: 2,
        due_date: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
      };

      mockClient.mockFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: dbResponse, error: null }),
            }),
          }),
        }),
      });

      const result = await repository.update(todoToUpdate);

      expect(mockClient.mockFrom).toHaveBeenCalledWith("todos");
      expect(result.title).toBe("Updated Title");
      expect(result.completed).toBe(true);
    });

    it("should throw error when update fails", async () => {
      const todoToUpdate: Todo = {
        id: "todo-1",
        title: "Updated Title",
        completed: false,
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClient.mockFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Update failed" },
              }),
            }),
          }),
        }),
      });

      await expect(repository.update(todoToUpdate)).rejects.toThrow("Update failed");
    });
  });

  describe("delete", () => {
    it("should delete a todo by id", async () => {
      mockClient.mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      await repository.delete("todo-1");

      expect(mockClient.mockFrom).toHaveBeenCalledWith("todos");
    });

    it("should throw error when delete fails", async () => {
      mockClient.mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: "Delete failed" } }),
        }),
      });

      await expect(repository.delete("todo-1")).rejects.toThrow("Delete failed");
    });
  });
});
