import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "@presentation/components/todo/TodoForm";
import type { Category } from "@domain/entities/Category";

const createMockCategory = (overrides: Partial<Category> = {}): Category => ({
  id: `cat-${Math.random()}`,
  name: "Test Category",
  color: "#6366f1",
  createdAt: new Date("2026-01-01"),
  ...overrides,
});

describe("TodoForm", () => {
  describe("Rendering", () => {
    it("should render title input", () => {
      render(<TodoForm onSubmit={vi.fn()} />);

      expect(screen.getByPlaceholderText(/add.*todo/i)).toBeInTheDocument();
    });

    it("should render submit button", () => {
      render(<TodoForm onSubmit={vi.fn()} />);

      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    it("should render category select when categories provided", () => {
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
        createMockCategory({ id: "cat-2", name: "Personal" }),
      ];

      render(<TodoForm onSubmit={vi.fn()} categories={categories} />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should not render category select when no categories", () => {
      render(<TodoForm onSubmit={vi.fn()} />);

      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("should render category options", () => {
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
        createMockCategory({ id: "cat-2", name: "Personal" }),
      ];

      render(<TodoForm onSubmit={vi.fn()} categories={categories} />);

      expect(screen.getByRole("option", { name: /work/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /personal/i })).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit with title when form is submitted", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<TodoForm onSubmit={onSubmit} />);

      await user.type(screen.getByPlaceholderText(/add.*todo/i), "New Task");
      await user.click(screen.getByRole("button", { name: /add/i }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        title: "New Task",
        categoryId: undefined,
      });
    });

    it("should call onSubmit with category when selected", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
      ];

      render(<TodoForm onSubmit={onSubmit} categories={categories} />);

      await user.type(screen.getByPlaceholderText(/add.*todo/i), "Work Task");
      await user.selectOptions(screen.getByRole("combobox"), "cat-1");
      await user.click(screen.getByRole("button", { name: /add/i }));

      expect(onSubmit).toHaveBeenCalledWith({
        title: "Work Task",
        categoryId: "cat-1",
      });
    });

    it("should submit form on Enter key press", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByPlaceholderText(/add.*todo/i);
      await user.type(input, "Quick Task{enter}");

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Quick Task",
        categoryId: undefined,
      });
    });

    it("should clear input after successful submission", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByPlaceholderText(/add.*todo/i);
      await user.type(input, "New Task");
      await user.click(screen.getByRole("button", { name: /add/i }));

      expect(input).toHaveValue("");
    });
  });

  describe("Validation", () => {
    it("should not submit when title is empty", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<TodoForm onSubmit={onSubmit} />);

      await user.click(screen.getByRole("button", { name: /add/i }));

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should not submit when title is only whitespace", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<TodoForm onSubmit={onSubmit} />);

      await user.type(screen.getByPlaceholderText(/add.*todo/i), "   ");
      await user.click(screen.getByRole("button", { name: /add/i }));

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should show validation error for empty title", async () => {
      const user = userEvent.setup();

      render(<TodoForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole("button", { name: /add/i }));

      expect(screen.getByText(/title.*required/i)).toBeInTheDocument();
    });

    it("should clear validation error when user starts typing", async () => {
      const user = userEvent.setup();

      render(<TodoForm onSubmit={vi.fn()} />);

      await user.click(screen.getByRole("button", { name: /add/i }));
      expect(screen.getByText(/title.*required/i)).toBeInTheDocument();

      await user.type(screen.getByPlaceholderText(/add.*todo/i), "a");
      expect(screen.queryByText(/title.*required/i)).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should disable submit button when isSubmitting is true", () => {
      render(<TodoForm onSubmit={vi.fn()} isSubmitting={true} />);

      expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
    });

    it("should disable input when isSubmitting is true", () => {
      render(<TodoForm onSubmit={vi.fn()} isSubmitting={true} />);

      expect(screen.getByPlaceholderText(/add.*todo/i)).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible form label", () => {
      render(<TodoForm onSubmit={vi.fn()} />);

      const input = screen.getByPlaceholderText(/add.*todo/i);
      expect(input).toHaveAccessibleName();
    });

    it("should have minimum touch target size for submit button", () => {
      render(<TodoForm onSubmit={vi.fn()} />);

      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toHaveClass("min-h-11");
    });
  });
});
