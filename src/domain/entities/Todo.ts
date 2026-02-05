export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  categoryId?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  categoryId?: string;
  completed?: boolean;
}

function generateId(): string {
  return crypto.randomUUID();
}

function validateTitle(title: string): void {
  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }
}

export function createTodo(input: CreateTodoInput): Todo {
  validateTitle(input.title);

  const now = new Date();
  return {
    id: generateId(),
    title: input.title.trim(),
    description: input.description,
    categoryId: input.categoryId,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function toggleTodoComplete(todo: Todo): Todo {
  return {
    ...todo,
    completed: !todo.completed,
    updatedAt: new Date(),
  };
}

export function updateTodo(todo: Todo, input: UpdateTodoInput): Todo {
  if (input.title !== undefined) {
    validateTitle(input.title);
  }

  return {
    ...todo,
    title: input.title !== undefined ? input.title.trim() : todo.title,
    description: input.description !== undefined ? input.description : todo.description,
    categoryId: input.categoryId !== undefined ? input.categoryId : todo.categoryId,
    completed: input.completed !== undefined ? input.completed : todo.completed,
    updatedAt: new Date(),
  };
}
