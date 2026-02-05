import type { SupabaseClient } from "@supabase/supabase-js";
import type { Todo } from "@domain/entities/Todo";
import type { ITodoRepository, TodoFilter } from "@domain/repositories/ITodoRepository";

interface TodoRow {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

function mapRowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    categoryId: row.category_id ?? undefined,
    completed: row.completed,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function mapTodoToRow(
  todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
): Omit<TodoRow, "id" | "created_at" | "updated_at"> {
  return {
    title: todo.title,
    description: todo.description ?? null,
    category_id: todo.categoryId ?? null,
    completed: todo.completed,
  };
}

export class SupabaseTodoRepository implements ITodoRepository {
  private readonly tableName = "todos";
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async create(todo: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo> {
    const { data, error } = await this.client
      .from(this.tableName)
      .insert(mapTodoToRow(todo))
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRowToTodo(data as TodoRow);
  }

  async findById(id: string): Promise<Todo | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select()
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return mapRowToTodo(data as TodoRow);
  }

  async findAll(filter?: TodoFilter): Promise<Todo[]> {
    let query = this.client.from(this.tableName).select();

    if (filter?.completed !== undefined) {
      query = query.eq("completed", filter.completed);
    }

    if (filter?.categoryId !== undefined) {
      query = query.eq("category_id", filter.categoryId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return (data as TodoRow[]).map(mapRowToTodo);
  }

  async update(todo: Todo): Promise<Todo> {
    const { data, error } = await this.client
      .from(this.tableName)
      .update({
        title: todo.title,
        description: todo.description ?? null,
        category_id: todo.categoryId ?? null,
        completed: todo.completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", todo.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRowToTodo(data as TodoRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from(this.tableName).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
