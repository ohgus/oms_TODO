import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteTodoUseCase } from "@domain/usecases/DeleteTodo";
import { ITodoRepository } from "@domain/repositories/ITodoRepository";
import { Todo } from "@domain/entities/Todo";

describe("DeleteTodo Use Case", () => {
  let mockRepository: ITodoRepository;
  let useCase: DeleteTodoUseCase;
  let existingTodo: Todo;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new DeleteTodoUseCase(mockRepository);

    existingTodo = {
      id: "todo-1",
      title: "Test Todo",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it("should delete an existing todo", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(existingTodo);
    vi.mocked(mockRepository.delete).mockResolvedValue(undefined);

    await useCase.execute("todo-1");

    expect(mockRepository.findById).toHaveBeenCalledWith("todo-1");
    expect(mockRepository.delete).toHaveBeenCalledWith("todo-1");
  });

  it("should throw error when todo does not exist", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute("non-existent")).rejects.toThrow("Todo not found");
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("should propagate repository errors", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(existingTodo);
    vi.mocked(mockRepository.delete).mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute("todo-1")).rejects.toThrow("Database error");
  });
});
