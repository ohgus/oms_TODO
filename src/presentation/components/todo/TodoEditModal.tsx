import { useState } from "react";
import type { Todo, Priority } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";
import type { UpdateTodoInput } from "@domain/entities/Todo";
import { PrioritySelector } from "@presentation/components/todo/PrioritySelector";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@presentation/components/ui/drawer";
import { Input } from "@presentation/components/ui/input";
import { Button } from "@presentation/components/ui/button";
import { cn } from "@shared/utils/cn";

function formatDateToInput(date?: Date): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface TodoEditModalProps {
  todo: Todo | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: UpdateTodoInput) => void;
  categories: Category[];
}

export function TodoEditModal({
  todo,
  onOpenChange,
  onSubmit,
  categories,
}: TodoEditModalProps) {
  return (
    <Drawer open={todo !== null} onOpenChange={onOpenChange}>
      <DrawerContent>
        {todo && (
          <TodoEditForm
            key={todo.id}
            todo={todo}
            onSubmit={onSubmit}
            categories={categories}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}

interface TodoEditFormProps {
  todo: Todo;
  onSubmit: (id: string, data: UpdateTodoInput) => void;
  categories: Category[];
}

function TodoEditForm({ todo, onSubmit, categories }: TodoEditFormProps) {
  const [title, setTitle] = useState(todo.title);
  const [categoryId, setCategoryId] = useState<string | undefined>(todo.categoryId);
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [dueDate, setDueDate] = useState(formatDateToInput(todo.dueDate));

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit(todo.id, {
      title: title.trim(),
      categoryId,
      priority,
      dueDate: dueDate ? new Date(dueDate + "T00:00:00") : null,
    });
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>TODO 수정</DrawerTitle>
        <DrawerDescription className="sr-only">
          할 일을 수정합니다
        </DrawerDescription>
      </DrawerHeader>

      <div className="px-4 space-y-4">
        {/* Title */}
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요"
          aria-label="할 일"
        />

        {/* Category */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-txt-secondary">
              카테고리
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setCategoryId(categoryId === cat.id ? undefined : cat.id)
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-colors",
                    categoryId === cat.id
                      ? "bg-accent-primary text-white border-accent-primary"
                      : "bg-bg-surface text-txt-secondary border-border-subtle"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-txt-secondary">
            중요도
          </label>
          <PrioritySelector value={priority} onChange={setPriority} />
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label
            htmlFor="todo-edit-due-date"
            className="text-sm font-medium text-txt-secondary"
          >
            마감일
          </label>
          <Input
            id="todo-edit-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <DrawerFooter>
        <Button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-full bg-accent-primary text-white hover:bg-accent-primary/90"
        >
          수정하기
        </Button>
      </DrawerFooter>
    </>
  );
}
