import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { CategoryFilter } from "./CategoryFilter";
import type { Category } from "@domain/entities/Category";

const meta = {
  title: "Components/Category/CategoryFilter",
  component: CategoryFilter,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof CategoryFilter>;

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
  args: {
    categories: mockCategories,
    selectedCategoryId: undefined,
  },
};

export const WithSelected: Story = {
  args: {
    categories: mockCategories,
    selectedCategoryId: "cat-1",
  },
};

export const Empty: Story = {
  args: {
    categories: [],
    selectedCategoryId: undefined,
  },
};

export const ManyCategories: Story = {
  args: {
    categories: [
      ...mockCategories,
      {
        id: "cat-4",
        name: "Health & Fitness",
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
        name: "Learning & Development",
        color: "#06b6d4",
        createdAt: new Date("2026-01-01"),
      },
      {
        id: "cat-7",
        name: "Home",
        color: "#ec4899",
        createdAt: new Date("2026-01-01"),
      },
    ],
    selectedCategoryId: undefined,
  },
};

export const SingleCategory: Story = {
  args: {
    categories: [mockCategories[0]],
    selectedCategoryId: undefined,
  },
};
