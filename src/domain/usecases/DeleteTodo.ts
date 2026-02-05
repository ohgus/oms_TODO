import type { ITodoRepository } from "@domain/repositories/ITodoRepository";

export class DeleteTodoUseCase {
  private readonly todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(id: string): Promise<void> {
    const existingTodo = await this.todoRepository.findById(id);

    if (!existingTodo) {
      throw new Error("Todo not found");
    }

    await this.todoRepository.delete(id);
  }
}
