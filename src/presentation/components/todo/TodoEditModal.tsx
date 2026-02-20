import { useState } from "react";
import type { Todo, Priority } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";
import type { UpdateTodoInput } from "@domain/entities/Todo";
import { PrioritySelector } from "@presentation/components/todo/PrioritySelector";
import { CategorySelector } from "@presentation/components/todo/CategorySelector";
import { DatePicker } from "@presentation/components/common/DatePicker";
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
  const [dueDate, setDueDate] = useState<Date | undefined>(todo.dueDate ?? undefined);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit(todo.id, {
      title: title.trim(),
      categoryId,
      priority,
      dueDate: dueDate ?? null,
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
        <CategorySelector
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
        />

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-txt-secondary">
            중요도
          </label>
          <PrioritySelector value={priority} onChange={setPriority} />
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-txt-secondary">
            마감일
          </label>
          <DatePicker value={dueDate} onChange={setDueDate} />
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
