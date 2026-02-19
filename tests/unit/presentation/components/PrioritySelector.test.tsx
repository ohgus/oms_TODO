import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrioritySelector } from "@presentation/components/todo/PrioritySelector";

describe("PrioritySelector", () => {
  describe("Rendering", () => {
    it("should render 3 priority buttons", () => {
      render(<PrioritySelector value={2} onChange={vi.fn()} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });

    it("should render labels: 낮음, 보통, 높음", () => {
      render(<PrioritySelector value={2} onChange={vi.fn()} />);

      expect(screen.getByText("낮음")).toBeInTheDocument();
      expect(screen.getByText("보통")).toBeInTheDocument();
      expect(screen.getByText("높음")).toBeInTheDocument();
    });

    it("should show 1 filled star for 낮음 button", () => {
      render(<PrioritySelector value={1} onChange={vi.fn()} />);

      const lowButton = screen.getByRole("button", { name: /낮음/ });
      const stars = lowButton.querySelectorAll("svg");
      const filledStars = lowButton.querySelectorAll("[data-filled='true']");
      expect(stars.length).toBe(1);
      expect(filledStars.length).toBe(1);
    });

    it("should show 2 filled stars for 보통 button", () => {
      render(<PrioritySelector value={2} onChange={vi.fn()} />);

      const mediumButton = screen.getByRole("button", { name: /보통/ });
      const stars = mediumButton.querySelectorAll("svg");
      const filledStars = mediumButton.querySelectorAll("[data-filled='true']");
      expect(stars.length).toBe(2);
      expect(filledStars.length).toBe(2);
    });

    it("should show 3 filled stars for 높음 button", () => {
      render(<PrioritySelector value={3} onChange={vi.fn()} />);

      const highButton = screen.getByRole("button", { name: /높음/ });
      const stars = highButton.querySelectorAll("svg");
      const filledStars = highButton.querySelectorAll("[data-filled='true']");
      expect(stars.length).toBe(3);
      expect(filledStars.length).toBe(3);
    });
  });

  describe("Selection state", () => {
    it("should mark selected button with aria-pressed=true", () => {
      render(<PrioritySelector value={2} onChange={vi.fn()} />);

      expect(screen.getByRole("button", { name: /보통/ })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: /낮음/ })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByRole("button", { name: /높음/ })).toHaveAttribute("aria-pressed", "false");
    });

    it("should mark value=1 button as selected", () => {
      render(<PrioritySelector value={1} onChange={vi.fn()} />);

      expect(screen.getByRole("button", { name: /낮음/ })).toHaveAttribute("aria-pressed", "true");
    });

    it("should mark value=3 button as selected", () => {
      render(<PrioritySelector value={3} onChange={vi.fn()} />);

      expect(screen.getByRole("button", { name: /높음/ })).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Interaction", () => {
    it("should call onChange with 1 when 낮음 clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<PrioritySelector value={2} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: /낮음/ }));
      expect(onChange).toHaveBeenCalledWith(1);
    });

    it("should call onChange with 2 when 보통 clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<PrioritySelector value={1} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: /보통/ }));
      expect(onChange).toHaveBeenCalledWith(2);
    });

    it("should call onChange with 3 when 높음 clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<PrioritySelector value={1} onChange={onChange} />);

      await user.click(screen.getByRole("button", { name: /높음/ }));
      expect(onChange).toHaveBeenCalledWith(3);
    });
  });
});
