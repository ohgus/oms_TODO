import { describe, it, expect } from "vitest";
import {
  formatKoreanDate,
  formatKoreanDateShort,
  formatKoreanMonth,
  isSameDay,
} from "@shared/utils/date";

describe("date utilities", () => {
  describe("formatKoreanDate", () => {
    it("should format date as 'M월 D일 (요일)'", () => {
      // 2026-02-19 is Thursday
      const date = new Date(2026, 1, 19);
      expect(formatKoreanDate(date)).toBe("2월 19일 (목)");
    });

    it("should handle single-digit month and day", () => {
      // 2026-01-05 is Monday
      const date = new Date(2026, 0, 5);
      expect(formatKoreanDate(date)).toBe("1월 5일 (월)");
    });

    it("should handle Dec 31", () => {
      // 2025-12-31 is Wednesday
      const date = new Date(2025, 11, 31);
      expect(formatKoreanDate(date)).toBe("12월 31일 (수)");
    });

    it("should handle Jan 1", () => {
      // 2026-01-01 is Thursday
      const date = new Date(2026, 0, 1);
      expect(formatKoreanDate(date)).toBe("1월 1일 (목)");
    });
  });

  describe("formatKoreanDateShort", () => {
    it("should format date as 'M월 D일'", () => {
      const date = new Date(2026, 1, 19);
      expect(formatKoreanDateShort(date)).toBe("2월 19일");
    });

    it("should handle Feb 29 (leap year)", () => {
      // 2028 is a leap year
      const date = new Date(2028, 1, 29);
      expect(formatKoreanDateShort(date)).toBe("2월 29일");
    });
  });

  describe("formatKoreanMonth", () => {
    it("should format date as 'YYYY년 M월'", () => {
      const date = new Date(2026, 1, 19);
      expect(formatKoreanMonth(date)).toBe("2026년 2월");
    });

    it("should handle December", () => {
      const date = new Date(2025, 11, 1);
      expect(formatKoreanMonth(date)).toBe("2025년 12월");
    });
  });

  describe("isSameDay", () => {
    it("should return true for same date", () => {
      const a = new Date(2026, 1, 19, 10, 30);
      const b = new Date(2026, 1, 19, 23, 59);
      expect(isSameDay(a, b)).toBe(true);
    });

    it("should return false for different dates", () => {
      const a = new Date(2026, 1, 19);
      const b = new Date(2026, 1, 20);
      expect(isSameDay(a, b)).toBe(false);
    });

    it("should return false for same day different month", () => {
      const a = new Date(2026, 0, 19);
      const b = new Date(2026, 1, 19);
      expect(isSameDay(a, b)).toBe(false);
    });

    it("should return false for same day different year", () => {
      const a = new Date(2025, 1, 19);
      const b = new Date(2026, 1, 19);
      expect(isSameDay(a, b)).toBe(false);
    });

    it("should ignore time differences", () => {
      const a = new Date(2026, 1, 19, 0, 0, 0);
      const b = new Date(2026, 1, 19, 23, 59, 59);
      expect(isSameDay(a, b)).toBe(true);
    });
  });
});
