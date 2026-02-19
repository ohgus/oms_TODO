const KOREAN_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/**
 * Format date as "M월 D일 (요일)"
 * e.g. "2월 19일 (목)"
 */
export function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = KOREAN_DAYS[date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * Format date as "M월 D일"
 * e.g. "2월 19일"
 */
export function formatKoreanDateShort(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * Format date as "YYYY년 M월"
 * e.g. "2026년 2월"
 */
export function formatKoreanMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

/**
 * Check if two dates are the same day (ignoring time)
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
