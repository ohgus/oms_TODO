import type { ITodoRepository } from "@domain/repositories/ITodoRepository";
import type { ICategoryRepository } from "@domain/repositories/ICategoryRepository";
import { SupabaseTodoRepository } from "@data/repositories/SupabaseTodoRepository";
import { SupabaseCategoryRepository } from "@data/repositories/SupabaseCategoryRepository";
import { GetTodosUseCase } from "@domain/usecases/GetTodos";
import { CreateTodoUseCase } from "@domain/usecases/CreateTodo";
import { UpdateTodoUseCase } from "@domain/usecases/UpdateTodo";
import { DeleteTodoUseCase } from "@domain/usecases/DeleteTodo";
import { supabase } from "@infrastructure/supabase/client";

export class DIContainer {
  private readonly _todoRepository: ITodoRepository;
  private readonly _categoryRepository: ICategoryRepository;

  constructor(todoRepository?: ITodoRepository, categoryRepository?: ICategoryRepository) {
    this._todoRepository = todoRepository ?? new SupabaseTodoRepository(supabase);
    this._categoryRepository = categoryRepository ?? new SupabaseCategoryRepository(supabase);
  }

  get todoRepository(): ITodoRepository {
    return this._todoRepository;
  }

  get categoryRepository(): ICategoryRepository {
    return this._categoryRepository;
  }

  // Use Cases
  get getTodosUseCase(): GetTodosUseCase {
    return new GetTodosUseCase(this._todoRepository);
  }

  get createTodoUseCase(): CreateTodoUseCase {
    return new CreateTodoUseCase(this._todoRepository);
  }

  get updateTodoUseCase(): UpdateTodoUseCase {
    return new UpdateTodoUseCase(this._todoRepository);
  }

  get deleteTodoUseCase(): DeleteTodoUseCase {
    return new DeleteTodoUseCase(this._todoRepository);
  }
}

// Default singleton instance
let defaultContainer: DIContainer | null = null;

export function getContainer(): DIContainer {
  if (!defaultContainer) {
    defaultContainer = new DIContainer();
  }
  return defaultContainer;
}

export function setContainer(container: DIContainer): void {
  defaultContainer = container;
}
