import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "@domain/entities/Todo";
import { createTodo, updateTodo as updateTodoEntity } from "@domain/entities/Todo";
import type { ITodoRepository, TodoFilter } from "@domain/repositories/ITodoRepository";

const TODOS_QUERY_KEY = "todos";

interface UseTodosOptions {
  completed?: boolean;
  categoryId?: string;
}

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  addTodo: (input: CreateTodoInput) => Promise<Todo>;
  updateTodo: (input: { id: string } & UpdateTodoInput) => Promise<Todo>;
  toggleTodo: (id: string) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useTodos(repository: ITodoRepository, options?: UseTodosOptions): UseTodosReturn {
  const queryClient = useQueryClient();

  const filter: TodoFilter | undefined =
    options?.completed !== undefined || options?.categoryId !== undefined
      ? {
          completed: options?.completed,
          categoryId: options?.categoryId,
        }
      : undefined;

  const queryKey = [TODOS_QUERY_KEY, filter];

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => repository.findAll(filter),
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateTodoInput) => {
      // Validate input using entity function (will throw if invalid)
      const todoData = createTodo(input);

      return repository.create({
        title: todoData.title,
        description: todoData.description,
        categoryId: todoData.categoryId,
        completed: todoData.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (input: { id: string } & UpdateTodoInput) => {
      const existingTodo = await repository.findById(input.id);

      if (!existingTodo) {
        throw new Error("Todo not found");
      }

      const updatedTodo = updateTodoEntity(existingTodo, {
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        completed: input.completed,
      });

      return repository.update(updatedTodo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const existingTodo = await repository.findById(id);

      if (!existingTodo) {
        throw new Error("Todo not found");
      }

      const updatedTodo = updateTodoEntity(existingTodo, {
        completed: !existingTodo.completed,
      });

      return repository.update(updatedTodo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const existingTodo = await repository.findById(id);

      if (!existingTodo) {
        throw new Error("Todo not found");
      }

      return repository.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });

  return {
    todos,
    isLoading,
    isError,
    error: error as Error | null,
    addTodo: (input: CreateTodoInput) => createMutation.mutateAsync(input),
    updateTodo: (input: { id: string } & UpdateTodoInput) => updateMutation.mutateAsync(input),
    toggleTodo: (id: string) => toggleMutation.mutateAsync(id),
    deleteTodo: (id: string) => deleteMutation.mutateAsync(id),
    refetch: () => refetch(),
  };
}
