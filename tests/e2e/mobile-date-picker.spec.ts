import { expect, test } from "./fixtures";

test.describe("Mobile DatePicker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test("should open date picker and select a date", async ({ page, supabaseClient }) => {
    void supabaseClient;

    // Open TodoAddModal
    await page.getByTestId("add-todo-button").click();
    await page.getByTestId("todo-title-input").waitFor({ state: "visible" });

    // DatePicker should be visible with placeholder
    const datePicker = page.getByTestId("date-picker");
    await expect(datePicker).toBeVisible();
    await expect(datePicker).toContainText("날짜를 선택하세요");

    // Fill date via the transparent input (Playwright can interact directly)
    const dateInput = page.getByTestId("date-picker-input");
    await expect(dateInput).toHaveAttribute("type", "date");

    const today = new Date();
    const dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    await dateInput.fill(dueDate);

    // Verify Korean formatted date is displayed (not placeholder)
    await expect(datePicker).not.toContainText("날짜를 선택하세요");
  });

  test("should clear selected date", async ({ page, supabaseClient }) => {
    void supabaseClient;

    // Open TodoAddModal
    await page.getByTestId("add-todo-button").click();
    await page.getByTestId("todo-title-input").waitFor({ state: "visible" });

    // Select a date first
    const dateInput = page.getByTestId("date-picker-input");
    const today = new Date();
    const dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    await dateInput.fill(dueDate);

    // Verify date is shown
    const datePicker = page.getByTestId("date-picker");
    await expect(datePicker).not.toContainText("날짜를 선택하세요");

    // Click clear button
    const clearButton = page.getByTestId("date-picker-clear");
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Verify placeholder is back
    await expect(datePicker).toContainText("날짜를 선택하세요");
  });

  test("should submit todo with due date", async ({
    page,
    testTodoTitle,
    testDataTracker,
    supabaseClient,
  }) => {
    void supabaseClient;

    const todoTitle = testTodoTitle("DatePicker test");

    // Open modal
    await page.getByTestId("add-todo-button").click();
    await page.getByTestId("todo-title-input").waitFor({ state: "visible" });

    // Fill title
    await page.getByTestId("todo-title-input").fill(todoTitle);

    // Fill due date
    const dateInput = page.getByTestId("date-picker-input");
    const today = new Date();
    const dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    await dateInput.fill(dueDate);

    // Submit
    await page.getByTestId("todo-submit-button").click();

    // Verify todo appears
    await page
      .getByTestId("todo-item")
      .filter({ hasText: todoTitle })
      .first()
      .waitFor({ state: "visible" });

    testDataTracker.trackTodo(todoTitle, todoTitle);
  });

  test("should have proper touch target size", async ({ page }) => {
    // Open TodoAddModal
    await page.getByTestId("add-todo-button").click();
    await page.getByTestId("todo-title-input").waitFor({ state: "visible" });

    // DatePicker should meet 44px minimum touch target
    const datePicker = page.getByTestId("date-picker");
    const box = await datePicker.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
