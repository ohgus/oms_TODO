import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoEditModal } from "@presentation/components/todo/TodoEditModal";
import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";

const createMockCategory = (overrides: Partial<Category> = {}): Category => ({
  id: `cat-${Math.random()}`,
  name: "Test Category",
  color: "#6366f1",
  createdAt: new Date("2026-01-01"),
  ...overrides,
});

const defaultCategories = [
  createMockCategory({ id: "cat-1", name: "Work" }),
  createMockCategory({ id: "cat-2", name: "Personal" }),
];

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "todo-1",
  title: "Existing Todo",
  completed: false,
  priority: 2,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  ...overrides,
});

describe("TodoEditModal", () => {
  describe("Visibility", () => {
    it("todo=null 시 모달이 렌더링되지 않아야 한다", () => {
      render(
        <TodoEditModal
          todo={null}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.queryByText("TODO 수정")).not.toBeInTheDocument();
    });

    it("todo가 전달되면 모달이 열려야 한다", () => {
      const todo = createMockTodo();

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByText("TODO 수정")).toBeInTheDocument();
    });
  });

  describe("Pre-fill (프리필)", () => {
    it("기존 제목이 입력 필드에 프리필되어야 한다", () => {
      const todo = createMockTodo({ title: "Buy groceries" });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByPlaceholderText(/할 일/i)).toHaveValue("Buy groceries");
    });

    it("기존 카테고리가 선택되어야 한다", () => {
      const todo = createMockTodo({ categoryId: "cat-1" });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      // Work 카테고리 버튼이 선택 상태여야 함 (accent-primary 클래스)
      const workButton = screen.getByText("Work");
      expect(workButton).toHaveClass("bg-accent-primary");
    });

    it("기존 중요도가 선택되어야 한다", () => {
      const todo = createMockTodo({ priority: 3 });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByRole("button", { name: /높음/ })).toHaveAttribute("aria-pressed", "true");
    });

    it("기존 마감일이 프리필되어야 한다", () => {
      const todo = createMockTodo({ dueDate: new Date("2026-03-15") });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByLabelText(/마감일/i)).toHaveValue("2026-03-15");
    });

    it("마감일이 없으면 날짜 필드가 비어있어야 한다", () => {
      const todo = createMockTodo({ dueDate: undefined });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByLabelText(/마감일/i)).toHaveValue("");
    });
  });

  describe("UI 요소", () => {
    it("타이틀이 'TODO 수정'이어야 한다", () => {
      const todo = createMockTodo();

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByText("TODO 수정")).toBeInTheDocument();
    });

    it("버튼 텍스트가 '수정하기'여야 한다", () => {
      const todo = createMockTodo();

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByRole("button", { name: /수정하기/ })).toBeInTheDocument();
    });
  });

  describe("Submission", () => {
    it("수정 후 onSubmit(id, data)가 호출되어야 한다", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const todo = createMockTodo({ title: "Old Title", priority: 2 });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
          categories={defaultCategories}
        />
      );

      // Clear and type new title
      const input = screen.getByPlaceholderText(/할 일/i);
      await user.clear(input);
      await user.type(input, "Updated Title");

      await user.click(screen.getByRole("button", { name: /수정하기/ }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        "todo-1",
        expect.objectContaining({
          title: "Updated Title",
          priority: 2,
        })
      );
    });

    it("제목이 비어있으면 수정하기 버튼이 비활성화되어야 한다", async () => {
      const user = userEvent.setup();
      const todo = createMockTodo({ title: "Existing" });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      const input = screen.getByPlaceholderText(/할 일/i);
      await user.clear(input);

      expect(screen.getByRole("button", { name: /수정하기/ })).toBeDisabled();
    });

    it("중요도 변경 후 onSubmit에 반영되어야 한다", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const todo = createMockTodo({ priority: 1 });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
          categories={defaultCategories}
        />
      );

      // Change priority to high
      await user.click(screen.getByRole("button", { name: /높음/ }));
      await user.click(screen.getByRole("button", { name: /수정하기/ }));

      expect(onSubmit).toHaveBeenCalledWith(
        "todo-1",
        expect.objectContaining({
          priority: 3,
        })
      );
    });

    it("카테고리 변경 후 onSubmit에 반영되어야 한다", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const todo = createMockTodo({ categoryId: "cat-1" });

      render(
        <TodoEditModal
          todo={todo}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
          categories={defaultCategories}
        />
      );

      // Switch to Personal category
      await user.click(screen.getByText("Personal"));
      await user.click(screen.getByRole("button", { name: /수정하기/ }));

      expect(onSubmit).toHaveBeenCalledWith(
        "todo-1",
        expect.objectContaining({
          categoryId: "cat-2",
        })
      );
    });
  });
});
