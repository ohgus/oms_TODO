import type { Todo } from "@domain/entities/Todo";
import { updateTodo } from "@domain/entities/Todo";
import type { ITodoRepository } from "@domain/repositories/ITodoRepository";

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  categoryId?: string;
  completed?: boolean;
}

export class UpdateTodoUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(input: UpdateTodoInput): Promise<Todo> {
    const existingTodo = await this.todoRepository.findById(input.id);

    if (!existingTodo) {
      throw new Error("Todo not found");
    }

    // Validate and create updated todo
    const updatedTodo = updateTodo(existingTodo, {
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      completed: input.completed,
    });

    return this.todoRepository.update(updatedTodo);
  }
}
