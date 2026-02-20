import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  });

  describe("인터랙션", () => {
    it("날짜 변경 시 onChange가 호출되어야 한다", async () => {
      const onChange = vi.fn();
      render(<DatePicker value={undefined} onChange={onChange} />);

      const hiddenInput = screen.getByTestId("date-picker-hidden-input");
      await userEvent.clear(hiddenInput);
      // Simulate native date input change
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set?.call(hiddenInput, "2026-02-20");
      hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));

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
