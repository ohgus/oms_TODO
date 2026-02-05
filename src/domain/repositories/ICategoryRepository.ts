import type { Category } from "@domain/entities/Category";

export interface ICategoryRepository {
  create(category: Omit<Category, "id" | "createdAt">): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findByName(name: string): Promise<Category | null>;
  delete(id: string): Promise<void>;
}
