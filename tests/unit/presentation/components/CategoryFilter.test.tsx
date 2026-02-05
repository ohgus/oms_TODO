import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "@presentation/components/category/CategoryFilter";
import type { Category } from "@domain/entities/Category";

const createMockCategory = (overrides: Partial<Category> = {}): Category => ({
  id: `cat-${Math.random()}`,
  name: "Test Category",
  color: "#6366f1",
  createdAt: new Date("2026-01-01"),
  ...overrides,
});

describe("CategoryFilter", () => {
  describe("Rendering", () => {
    it("should render 'All' option", () => {
      render(<CategoryFilter categories={[]} onSelect={vi.fn()} />);

      expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    });

    it("should render all category options", () => {
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
        createMockCategory({ id: "cat-2", name: "Personal" }),
        createMockCategory({ id: "cat-3", name: "Shopping" }),
      ];

      render(<CategoryFilter categories={categories} onSelect={vi.fn()} />);

      expect(screen.getByRole("button", { name: /work/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /personal/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /shopping/i })).toBeInTheDocument();
    });

    it("should render category with its color indicator", () => {
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work", color: "#ff0000" }),
      ];

      render(<CategoryFilter categories={categories} onSelect={vi.fn()} />);

      const workButton = screen.getByRole("button", { name: /work/i });
      expect(workButton.querySelector("[data-testid='category-color']")).toHaveStyle({
        backgroundColor: "#ff0000",
      });
    });

    it("should highlight selected category", () => {
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
        createMockCategory({ id: "cat-2", name: "Personal" }),
      ];

      render(
        <CategoryFilter
          categories={categories}
          selectedCategoryId="cat-1"
          onSelect={vi.fn()}
        />
      );

      const workButton = screen.getByRole("button", { name: /work/i });
      expect(workButton).toHaveAttribute("aria-pressed", "true");
    });

    it("should highlight 'All' when no category selected", () => {
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
      ];

      render(
        <CategoryFilter
          categories={categories}
          selectedCategoryId={undefined}
          onSelect={vi.fn()}
        />
      );

      const allButton = screen.getByRole("button", { name: /all/i });
      expect(allButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Interactions", () => {
    it("should call onSelect with category id when category is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
      ];

      render(<CategoryFilter categories={categories} onSelect={onSelect} />);

      await user.click(screen.getByRole("button", { name: /work/i }));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("cat-1");
    });

    it("should call onSelect with undefined when 'All' is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
      ];

      render(
        <CategoryFilter
          categories={categories}
          selectedCategoryId="cat-1"
          onSelect={onSelect}
        />
      );

      await user.click(screen.getByRole("button", { name: /all/i }));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(undefined);
    });
  });

  describe("Empty State", () => {
    it("should show only 'All' when no categories exist", () => {
      render(<CategoryFilter categories={[]} onSelect={vi.fn()} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible group role", () => {
      const categories = [createMockCategory({ id: "cat-1", name: "Work" })];

      render(<CategoryFilter categories={categories} onSelect={vi.fn()} />);

      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("should have aria-label for the filter group", () => {
      const categories = [createMockCategory({ id: "cat-1", name: "Work" })];

      render(<CategoryFilter categories={categories} onSelect={vi.fn()} />);

      expect(screen.getByRole("group")).toHaveAccessibleName(/category.*filter/i);
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
        createMockCategory({ id: "cat-2", name: "Personal" }),
      ];

      render(<CategoryFilter categories={categories} onSelect={onSelect} />);

      // Tab to first button and press Enter
      await user.tab();
      await user.keyboard("{Enter}");

      expect(onSelect).toHaveBeenCalled();
    });

    it("should have minimum touch target size (44x44px)", () => {
      const categories = [createMockCategory({ id: "cat-1", name: "Work" })];

      render(<CategoryFilter categories={categories} onSelect={vi.fn()} />);

      const button = screen.getByRole("button", { name: /work/i });
      expect(button).toHaveClass("min-h-11");
    });
  });

  describe("Mobile-first Layout", () => {
    it("should render as horizontal scrollable on mobile", () => {
      const categories = [
        createMockCategory({ id: "cat-1", name: "Work" }),
        createMockCategory({ id: "cat-2", name: "Personal" }),
        createMockCategory({ id: "cat-3", name: "Shopping" }),
      ];

      render(<CategoryFilter categories={categories} onSelect={vi.fn()} />);

      const container = screen.getByRole("group");
      expect(container).toHaveClass("overflow-x-auto");
    });
  });
});
