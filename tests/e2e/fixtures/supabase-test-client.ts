/**
 * Supabase Test Client
 * Direct Supabase access for cleanup operations in E2E tests
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseTestClientConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export class SupabaseTestClient {
  private client: SupabaseClient;

  constructor(config: SupabaseTestClientConfig) {
    this.client = createClient(config.supabaseUrl, config.supabaseKey);
  }

  async deleteTodo(id: string): Promise<void> {
    const { error } = await this.client.from("todos").delete().eq("id", id);

    if (error) {
      console.warn(`Failed to delete todo ${id}:`, error.message);
    }
  }

  async deleteTodos(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    const { error } = await this.client.from("todos").delete().in("id", ids);

    if (error) {
      console.warn("Failed to delete todos:", error.message);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.client.from("categories").delete().eq("id", id);

    if (error) {
      console.warn(`Failed to delete category ${id}:`, error.message);
    }
  }

  async deleteCategories(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    const { error } = await this.client.from("categories").delete().in("id", ids);

    if (error) {
      console.warn("Failed to delete categories:", error.message);
    }
  }

  /**
   * Safety cleanup: Delete todos matching test pattern
   * Pattern: titles ending with 13-digit timestamp (e.g., "Test todo 1234567890123")
   */
  async cleanupTestTodos(titlePattern: RegExp = /\s+\d{13}$/): Promise<number> {
    const { data: todos, error: fetchError } = await this.client.from("todos").select("id, title");

    if (fetchError) {
      console.warn("Failed to fetch todos for cleanup:", fetchError.message);
      return 0;
    }

    const testTodos = (todos || []).filter((todo) => titlePattern.test(todo.title));

    if (testTodos.length === 0) return 0;

    const ids = testTodos.map((todo) => todo.id);
    const { error: deleteError } = await this.client.from("todos").delete().in("id", ids);

    if (deleteError) {
      console.warn("Failed to cleanup test todos:", deleteError.message);
      return 0;
    }

    return testTodos.length;
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}

export function createSupabaseTestClient(): SupabaseTestClient {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
    );
  }

  return new SupabaseTestClient({ supabaseUrl, supabaseKey });
}
