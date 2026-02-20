import { type Page } from "@playwright/test";
import { test, expect } from "./fixtures";

// Helper: switch to calendar tab
async function switchToCalendarTab(page: Page) {
  await page.getByTestId("tab-calendar").click();
  await expect(page.getByTestId("tab-calendar")).toHaveAttribute("aria-current", "page");
}

// Helper: switch to today tab
async function switchToTodayTab(page: Page) {
  await page.getByTestId("tab-today").click();
  await expect(page.getByTestId("tab-today")).toHaveAttribute("aria-current", "page");
}

// Helper: format "YYYY년 M월" matching CalendarView output
function formatKoreanMonth(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

// Helper: format "M월 D일 (요일)" matching CalendarView aria-label
const KOREAN_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = KOREAN_DAYS[date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

test.describe("Calendar View", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test("should display tab bar and switch between tabs", async ({ page }) => {
    // Both tabs visible
    await expect(page.getByTestId("tab-today")).toBeVisible();
    await expect(page.getByTestId("tab-calendar")).toBeVisible();

    // Default is today tab
    await expect(page.getByTestId("tab-today")).toHaveAttribute("aria-current", "page");

    // Switch to calendar
    await switchToCalendarTab(page);
    await expect(page.getByTestId("calendar-view")).toBeVisible();

    // Switch back to today
    await switchToTodayTab(page);
    await expect(page.getByTestId("tab-today")).toHaveAttribute("aria-current", "page");
  });

  test("should render calendar grid with current month", async ({ page }) => {
    await switchToCalendarTab(page);

    // Current month title
    const today = new Date();
    await expect(page.getByTestId("calendar-month-title")).toHaveText(formatKoreanMonth(today));

    // Weekday headers (일~토)
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    for (const day of weekdays) {
      await expect(page.getByText(day, { exact: true }).first()).toBeVisible();
    }

    // Today's date cell exists
    const todayLabel = formatKoreanDate(today);
    await expect(page.getByRole("button", { name: todayLabel })).toBeVisible();
  });

  test("should maintain filter state when switching tabs", async ({
    page,
    createTestTodo,
    supabaseClient,
  }) => {
    void supabaseClient;

    await createTestTodo();

    // Set Active filter
    await page.getByTestId("filter-active").click();
    await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");

    // Switch to calendar and back
    await switchToCalendarTab(page);
    await switchToTodayTab(page);

    // Filter should be preserved
    await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
  });

  test("should navigate between months", async ({ page }) => {
    await switchToCalendarTab(page);

    const today = new Date();
    const currentMonthText = formatKoreanMonth(today);
    await expect(page.getByTestId("calendar-month-title")).toHaveText(currentMonthText);

    // Next month
    await page.getByRole("button", { name: "다음 달" }).click();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    await expect(page.getByTestId("calendar-month-title")).toHaveText(
      formatKoreanMonth(nextMonth)
    );

    // Previous month → back to current
    await page.getByRole("button", { name: "이전 달" }).click();
    await expect(page.getByTestId("calendar-month-title")).toHaveText(currentMonthText);
  });

  test("should show todos for selected date", async ({
    page,
    createTestTodo,
    supabaseClient,
  }) => {
    void supabaseClient;

    // Create a todo with today's date
    const todoTitle = await createTestTodo();

    // Switch to calendar
    await switchToCalendarTab(page);

    // Click today's date
    const today = new Date();
    const todayLabel = formatKoreanDate(today);
    await page.getByRole("button", { name: todayLabel }).click();

    // Selected date section should show the todo
    const selectedSection = page.locator("section[aria-label='선택 날짜 TODO']");
    await expect(selectedSection).toBeVisible();
    await expect(selectedSection.getByText(todoTitle)).toBeVisible();
  });

  test("should show this week TODO section", async ({ page }) => {
    await switchToCalendarTab(page);

    const thisWeekSection = page.locator("section[aria-label='이번 주 TODO']");
    await expect(thisWeekSection).toBeVisible();
  });

  test("should show empty message for date with no todos", async ({ page }) => {
    await switchToCalendarTab(page);

    // Navigate to next month (likely no todos)
    await page.getByRole("button", { name: "다음 달" }).click();
    await page.getByRole("button", { name: "다음 달" }).click();

    // Click a date in that future month
    const calendarView = page.getByTestId("calendar-view");
    const dateButtons = calendarView.locator(".grid.grid-cols-7 > button");
    // Pick a mid-month date that's in the current displayed month
    const midButton = dateButtons.nth(15);
    await midButton.click();

    // Should show empty message
    await expect(page.getByText("이 날짜에 등록된 TODO가 없습니다")).toBeVisible();
  });

  test("should add todo from both tabs", async ({
    page,
    createTestTodo,
    supabaseClient,
  }) => {
    void supabaseClient;

    // Add from today tab
    const todo1 = await createTestTodo();
    await expect(page.getByText(todo1)).toBeVisible();

    // Switch to calendar tab and add
    await switchToCalendarTab(page);

    const todo2Title = `Calendar add ${Date.now()}`;
    const today = new Date();
    const dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    await page.getByTestId("add-todo-button").click();
    await page.getByTestId("todo-title-input").waitFor({ state: "visible" });
    await page.getByTestId("todo-title-input").fill(todo2Title);
    await page.locator("#todo-due-date").fill(dueDate);
    await page.getByTestId("todo-submit-button").click();

    // Click today to see the new todo
    const todayLabel = formatKoreanDate(today);
    await page.getByRole("button", { name: todayLabel }).click();

    const selectedSection = page.locator("section[aria-label='선택 날짜 TODO']");
    await expect(selectedSection.getByText(todo2Title)).toBeVisible();
  });
});
