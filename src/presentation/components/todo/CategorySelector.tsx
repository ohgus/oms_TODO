import type { Category } from "@domain/entities/Category";
import { cn } from "@shared/utils/cn";

interface CategorySelectorProps {
  categories: Category[];
  value: string | undefined;
  onChange: (categoryId: string | undefined) => void;
}

export function CategorySelector({ categories, value, onChange }: CategorySelectorProps) {
  if (categories.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-txt-secondary">카테고리</label>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(value === cat.id ? undefined : cat.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors",
              value === cat.id
                ? "bg-accent-primary text-white border-accent-primary"
                : "bg-bg-surface text-txt-secondary border-border-subtle"
            )}
          >
            <span
              data-testid="category-dot"
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: value === cat.id ? "#FFFFFF" : cat.color,
              }}
            />
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
