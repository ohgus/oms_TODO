import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import type { Category } from "@domain/entities/Category";
import { Button } from "@presentation/components/ui/button";
import { Input } from "@presentation/components/ui/input";

export interface TodoFormData {
  title: string;
  categoryId?: string;
}

export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  categories?: Category[];
  isSubmitting?: boolean;
}

export function TodoForm({
  onSubmit,
  categories,
  isSubmitting = false,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    onSubmit({
      title: trimmedTitle,
      categoryId,
    });

    setTitle("");
    setCategoryId(undefined);
    setError(null);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (error && value.trim()) {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Add a new todo..."
            disabled={isSubmitting}
            aria-label="Todo title"
            aria-invalid={!!error}
            aria-describedby={error ? "title-error" : undefined}
            className="min-h-11"
            data-testid="todo-input"
          />
        </div>

        {categories && categories.length > 0 && (
          <select
            value={categoryId || ""}
            onChange={(e) => setCategoryId(e.target.value || undefined)}
            disabled={isSubmitting}
            className="h-11 px-3 rounded-md border border-input bg-background text-sm"
            aria-label="Category"
            data-testid="category-select"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 min-w-11"
          aria-label="Add todo"
          data-testid="add-button"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      {error && (
        <p id="title-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
