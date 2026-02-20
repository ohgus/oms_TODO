import { describe, it, expect } from "vitest";
import {
  generateCalendarDays,
  getWeekRange,
  getMonthRange,
  toDateString,
} from "@shared/utils/calendar";

describe("toDateString", () => {
  it("Date를 'YYYY-MM-DD' 형식으로 변환해야 한다", () => {
    expect(toDateString(new Date(2026, 1, 15))).toBe("2026-02-15");
  });

  it("한 자리 월/일에 0을 패딩해야 한다", () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("12월 31일을 올바르게 변환해야 한다", () => {
    expect(toDateString(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});

describe("getMonthRange", () => {
  it("2026년 2월의 범위를 올바르게 반환해야 한다 (28일)", () => {
    const range = getMonthRange(new Date(2026, 1, 15));
    expect(range.from.getFullYear()).toBe(2026);
    expect(range.from.getMonth()).toBe(1);
    expect(range.from.getDate()).toBe(1);
    expect(range.to.getFullYear()).toBe(2026);
    expect(range.to.getMonth()).toBe(1);
    expect(range.to.getDate()).toBe(28);
  });

  it("2024년 2월의 범위를 올바르게 반환해야 한다 (윤년 29일)", () => {
    const range = getMonthRange(new Date(2024, 1, 10));
    expect(range.to.getDate()).toBe(29);
  });

  it("4월의 범위를 올바르게 반환해야 한다 (30일)", () => {
    const range = getMonthRange(new Date(2026, 3, 1));
    expect(range.to.getDate()).toBe(30);
  });

  it("12월의 범위를 올바르게 반환해야 한다 (31일)", () => {
    const range = getMonthRange(new Date(2026, 11, 25));
    expect(range.to.getDate()).toBe(31);
  });
});

describe("getWeekRange", () => {
  it("주어진 날짜의 일요일~토요일 범위를 반환해야 한다", () => {
    // 2026-02-18 (수요일)
    const range = getWeekRange(new Date(2026, 1, 18));
    expect(range.from.getDay()).toBe(0); // 일요일
    expect(range.to.getDay()).toBe(6); // 토요일
    expect(range.from.getDate()).toBe(15); // 2월 15일 일요일
    expect(range.to.getDate()).toBe(21); // 2월 21일 토요일
  });

  it("일요일을 입력하면 해당 주의 시작으로 반환해야 한다", () => {
    // 2026-02-15 (일요일)
    const range = getWeekRange(new Date(2026, 1, 15));
    expect(range.from.getDate()).toBe(15);
    expect(range.to.getDate()).toBe(21);
  });

  it("월 경계를 걸친 주를 처리해야 한다", () => {
    // 2026-03-01 (일요일)
    const range = getWeekRange(new Date(2026, 2, 3)); // 3월 3일 화요일
    expect(range.from.getMonth()).toBe(2); // 3월
    expect(range.from.getDate()).toBe(1); // 3월 1일 일요일
    expect(range.to.getMonth()).toBe(2);
    expect(range.to.getDate()).toBe(7);
  });
});

describe("generateCalendarDays", () => {
  it("7열의 2차원 배열을 반환해야 한다", () => {
    const days = generateCalendarDays(2026, 1, new Set());
    for (const week of days) {
      expect(week).toHaveLength(7);
    }
  });

  it("2026년 2월은 4~6주를 반환해야 한다", () => {
    const days = generateCalendarDays(2026, 1, new Set());
    expect(days.length).toBeGreaterThanOrEqual(4);
    expect(days.length).toBeLessThanOrEqual(6);
  });

  it("첫 주의 첫 날이 일요일이어야 한다", () => {
    const days = generateCalendarDays(2026, 1, new Set());
    expect(days[0][0].date.getDay()).toBe(0);
  });

  it("isCurrentMonth가 이전/다음 달 날짜에서 false여야 한다", () => {
    const days = generateCalendarDays(2026, 1, new Set()); // Feb 2026
    // 2026-02-01은 일요일 → 첫 주 첫째날이 2월 1일
    // 마지막 주에 3월 날짜가 있을 수 있음
    const lastWeek = days[days.length - 1];
    const lastDay = lastWeek[6]; // 토요일
    if (lastDay.date.getMonth() !== 1) {
      expect(lastDay.isCurrentMonth).toBe(false);
    }
  });

  it("isCurrentMonth가 현재 달 날짜에서 true여야 한다", () => {
    const days = generateCalendarDays(2026, 1, new Set());
    // 2월 15일 찾기
    const feb15 = days.flat().find(
      (d) => d.date.getMonth() === 1 && d.date.getDate() === 15
    );
    expect(feb15?.isCurrentMonth).toBe(true);
  });

  it("isToday가 오늘 날짜에만 true여야 한다", () => {
    const today = new Date();
    const days = generateCalendarDays(
      today.getFullYear(),
      today.getMonth(),
      new Set()
    );
    const todayCell = days.flat().find((d) => d.isToday);
    expect(todayCell).toBeDefined();
    expect(todayCell!.date.getDate()).toBe(today.getDate());
  });

  it("hasTodos가 todoDateSet에 포함된 날짜에서만 true여야 한다", () => {
    const todoDateSet = new Set(["2026-02-10", "2026-02-20"]);
    const days = generateCalendarDays(2026, 1, todoDateSet);
    const allDays = days.flat();

    const feb10 = allDays.find(
      (d) => d.date.getMonth() === 1 && d.date.getDate() === 10
    );
    const feb20 = allDays.find(
      (d) => d.date.getMonth() === 1 && d.date.getDate() === 20
    );
    const feb15 = allDays.find(
      (d) => d.date.getMonth() === 1 && d.date.getDate() === 15
    );

    expect(feb10?.hasTodos).toBe(true);
    expect(feb20?.hasTodos).toBe(true);
    expect(feb15?.hasTodos).toBe(false);
  });

  it("다양한 월(1월 31일, 4월 30일)에 대해 올바르게 생성해야 한다", () => {
    // 1월: 31일
    const jan = generateCalendarDays(2026, 0, new Set());
    const janDays = jan.flat().filter((d) => d.isCurrentMonth);
    expect(janDays).toHaveLength(31);

    // 4월: 30일
    const apr = generateCalendarDays(2026, 3, new Set());
    const aprDays = apr.flat().filter((d) => d.isCurrentMonth);
    expect(aprDays).toHaveLength(30);
  });
});
