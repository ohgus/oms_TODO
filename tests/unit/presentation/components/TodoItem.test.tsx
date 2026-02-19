import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "@presentation/components/todo/TodoItem";
import type { Todo } from "@domain/entities/Todo";

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "test-id-1",
  title: "Test Todo",
  completed: false,
  priority: 2,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  ...overrides,
});

describe("TodoItem", () => {
  describe("Rendering", () => {
    it("should render todo title", () => {
      const todo = createMockTodo({ title: "Buy groceries" });

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    });

    it("should render todo description when provided", () => {
      const todo = createMockTodo({
        title: "Test",
        description: "This is a description",
      });

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      expect(screen.getByText("This is a description")).toBeInTheDocument();
    });

    it("should render checkbox as unchecked for incomplete todo", () => {
      const todo = createMockTodo({ completed: false });

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("should render checkbox as checked for completed todo", () => {
      const todo = createMockTodo({ completed: true });

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("should render with completed style when todo is completed", () => {
      const todo = createMockTodo({ completed: true, title: "Completed task" });

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      const title = screen.getByText("Completed task");
      expect(title).toHaveClass("line-through");
    });

    it("should render category badge when categoryId and categoryName provided", () => {
      const todo = createMockTodo({ categoryId: "cat-1" });

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
          categoryName="Work"
          categoryColor="#ff0000"
        />
      );

      expect(screen.getByText("Work")).toBeInTheDocument();
    });

    it("should render delete button", () => {
      const todo = createMockTodo();

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("should render edit button", () => {
      const todo = createMockTodo();

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onToggleComplete when checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onToggleComplete = vi.fn();
      const todo = createMockTodo();

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      await user.click(screen.getByRole("checkbox"));

      expect(onToggleComplete).toHaveBeenCalledTimes(1);
      expect(onToggleComplete).toHaveBeenCalledWith(todo.id);
    });

    it("should call onDelete when delete button is clicked", async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const todo = createMockTodo();

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={onDelete}
          onEdit={vi.fn()}
        />
      );

      await user.click(screen.getByRole("button", { name: /delete/i }));

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(todo.id);
    });

    it("should call onEdit when edit button is clicked", async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      const todo = createMockTodo();

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={onEdit}
        />
      );

      await user.click(screen.getByRole("button", { name: /edit/i }));

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith(todo);
    });
  });

  describe("Accessibility", () => {
    it("should have accessible checkbox label", () => {
      const todo = createMockTodo({ title: "Buy groceries" });

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAccessibleName();
    });

    it("should have minimum touch target size (44x44px)", () => {
      const todo = createMockTodo();

      render(
        <TodoItem
          todo={todo}
          onToggleComplete={vi.fn()}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      const deleteButton = screen.getByRole("button", { name: /delete/i });

      // Buttons should have min-h-11 min-w-11 (44px) classes for touch targets
      expect(checkbox.closest("[data-testid='checkbox-wrapper']")).toBeTruthy();
      expect(deleteButton).toHaveClass("min-h-11");
    });
  });
});
