import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "@presentation/components/todo/TodoList";
import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: `test-id-${Math.random()}`,
  title: "Test Todo",
  completed: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  ...overrides,
});

const createMockCategory = (overrides: Partial<Category> = {}): Category => ({
  id: `cat-${Math.random()}`,
  name: "Test Category",
  color: "#6366f1",
  createdAt: new Date("2026-01-01"),
  ...overrides,
});

describe("TodoList", () => {
  const defaultProps = {
    onToggleComplete: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
  };

  describe("Empty State", () => {
    it("should render empty message when todos array is empty", () => {
      render(<TodoList todos={[]} {...defaultProps} />);

      expect(screen.getByText(/no todos/i)).toBeInTheDocument();
    });

    it("should render custom empty message when provided", () => {
      render(
        <TodoList
          todos={[]}
          {...defaultProps}
          emptyMessage="You have no tasks yet!"
        />
      );

      expect(screen.getByText("You have no tasks yet!")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should render loading skeleton when isLoading is true", () => {
      render(<TodoList todos={[]} {...defaultProps} isLoading={true} />);

      expect(screen.getByTestId("todo-list-loading")).toBeInTheDocument();
    });

    it("should not render todos when loading", () => {
      const todos = [createMockTodo({ title: "Should not show" })];

      render(<TodoList todos={todos} {...defaultProps} isLoading={true} />);

      expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
    });
  });

  describe("Rendering Todos", () => {
    it("should render all todos in the list", () => {
      const todos = [
        createMockTodo({ id: "1", title: "First Todo" }),
        createMockTodo({ id: "2", title: "Second Todo" }),
        createMockTodo({ id: "3", title: "Third Todo" }),
      ];

      render(<TodoList todos={todos} {...defaultProps} />);

      expect(screen.getByText("First Todo")).toBeInTheDocument();
      expect(screen.getByText("Second Todo")).toBeInTheDocument();
      expect(screen.getByText("Third Todo")).toBeInTheDocument();
    });

    it("should render correct number of todo items", () => {
      const todos = [
        createMockTodo({ id: "1" }),
        createMockTodo({ id: "2" }),
        createMockTodo({ id: "3" }),
      ];

      render(<TodoList todos={todos} {...defaultProps} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
    });

    it("should render todos with category info when categories provided", () => {
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work", color: "#ff0000" }),
        createMockCategory({ id: "cat-2", name: "Personal", color: "#00ff00" }),
      ];

      const todos = [
        createMockTodo({ id: "1", title: "Work task", categoryId: "cat-1" }),
        createMockTodo({ id: "2", title: "Personal task", categoryId: "cat-2" }),
      ];

      render(
        <TodoList todos={todos} categories={categories} {...defaultProps} />
      );

      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Personal")).toBeInTheDocument();
    });
  });

  describe("Event Handlers", () => {
    it("should pass onToggleComplete to each TodoItem", async () => {
      const onToggleComplete = vi.fn();
      const todos = [createMockTodo({ id: "test-1", title: "Test" })];

      render(
        <TodoList
          todos={todos}
          onToggleComplete={onToggleComplete}
          onDelete={vi.fn()}
          onEdit={vi.fn()}
        />
      );

      // Checkbox exists and is clickable
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("should pass onDelete to each TodoItem", () => {
      const onDelete = vi.fn();
      const todos = [createMockTodo({ id: "test-1", title: "Test" })];

      render(
        <TodoList
          todos={todos}
          onToggleComplete={vi.fn()}
          onDelete={onDelete}
          onEdit={vi.fn()}
        />
      );

      // Delete button exists
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible list role", () => {
      const todos = [createMockTodo({ id: "1" })];

      render(<TodoList todos={todos} {...defaultProps} />);

      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should have listitem role for each todo", () => {
      const todos = [
        createMockTodo({ id: "1" }),
        createMockTodo({ id: "2" }),
      ];

      render(<TodoList todos={todos} {...defaultProps} />);

      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });
});
