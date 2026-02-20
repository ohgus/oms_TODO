import { useState } from "react";
import type { Category } from "@domain/entities/Category";
import type { Priority } from "@domain/entities/Todo";
import { DEFAULT_PRIORITY } from "@domain/entities/Todo";
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

export interface TodoAddFormData {
  title: string;
  categoryId?: string;
  priority: Priority;
  dueDate?: Date;
}

export interface TodoAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TodoAddFormData) => void;
  categories: Category[];
}

export function TodoAddModal({
  open,
  onOpenChange,
  onSubmit,
  categories,
}: TodoAddModalProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY);
  const [dueDate, setDueDate] = useState("");

  const resetForm = () => {
    setTitle("");
    setCategoryId(undefined);
    setPriority(DEFAULT_PRIORITY);
    setDueDate("");
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      categoryId,
      priority,
      dueDate: dueDate ? new Date(dueDate + "T00:00:00") : undefined,
    });

    resetForm();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>TODO 추가</DrawerTitle>
          <DrawerDescription className="sr-only">
            새로운 할 일을 추가합니다
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
            data-testid="todo-title-input"
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
              htmlFor="todo-due-date"
              className="text-sm font-medium text-txt-secondary"
            >
              마감일
            </label>
            <Input
              id="todo-due-date"
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
            data-testid="todo-submit-button"
          >
            추가하기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
