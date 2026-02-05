import type { Todo } from "@domain/entities/Todo";
import type { ITodoRepository } from "@domain/repositories/ITodoRepository";

export interface GetTodosFilter {
  completed?: boolean;
  categoryId?: string;
}

export class GetTodosUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(filter?: GetTodosFilter): Promise<Todo[]> {
    return this.todoRepository.findAll(filter);
  }
}
