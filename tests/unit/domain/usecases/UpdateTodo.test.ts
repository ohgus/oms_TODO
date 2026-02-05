import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateTodoUseCase, UpdateTodoInput } from "@domain/usecases/UpdateTodo";
import { ITodoRepository } from "@domain/repositories/ITodoRepository";
import { Todo } from "@domain/entities/Todo";

describe("UpdateTodo Use Case", () => {
  let mockRepository: ITodoRepository;
  let useCase: UpdateTodoUseCase;
  let existingTodo: Todo;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new UpdateTodoUseCase(mockRepository);

    existingTodo = {
      id: "todo-1",
      title: "Original Title",
      description: "Original Description",
      categoryId: "category-1",
      completed: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    };
  });

  it("should update todo title", async () => {
    const input: UpdateTodoInput = {
      id: "todo-1",
      title: "Updated Title",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingTodo);
    vi.mocked(mockRepository.update).mockResolvedValue({
      ...existingTodo,
      title: "Updated Title",
      updatedAt: new Date(),
    });

    const result = await useCase.execute(input);

    expect(mockRepository.findById).toHaveBeenCalledWith("todo-1");
    expect(mockRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "todo-1",
        title: "Updated Title",
      })
    );
    expect(result.title).toBe("Updated Title");
  });

  it("should toggle todo completed status", async () => {
    const input: UpdateTodoInput = {
      id: "todo-1",
      completed: true,
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingTodo);
    vi.mocked(mockRepository.update).mockResolvedValue({
      ...existingTodo,
      completed: true,
      updatedAt: new Date(),
    });

    const result = await useCase.execute(input);

    expect(result.completed).toBe(true);
  });

  it("should update multiple fields at once", async () => {
    const input: UpdateTodoInput = {
      id: "todo-1",
      title: "New Title",
      description: "New Description",
      categoryId: "category-2",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingTodo);
    vi.mocked(mockRepository.update).mockResolvedValue({
      ...existingTodo,
      title: "New Title",
      description: "New Description",
      categoryId: "category-2",
      updatedAt: new Date(),
    });

    const result = await useCase.execute(input);

    expect(result.title).toBe("New Title");
    expect(result.description).toBe("New Description");
    expect(result.categoryId).toBe("category-2");
  });

  it("should throw error when todo does not exist", async () => {
    const input: UpdateTodoInput = {
      id: "non-existent",
      title: "Updated Title",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow("Todo not found");
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw error when updating with empty title", async () => {
    const input: UpdateTodoInput = {
      id: "todo-1",
      title: "",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingTodo);

    await expect(useCase.execute(input)).rejects.toThrow("Title is required");
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should propagate repository errors", async () => {
    const input: UpdateTodoInput = {
      id: "todo-1",
      title: "Updated Title",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingTodo);
    vi.mocked(mockRepository.update).mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(input)).rejects.toThrow("Database error");
  });
});
