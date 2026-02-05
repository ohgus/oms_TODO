import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { TodoForm } from "./TodoForm";
import type { Category } from "@domain/entities/Category";

const meta = {
  title: "Components/Todo/TodoForm",
  component: TodoForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof TodoForm>;

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

export const Default: Story = {
  args: {},
};

export const WithCategories: Story = {
  args: {
    categories: mockCategories,
  },
};

export const Submitting: Story = {
  args: {
    categories: mockCategories,
    isSubmitting: true,
  },
};

export const WithManyCategories: Story = {
  args: {
    categories: [
      ...mockCategories,
      {
        id: "cat-4",
        name: "Health",
        color: "#f59e0b",
        createdAt: new Date("2026-01-01"),
      },
      {
        id: "cat-5",
        name: "Finance",
        color: "#8b5cf6",
        createdAt: new Date("2026-01-01"),
      },
      {
        id: "cat-6",
        name: "Learning",
        color: "#06b6d4",
        createdAt: new Date("2026-01-01"),
      },
    ],
  },
};
