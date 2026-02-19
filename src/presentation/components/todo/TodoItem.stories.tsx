import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { TodoItem } from "./TodoItem";

const meta = {
  title: "Components/Todo/TodoItem",
  component: TodoItem,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onToggleComplete: fn(),
    onDelete: fn(),
    onEdit: fn(),
  },
  argTypes: {
    todo: {
      description: "The todo item data",
    },
    categoryName: {
      description: "Name of the category (if assigned)",
      control: "text",
    },
    categoryColor: {
      description: "Color of the category badge",
      control: "color",
    },
  },
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseTodo = {
  id: "1",
  title: "Buy groceries",
  completed: false,
  priority: 2 as const,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

export const Default: Story = {
  args: {
    todo: baseTodo,
  },
};

export const WithDescription: Story = {
  args: {
    todo: {
      ...baseTodo,
      id: "2",
      title: "Complete project report",
      description: "Include all quarterly metrics and team feedback",
    },
  },
};

export const Completed: Story = {
  args: {
    todo: {
      ...baseTodo,
      id: "3",
      title: "Send email to client",
      completed: true,
    },
  },
};

export const WithCategory: Story = {
  args: {
    todo: {
      ...baseTodo,
      id: "4",
      title: "Team meeting preparation",
      categoryId: "cat-1",
    },
    categoryName: "Work",
    categoryColor: "#ef4444",
  },
};

export const LongTitle: Story = {
  args: {
    todo: {
      ...baseTodo,
      id: "5",
      title:
        "This is a very long todo title that should be truncated when it exceeds the available space in the container",
      description:
        "And this is an equally long description that provides more context about what needs to be done",
    },
    categoryName: "Personal",
    categoryColor: "#22c55e",
  },
};

export const CompletedWithCategory: Story = {
  args: {
    todo: {
      ...baseTodo,
      id: "6",
      title: "Review pull request",
      description: "Check the code changes and provide feedback",
      completed: true,
      categoryId: "cat-2",
    },
    categoryName: "Development",
    categoryColor: "#3b82f6",
  },
};
