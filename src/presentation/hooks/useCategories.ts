import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category, CreateCategoryInput } from "@domain/entities/Category";
import { createCategory } from "@domain/entities/Category";
import type { ICategoryRepository } from "@domain/repositories/ICategoryRepository";

const CATEGORIES_QUERY_KEY = "categories";

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  addCategory: (input: CreateCategoryInput) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  refetch: () => void;
}

export function useCategories(repository: ICategoryRepository): UseCategoriesReturn {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => repository.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      // Validate input using entity function (will throw if invalid)
      const categoryData = createCategory(input);

      // Check for duplicate name
      const existing = await repository.findByName(categoryData.name);
      if (existing) {
        throw new Error("Category already exists");
      }

      return repository.create({
        name: categoryData.name,
        color: categoryData.color,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const existingCategory = await repository.findById(id);

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      return repository.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find((category) => category.id === id);
  };

  return {
    categories,
    isLoading,
    isError,
    error: error as Error | null,
    addCategory: (input: CreateCategoryInput) => createMutation.mutateAsync(input),
    deleteCategory: (id: string) => deleteMutation.mutateAsync(id),
    getCategoryById,
    refetch: () => refetch(),
  };
}
