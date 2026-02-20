import { useQuery } from "@tanstack/react-query";
import type { Todo } from "@domain/entities/Todo";
import type { ITodoRepository } from "@domain/repositories/ITodoRepository";
import { getMonthRange } from "@shared/utils/calendar";

interface UseTodosByMonthReturn {
  todos: Todo[];
  isLoading: boolean;
  isError: boolean;
}

export function useTodosByMonth(
  repository: ITodoRepository,
  month: Date
): UseTodosByMonthReturn {
  const year = month.getFullYear();
  const m = month.getMonth();
  const { from, to } = getMonthRange(month);

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", "month", year, m],
    queryFn: () => repository.findAll({ dueDateRange: { from, to } }),
  });

  return { todos, isLoading, isError };
}
