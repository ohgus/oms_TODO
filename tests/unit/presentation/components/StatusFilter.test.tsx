import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusFilter } from "@presentation/components/todo/StatusFilter";

describe("StatusFilter", () => {
  describe("Rendering", () => {
    it("should render all status options: All, Active, Completed", () => {
      render(<StatusFilter selectedStatus="all" onSelect={vi.fn()} />);

      expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /completed/i })).toBeInTheDocument();
    });

    it("should highlight selected status", () => {
      render(<StatusFilter selectedStatus="active" onSelect={vi.fn()} />);

      const activeButton = screen.getByRole("button", { name: /active/i });
      expect(activeButton).toHaveAttribute("aria-pressed", "true");
    });

    it("should not highlight unselected statuses", () => {
      render(<StatusFilter selectedStatus="active" onSelect={vi.fn()} />);

      const allButton = screen.getByRole("button", { name: /all/i });
      const completedButton = screen.getByRole("button", { name: /completed/i });

      expect(allButton).toHaveAttribute("aria-pressed", "false");
      expect(completedButton).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Interactions", () => {
    it("should call onSelect with 'all' when All button is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<StatusFilter selectedStatus="active" onSelect={onSelect} />);

      await user.click(screen.getByRole("button", { name: /all/i }));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("all");
    });

    it("should call onSelect with 'active' when Active button is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<StatusFilter selectedStatus="all" onSelect={onSelect} />);

      await user.click(screen.getByRole("button", { name: /active/i }));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("active");
    });

    it("should call onSelect with 'completed' when Completed button is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<StatusFilter selectedStatus="all" onSelect={onSelect} />);

      await user.click(screen.getByRole("button", { name: /completed/i }));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith("completed");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible group role", () => {
      render(<StatusFilter selectedStatus="all" onSelect={vi.fn()} />);

      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("should have aria-label for the filter group", () => {
      render(<StatusFilter selectedStatus="all" onSelect={vi.fn()} />);

      expect(screen.getByRole("group")).toHaveAccessibleName(/status.*filter/i);
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<StatusFilter selectedStatus="all" onSelect={onSelect} />);

      await user.tab();
      await user.keyboard("{Enter}");

      expect(onSelect).toHaveBeenCalled();
    });

    it("should have minimum touch target size (44x44px)", () => {
      render(<StatusFilter selectedStatus="all" onSelect={vi.fn()} />);

      const button = screen.getByRole("button", { name: /all/i });
      expect(button).toHaveClass("min-h-11");
    });
  });

  describe("Mobile-first Layout", () => {
    it("should render as horizontal layout", () => {
      render(<StatusFilter selectedStatus="all" onSelect={vi.fn()} />);

      const container = screen.getByRole("group");
      expect(container).toHaveClass("flex");
    });
  });
});
