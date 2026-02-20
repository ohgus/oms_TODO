import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoAddModal } from "@presentation/components/todo/TodoAddModal";
import type { Category } from "@domain/entities/Category";

const createMockCategory = (overrides: Partial<Category> = {}): Category => ({
  id: `cat-${Math.random()}`,
  name: "Test Category",
  color: "#6366f1",
  createdAt: new Date("2026-01-01"),
  ...overrides,
});

const defaultCategories = [
  createMockCategory({ id: "cat-1", name: "Work", color: "#6366f1" }),
  createMockCategory({ id: "cat-2", name: "Personal", color: "#22C55E" }),
];

describe("TodoAddModal", () => {
  describe("Visibility", () => {
    it("should render modal content when open=true", () => {
      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByText("TODO 추가")).toBeInTheDocument();
    });

    it("should not render modal content when open=false", () => {
      render(
        <TodoAddModal
          open={false}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.queryByText("TODO 추가")).not.toBeInTheDocument();
    });
  });

  describe("Form fields", () => {
    it("should render title input", () => {
      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByPlaceholderText(/할 일/i)).toBeInTheDocument();
    });

    it("should render category options", () => {
      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Personal")).toBeInTheDocument();
    });

    it("should render PrioritySelector with default value 2", () => {
      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByRole("button", { name: /보통/ })).toHaveAttribute("aria-pressed", "true");
    });

    it("should render date picker", () => {
      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByTestId("date-picker")).toBeInTheDocument();
      expect(screen.getByText("날짜를 선택하세요")).toBeInTheDocument();
    });

    it("should render submit button '추가하기'", () => {
      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByRole("button", { name: /추가하기/ })).toBeInTheDocument();
    });
  });

  describe("Category color dot", () => {
    it("각 카테고리 버튼에 컬러 dot이 표시되어야 한다", () => {
      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      const dots = screen.getAllByTestId("category-dot");
      expect(dots).toHaveLength(2);
      expect(dots[0]).toHaveStyle({ backgroundColor: "#6366f1" });
      expect(dots[1]).toHaveStyle({ backgroundColor: "#22C55E" });
    });
  });

  describe("Submission", () => {
    it("should call onSubmit with form data when submitted", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
          categories={defaultCategories}
        />
      );

      await user.type(screen.getByPlaceholderText(/할 일/i), "New Todo");
      await user.click(screen.getByRole("button", { name: /추가하기/ }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Todo",
          priority: 2,
        })
      );
    });

    it("should disable submit button when title is empty", () => {
      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      expect(screen.getByRole("button", { name: /추가하기/ })).toBeDisabled();
    });

    it("should enable submit button when title has text", async () => {
      const user = userEvent.setup();

      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          categories={defaultCategories}
        />
      );

      await user.type(screen.getByPlaceholderText(/할 일/i), "Something");

      expect(screen.getByRole("button", { name: /추가하기/ })).toBeEnabled();
    });

    it("should submit with selected category", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
          categories={defaultCategories}
        />
      );

      await user.type(screen.getByPlaceholderText(/할 일/i), "Work Task");
      await user.click(screen.getByText("Work"));
      await user.click(screen.getByRole("button", { name: /추가하기/ }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Work Task",
          categoryId: "cat-1",
        })
      );
    });

    it("should submit with selected priority", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
          categories={defaultCategories}
        />
      );

      await user.type(screen.getByPlaceholderText(/할 일/i), "Important Task");
      await user.click(screen.getByRole("button", { name: /높음/ }));
      await user.click(screen.getByRole("button", { name: /추가하기/ }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Important Task",
          priority: 3,
        })
      );
    });

    it("should reset form after successful submission", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <TodoAddModal
          open={true}
          onOpenChange={vi.fn()}
          onSubmit={onSubmit}
          categories={defaultCategories}
        />
      );

      await user.type(screen.getByPlaceholderText(/할 일/i), "Temp Task");
      await user.click(screen.getByRole("button", { name: /높음/ }));
      await user.click(screen.getByRole("button", { name: /추가하기/ }));

      // After submit, form should reset
      expect(screen.getByPlaceholderText(/할 일/i)).toHaveValue("");
      expect(screen.getByRole("button", { name: /보통/ })).toHaveAttribute("aria-pressed", "true");
    });
  });
});
