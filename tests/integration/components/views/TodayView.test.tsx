import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodayView } from "@presentation/components/views/TodayView";
import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Buy groceries",
    completed: false,
    priority: 2,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "2",
    title: "Read book",
    completed: true,
    priority: 1,
    createdAt: new Date("2026-01-02"),
    updatedAt: new Date("2026-01-02"),
  },
];

const mockCategories: Category[] = [
  { id: "cat-1", name: "Personal", color: "#22c55e", createdAt: new Date() },
  { id: "cat-2", name: "Work", color: "#6366f1", createdAt: new Date() },
];

const defaultProps = {
  todos: mockTodos,
  categories: mockCategories,
  isLoading: false,
  statusFilter: "all" as const,
  categoryFilter: null as string | null,
  onStatusFilterChange: vi.fn(),
  onCategoryFilterChange: vi.fn(),
  onToggleComplete: vi.fn(),
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  emptyMessage: "No todos yet",
};

describe("TodayView", () => {
  it("StatusFilter를 렌더링해야 한다", () => {
    render(<TodayView {...defaultProps} />);

    expect(screen.getByTestId("status-filter")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /completed/i })).toBeInTheDocument();
  });

  it("CategoryFilter를 렌더링해야 한다", () => {
    render(<TodayView {...defaultProps} />);

    expect(screen.getByRole("button", { name: /personal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /work/i })).toBeInTheDocument();
  });

  it("TodoList를 렌더링해야 한다", () => {
    render(<TodayView {...defaultProps} />);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Read book")).toBeInTheDocument();
  });

  it("isLoading=true일 때 로딩 표시가 나타나야 한다", () => {
    render(<TodayView {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("todos가 비었을 때 emptyMessage를 표시해야 한다", () => {
    render(<TodayView {...defaultProps} todos={[]} />);

    expect(screen.getByText("No todos yet")).toBeInTheDocument();
  });

  it("카테고리가 없으면 CategoryFilter를 렌더링하지 않아야 한다", () => {
    render(<TodayView {...defaultProps} categories={[]} />);

    expect(screen.queryByRole("button", { name: /personal/i })).not.toBeInTheDocument();
  });
});
