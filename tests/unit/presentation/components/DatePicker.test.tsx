import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DatePicker } from "@presentation/components/common/DatePicker";

describe("DatePicker", () => {
  describe("렌더링", () => {
    it("날짜 미선택 시 placeholder가 표시되어야 한다", () => {
      render(<DatePicker value={undefined} onChange={vi.fn()} />);

      expect(screen.getByText("날짜를 선택하세요")).toBeInTheDocument();
    });

    it("날짜 선택 시 한국어 포맷으로 표시되어야 한다", () => {
      const date = new Date(2026, 1, 19); // 2026-02-19 (목)
      render(<DatePicker value={date} onChange={vi.fn()} />);

      expect(screen.getByText("2월 19일 (목)")).toBeInTheDocument();
    });

    it("캘린더 아이콘이 표시되어야 한다", () => {
      render(<DatePicker value={undefined} onChange={vi.fn()} />);

      expect(screen.getByTestId("date-picker-calendar-icon")).toBeInTheDocument();
    });

    it("디자인 스타일이 적용되어야 한다", () => {
      render(<DatePicker value={undefined} onChange={vi.fn()} />);

      const container = screen.getByTestId("date-picker");
      expect(container.className).toContain("bg-bg-primary");
      expect(container.className).toContain("rounded-xl");
      expect(container.className).toContain("border");
    });

    it("wrapper가 div 요소여야 한다 (button 중첩 방지)", () => {
      render(<DatePicker value={undefined} onChange={vi.fn()} />);

      const container = screen.getByTestId("date-picker");
      expect(container.tagName).toBe("DIV");
    });

    it("투명 date input이 전체 영역을 덮어야 한다", () => {
      render(<DatePicker value={undefined} onChange={vi.fn()} />);

      const input = screen.getByTestId("date-picker-input");
      expect(input).toHaveAttribute("type", "date");
      expect(input.className).toContain("absolute");
      expect(input.className).toContain("inset-0");
      expect(input.className).toContain("opacity-0");
    });
  });

  describe("인터랙션", () => {
    it("날짜 변경 시 onChange가 호출되어야 한다", async () => {
      const onChange = vi.fn();
      render(<DatePicker value={undefined} onChange={onChange} />);

      const input = screen.getByTestId("date-picker-input");
      // Simulate native date input change
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
        input,
        "2026-02-20"
      );
      input.dispatchEvent(new Event("change", { bubbles: true }));

      expect(onChange).toHaveBeenCalledTimes(1);
      const calledDate = onChange.mock.calls[0][0] as Date;
      expect(calledDate.getFullYear()).toBe(2026);
      expect(calledDate.getMonth()).toBe(1); // February = 1
      expect(calledDate.getDate()).toBe(20);
    });

    it("날짜 초기화 버튼 클릭 시 onChange(undefined)가 호출되어야 한다", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const date = new Date(2026, 1, 19);
      render(<DatePicker value={date} onChange={onChange} />);

      const clearButton = screen.getByTestId("date-picker-clear");
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });
});
