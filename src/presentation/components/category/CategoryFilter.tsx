import type { Category } from "@domain/entities/Category";
import { Button } from "@presentation/components/ui/button";

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (categoryId: string | undefined) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryFilterProps) {
  const isAllSelected = selectedCategoryId === undefined;

  return (
    <div
      role="group"
      aria-label="Category filter"
      className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-thin"
      data-testid="category-filter"
    >
      <Button
        variant={isAllSelected ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(undefined)}
        aria-pressed={isAllSelected}
        className="min-h-11 shrink-0 transition-colors"
        data-testid="category-all"
      >
        All
      </Button>

      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(category.id)}
            aria-pressed={isSelected}
            className="min-h-11 shrink-0 gap-2 transition-colors"
            data-testid={`category-${category.id}`}
          >
            <span
              data-testid="category-color"
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: category.color }}
              aria-hidden="true"
            />
            {category.name}
          </Button>
        );
      })}
    </div>
  );
}
