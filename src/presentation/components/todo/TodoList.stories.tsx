import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { TodoList } from "./TodoList";
import type { Todo } from "@domain/entities/Todo";
import type { Category } from "@domain/entities/Category";

const meta = {
  title: "Components/Todo/TodoList",
  component: TodoList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onToggleComplete: fn(),
    onDelete: fn(),
    onEdit: fn(),
  },
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Work",
    color: "#ef4444",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "cat-2",
    name: "Personal",
    color: "#22c55e",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "cat-3",
    name: "Shopping",
    color: "#3b82f6",
    createdAt: new Date("2026-01-01"),
  },
];

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write API docs and update README",
    completed: false,
    categoryId: "cat-1",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "2",
    title: "Buy groceries",
    completed: true,
    categoryId: "cat-3",
    createdAt: new Date("2026-01-02"),
    updatedAt: new Date("2026-01-02"),
  },
  {
    id: "3",
    title: "Call dentist",
    description: "Schedule annual checkup",
    completed: false,
    categoryId: "cat-2",
    createdAt: new Date("2026-01-03"),
    updatedAt: new Date("2026-01-03"),
  },
  {
    id: "4",
    title: "Review pull requests",
    completed: false,
    categoryId: "cat-1",
    createdAt: new Date("2026-01-04"),
    updatedAt: new Date("2026-01-04"),
  },
  {
    id: "5",
    title: "Exercise",
    completed: true,
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
];

export const WithItems: Story = {
  args: {
    todos: mockTodos,
    categories: mockCategories,
  },
};

export const Empty: Story = {
  args: {
    todos: [],
  },
};

export const EmptyWithCustomMessage: Story = {
  args: {
    todos: [],
    emptyMessage: "You have no tasks. Start by adding one!",
  },
};

export const Loading: Story = {
  args: {
    todos: [],
    isLoading: true,
  },
};

export const WithoutCategories: Story = {
  args: {
    todos: mockTodos.map((todo) => ({ ...todo, categoryId: undefined })),
  },
};

export const AllCompleted: Story = {
  args: {
    todos: mockTodos.map((todo) => ({ ...todo, completed: true })),
    categories: mockCategories,
  },
};

export const SingleItem: Story = {
  args: {
    todos: [mockTodos[0]],
    categories: mockCategories,
  },
};
