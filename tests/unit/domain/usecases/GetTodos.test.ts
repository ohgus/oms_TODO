import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetTodosUseCase, GetTodosFilter } from "@domain/usecases/GetTodos";
import { ITodoRepository } from "@domain/repositories/ITodoRepository";
import { Todo } from "@domain/entities/Todo";

describe("GetTodos Use Case", () => {
  let mockRepository: ITodoRepository;
  let useCase: GetTodosUseCase;
  let todos: Todo[];

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new GetTodosUseCase(mockRepository);

    todos = [
      {
        id: "todo-1",
        title: "Work Task",
        categoryId: "category-work",
        completed: false,
        priority: 2,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "todo-2",
        title: "Personal Task",
        categoryId: "category-personal",
        completed: true,
        priority: 2,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
      {
        id: "todo-3",
        title: "Another Work Task",
        categoryId: "category-work",
        completed: true,
        priority: 2,
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
      },
    ];
  });

  it("should return all todos when no filter is provided", async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue(todos);

    const result = await useCase.execute();

    expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toHaveLength(3);
  });

  it("should filter todos by completed status (completed)", async () => {
    const filter: GetTodosFilter = { completed: true };
    const completedTodos = todos.filter((t) => t.completed);

    vi.mocked(mockRepository.findAll).mockResolvedValue(completedTodos);

    const result = await useCase.execute(filter);

    expect(mockRepository.findAll).toHaveBeenCalledWith(filter);
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.completed)).toBe(true);
  });

  it("should filter todos by completed status (incomplete)", async () => {
    const filter: GetTodosFilter = { completed: false };
    const incompleteTodos = todos.filter((t) => !t.completed);

    vi.mocked(mockRepository.findAll).mockResolvedValue(incompleteTodos);

    const result = await useCase.execute(filter);

    expect(mockRepository.findAll).toHaveBeenCalledWith(filter);
    expect(result).toHaveLength(1);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  it("should filter todos by category", async () => {
    const filter: GetTodosFilter = { categoryId: "category-work" };
    const workTodos = todos.filter((t) => t.categoryId === "category-work");

    vi.mocked(mockRepository.findAll).mockResolvedValue(workTodos);

    const result = await useCase.execute(filter);

    expect(mockRepository.findAll).toHaveBeenCalledWith(filter);
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.categoryId === "category-work")).toBe(true);
  });

  it("should filter todos by both category and completed status", async () => {
    const filter: GetTodosFilter = { categoryId: "category-work", completed: true };
    const filteredTodos = todos.filter(
      (t) => t.categoryId === "category-work" && t.completed
    );

    vi.mocked(mockRepository.findAll).mockResolvedValue(filteredTodos);

    const result = await useCase.execute(filter);

    expect(mockRepository.findAll).toHaveBeenCalledWith(filter);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("todo-3");
  });

  it("should return empty array when no todos match filter", async () => {
    const filter: GetTodosFilter = { categoryId: "non-existent" };

    vi.mocked(mockRepository.findAll).mockResolvedValue([]);

    const result = await useCase.execute(filter);

    expect(result).toHaveLength(0);
  });

  it("should propagate repository errors", async () => {
    vi.mocked(mockRepository.findAll).mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute()).rejects.toThrow("Database error");
  });
});
