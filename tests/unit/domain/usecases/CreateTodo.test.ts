import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateTodoUseCase, CreateTodoInput } from "@domain/usecases/CreateTodo";
import { ITodoRepository } from "@domain/repositories/ITodoRepository";
import { Todo } from "@domain/entities/Todo";

describe("CreateTodo Use Case", () => {
  let mockRepository: ITodoRepository;
  let useCase: CreateTodoUseCase;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new CreateTodoUseCase(mockRepository);
  });

  it("should create a todo with valid data", async () => {
    const input: CreateTodoInput = {
      title: "New Todo",
      description: "Description",
      categoryId: "category-1",
    };

    const createdTodo: Todo = {
      id: "todo-1",
      title: "New Todo",
      description: "Description",
      categoryId: "category-1",
      completed: false,
      priority: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(createdTodo);

    const result = await useCase.execute(input);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Todo",
        description: "Description",
        categoryId: "category-1",
        completed: false,
      })
    );
    expect(result).toEqual(createdTodo);
  });

  it("should create a todo without optional fields", async () => {
    const input: CreateTodoInput = {
      title: "Simple Todo",
    };

    const createdTodo: Todo = {
      id: "todo-2",
      title: "Simple Todo",
      completed: false,
      priority: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockRepository.create).mockResolvedValue(createdTodo);

    const result = await useCase.execute(input);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(result.title).toBe("Simple Todo");
  });

  it("should throw error when title is empty", async () => {
    const input: CreateTodoInput = {
      title: "",
    };

    await expect(useCase.execute(input)).rejects.toThrow("Title is required");
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it("should throw error when title is only whitespace", async () => {
    const input: CreateTodoInput = {
      title: "   ",
    };

    await expect(useCase.execute(input)).rejects.toThrow("Title is required");
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it("should propagate repository errors", async () => {
    const input: CreateTodoInput = {
      title: "New Todo",
    };

    vi.mocked(mockRepository.create).mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(input)).rejects.toThrow("Database error");
  });
});
