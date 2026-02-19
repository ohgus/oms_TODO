import { test, expect } from "./fixtures";

test.describe("Design Tokens", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Font", () => {
    test("should apply Outfit font to body", async ({ page }) => {
      const fontFamily = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily;
      });

      expect(fontFamily).toContain("Outfit");
    });
  });

  test.describe("CSS Variables", () => {
    test("should set --bg-primary to #F5F4F1", async ({ page }) => {
      const value = await page.evaluate(() => {
        return window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("--bg-primary")
          .trim();
      });

      expect(value).toBe("#F5F4F1");
    });

    test("should set --text-primary to #1A1918", async ({ page }) => {
      const value = await page.evaluate(() => {
        return window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("--text-primary")
          .trim();
      });

      expect(value).toBe("#1A1918");
    });

    test("should set --accent-primary to #3D8A5A", async ({ page }) => {
      const value = await page.evaluate(() => {
        return window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-primary")
          .trim();
      });

      expect(value).toBe("#3D8A5A");
    });
  });

  test.describe("CRUD Regression", () => {
    test("should complete add → display → toggle → delete cycle", async ({
      page,
      testTodoTitle,
    }) => {
      const todoTitle = testTodoTitle("Design token CRUD");

      // ADD
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      // DISPLAY
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      // TOGGLE
      const checkbox = todoItem.getByTestId("todo-checkbox");
      await checkbox.click();
      await expect(checkbox).toBeChecked();

      // DELETE
      await todoItem.getByTestId("delete-button").click();
      await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Filter Regression", () => {
    test("should switch status filter and update list", async ({
      page,
      testTodoTitle,
      testDataTracker,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Filter status test");

      // Create a todo
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();
      testDataTracker.trackTodo(todoTitle, todoTitle);

      // Complete the todo
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await todoItem.getByTestId("todo-checkbox").click();
      await expect(todoItem.getByTestId("todo-checkbox")).toBeChecked();

      // Filter: Active — completed todo should not be visible
      const activeFilter = page.getByTestId("filter-active");
      await activeFilter.click();
      await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 5000 });

      // Filter: Completed — completed todo should be visible
      const completedFilter = page.getByTestId("filter-completed");
      await completedFilter.click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Filter: All — todo should be visible
      const allFilter = page.getByTestId("filter-all");
      await allFilter.click();
      await expect(page.getByText(todoTitle)).toBeVisible();
    });
  });
});
