import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { StatusFilter } from "./StatusFilter";

const meta = {
  title: "Components/Todo/StatusFilter",
  component: StatusFilter,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onSelect: fn(),
  },
  argTypes: {
    selectedStatus: {
      description: "Currently selected status filter",
      control: "select",
      options: ["all", "active", "completed"],
    },
  },
} satisfies Meta<typeof StatusFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSelected: Story = {
  args: {
    selectedStatus: "all",
  },
};

export const ActiveSelected: Story = {
  args: {
    selectedStatus: "active",
  },
};

export const CompletedSelected: Story = {
  args: {
    selectedStatus: "completed",
  },
};
