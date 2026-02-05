import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "@domain/entities/Category";
import type { ICategoryRepository } from "@domain/repositories/ICategoryRepository";

interface CategoryRow {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

function mapRowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: new Date(row.created_at),
  };
}

export class SupabaseCategoryRepository implements ICategoryRepository {
  private readonly tableName = "categories";
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async create(category: Omit<Category, "id" | "createdAt">): Promise<Category> {
    const { data, error } = await this.client
      .from(this.tableName)
      .insert({
        name: category.name,
        color: category.color,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapRowToCategory(data as CategoryRow);
  }

  async findById(id: string): Promise<Category | null> {
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

    return mapRowToCategory(data as CategoryRow);
  }

  async findAll(): Promise<Category[]> {
    const { data, error } = await this.client.from(this.tableName).select();

    if (error) {
      throw new Error(error.message);
    }

    return (data as CategoryRow[]).map(mapRowToCategory);
  }

  async findByName(name: string): Promise<Category | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select()
      .eq("name", name)
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

    return mapRowToCategory(data as CategoryRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from(this.tableName).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
