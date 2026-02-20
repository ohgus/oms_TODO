import { test, expect } from "./fixtures";
import { checkTodo } from "./helpers";

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
      createTestTodo,
    }) => {
      const todoTitle = await createTestTodo();

      // DISPLAY
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      // TOGGLE
      await checkTodo(todoItem, page);

      // DELETE
      await todoItem.getByTestId("delete-button").click();
      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Filter Regression", () => {
    test("should switch status filter and update list", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = await createTestTodo();

      // Complete the todo
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await checkTodo(todoItem, page);

      // Filter: Active — completed todo should not be visible
      const activeFilter = page.getByTestId("filter-active");
      await activeFilter.click();
      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).not.toBeVisible({ timeout: 5000 });

      // Filter: Completed — completed todo should be visible
      const completedFilter = page.getByTestId("filter-completed");
      await completedFilter.click();
      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).toBeVisible();

      // Filter: All — todo should be visible
      const allFilter = page.getByTestId("filter-all");
      await allFilter.click();
      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).toBeVisible();
    });
  });
});
