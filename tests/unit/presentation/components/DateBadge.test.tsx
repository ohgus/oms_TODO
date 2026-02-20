import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DateBadge } from "@presentation/components/common/DateBadge";

describe("DateBadge", () => {
  it("should render date in Korean short format", () => {
    const date = new Date("2026-02-19T00:00:00");

    render(<DateBadge date={date} />);

    expect(screen.getByText("2월 19일")).toBeInTheDocument();
  });

  it("should render Calendar icon", () => {
    const date = new Date("2026-03-01T00:00:00");

    render(<DateBadge date={date} />);

    const icon = screen.getByTestId("calendar-icon");
    expect(icon).toBeInTheDocument();
  });

  it("should merge additional className", () => {
    const date = new Date("2026-02-19T00:00:00");

    const { container } = render(
      <DateBadge date={date} className="custom-class" />
    );

    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("custom-class");
  });

  it("should render different dates correctly", () => {
    const date = new Date("2026-12-25T00:00:00");

    render(<DateBadge date={date} />);

    expect(screen.getByText("12월 25일")).toBeInTheDocument();
  });
});
