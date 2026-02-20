export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasTodos: boolean;
}

/**
 * Convert Date to "YYYY-MM-DD" string
 */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Get the first and last day of the month containing the given date
 */
export function getMonthRange(date: Date): { from: Date; to: Date } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const from = new Date(year, month, 1);
  const to = new Date(year, month + 1, 0); // last day of month
  return { from, to };
}

/**
 * Get the Sunday–Saturday week range for the given date
 */
export function getWeekRange(date: Date): { from: Date; to: Date } {
  const day = date.getDay(); // 0=Sun, 6=Sat
  const from = new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
  const to = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - day));
  return { from, to };
}

/**
 * Generate a 2D array of CalendarDay for a given month.
 * Each row is a week (Sun–Sat). Includes padding days from prev/next months.
 */
export function generateCalendarDays(
  year: number,
  month: number,
  todoDateSet: Set<string>
): CalendarDay[][] {
  const today = new Date();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startOffset = firstDayOfMonth.getDay(); // days from prev month to fill first week
  const totalDays = lastDayOfMonth.getDate();
  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;

  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  for (let i = 0; i < totalCells; i++) {
    const date = new Date(year, month, 1 - startOffset + i);
    const dateStr = toDateString(date);

    currentWeek.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
      hasTodos: todoDateSet.has(dateStr),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
}
