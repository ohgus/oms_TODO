import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriorityStars } from "@presentation/components/todo/PriorityStars";

describe("PriorityStars", () => {
  it("should render 3 star icons", () => {
    render(<PriorityStars level={2} />);

    const stars = screen.getAllByTestId(/^star-/);
    expect(stars).toHaveLength(3);
  });

  it("should fill 1 star and leave 2 empty for level=1", () => {
    render(<PriorityStars level={1} />);

    const filledStars = screen.getAllByTestId("star-filled");
    const emptyStars = screen.getAllByTestId("star-empty");

    expect(filledStars).toHaveLength(1);
    expect(emptyStars).toHaveLength(2);
  });

  it("should fill 2 stars and leave 1 empty for level=2", () => {
    render(<PriorityStars level={2} />);

    const filledStars = screen.getAllByTestId("star-filled");
    const emptyStars = screen.getAllByTestId("star-empty");

    expect(filledStars).toHaveLength(2);
    expect(emptyStars).toHaveLength(1);
  });

  it("should fill all 3 stars for level=3", () => {
    render(<PriorityStars level={3} />);

    const filledStars = screen.getAllByTestId("star-filled");

    expect(filledStars).toHaveLength(3);
    expect(screen.queryAllByTestId("star-empty")).toHaveLength(0);
  });

  it("should have accessible aria-label", () => {
    render(<PriorityStars level={2} />);

    const container = screen.getByLabelText("중요도 2단계");
    expect(container).toBeInTheDocument();
  });

  it("should render with correct aria-label for each level", () => {
    const { rerender } = render(<PriorityStars level={1} />);
    expect(screen.getByLabelText("중요도 1단계")).toBeInTheDocument();

    rerender(<PriorityStars level={3} />);
    expect(screen.getByLabelText("중요도 3단계")).toBeInTheDocument();
  });
});
