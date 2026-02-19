import type { Todo } from "@domain/entities/Todo";

export interface TodoFilter {
  completed?: boolean;
  categoryId?: string;
  dueDate?: Date;
  dueDateRange?: { from: Date; to: Date };
}

export interface ITodoRepository {
  create(todo: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo>;
  findById(id: string): Promise<Todo | null>;
  findAll(filter?: TodoFilter): Promise<Todo[]>;
  update(todo: Todo): Promise<Todo>;
  delete(id: string): Promise<void>;
}
