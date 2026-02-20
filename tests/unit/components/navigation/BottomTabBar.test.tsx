import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomTabBar } from "@presentation/components/navigation/BottomTabBar";

describe("BottomTabBar", () => {
  const defaultProps = {
    activeTab: "today" as const,
    onTabChange: vi.fn(),
  };

  it("2개 탭(오늘, 달력)을 렌더링해야 한다", () => {
    render(<BottomTabBar {...defaultProps} />);

    expect(screen.getByText("오늘")).toBeInTheDocument();
    expect(screen.getByText("달력")).toBeInTheDocument();
  });

  it("활성 탭에 aria-current='page' 속성이 있어야 한다", () => {
    render(<BottomTabBar {...defaultProps} activeTab="today" />);

    const todayTab = screen.getByText("오늘").closest("button");
    const calendarTab = screen.getByText("달력").closest("button");

    expect(todayTab).toHaveAttribute("aria-current", "page");
    expect(calendarTab).not.toHaveAttribute("aria-current", "page");
  });

  it("달력 탭이 활성일 때 올바른 aria-current 설정", () => {
    render(<BottomTabBar {...defaultProps} activeTab="calendar" />);

    const todayTab = screen.getByText("오늘").closest("button");
    const calendarTab = screen.getByText("달력").closest("button");

    expect(todayTab).not.toHaveAttribute("aria-current", "page");
    expect(calendarTab).toHaveAttribute("aria-current", "page");
  });

  it("탭 클릭 시 onTabChange가 호출되어야 한다", async () => {
    const onTabChange = vi.fn();
    const user = userEvent.setup();

    render(<BottomTabBar {...defaultProps} onTabChange={onTabChange} />);

    await user.click(screen.getByText("달력"));
    expect(onTabChange).toHaveBeenCalledWith("calendar");

    await user.click(screen.getByText("오늘"));
    expect(onTabChange).toHaveBeenCalledWith("today");
  });

  it("nav 역할을 가져야 한다", () => {
    render(<BottomTabBar {...defaultProps} />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
