import type { Todo } from "@domain/entities/Todo";
import { createTodo } from "@domain/entities/Todo";
import type { ITodoRepository } from "@domain/repositories/ITodoRepository";

export interface CreateTodoInput {
  title: string;
  description?: string;
  categoryId?: string;
}

export class CreateTodoUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(input: CreateTodoInput): Promise<Todo> {
    // Validate input - createTodo will throw if title is invalid
    const todo = createTodo(input);

    // Persist and return
    return this.todoRepository.create({
      title: todo.title,
      description: todo.description,
      categoryId: todo.categoryId,
      completed: todo.completed,
      priority: todo.priority,
      dueDate: todo.dueDate,
    });
  }
}
