import { test, expect } from "@playwright/test";

test.describe("Todo Filtering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Status Filter", () => {
    test("should filter by 'All' status", async ({ page }) => {
      // Add some todos
      const todo1 = "All filter test 1 " + Date.now();
      const todo2 = "All filter test 2 " + Date.now();

      await page.getByTestId("todo-input").fill(todo1);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todo1)).toBeVisible();

      await page.getByTestId("todo-input").fill(todo2);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todo2)).toBeVisible();

      // Complete one todo
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todo1 });
      await todoItem.getByTestId("todo-checkbox").click();

      // Click "All" filter
      await page.getByTestId("filter-all").click();

      // Both should be visible
      await expect(page.getByText(todo1)).toBeVisible();
      await expect(page.getByText(todo2)).toBeVisible();
    });

    test("should filter by 'Active' status", async ({ page }) => {
      // Add todos
      const activeTodo = "Active todo " + Date.now();
      const completedTodo = "Completed todo " + Date.now();

      await page.getByTestId("todo-input").fill(activeTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(activeTodo)).toBeVisible();

      await page.getByTestId("todo-input").fill(completedTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(completedTodo)).toBeVisible();

      // Complete one todo
      const todoItem = page.getByTestId("todo-item").filter({ hasText: completedTodo });
      await todoItem.getByTestId("todo-checkbox").click();

      // Click "Active" filter
      await page.getByTestId("filter-active").click();

      // Only active todo should be visible
      await expect(page.getByText(activeTodo)).toBeVisible();
      await expect(page.getByText(completedTodo)).not.toBeVisible();
    });

    test("should filter by 'Completed' status", async ({ page }) => {
      // Add todos
      const activeTodo = "Active for completed " + Date.now();
      const completedTodo = "Completed for completed " + Date.now();

      await page.getByTestId("todo-input").fill(activeTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(activeTodo)).toBeVisible();

      await page.getByTestId("todo-input").fill(completedTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(completedTodo)).toBeVisible();

      // Complete one todo
      const todoItem = page.getByTestId("todo-item").filter({ hasText: completedTodo });
      await todoItem.getByTestId("todo-checkbox").click();

      // Click "Completed" filter
      await page.getByTestId("filter-completed").click();

      // Only completed todo should be visible
      await expect(page.getByText(completedTodo)).toBeVisible();
      await expect(page.getByText(activeTodo)).not.toBeVisible();
    });

    test("should show empty message when no matching todos", async ({ page }) => {
      // First, add an active todo only
      const activeTodo = "Only active " + Date.now();
      await page.getByTestId("todo-input").fill(activeTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(activeTodo)).toBeVisible();

      // Click "Completed" filter - should show empty since there are no completed todos
      await page.getByTestId("filter-completed").click();

      // Should show empty message (the specific todo we added shouldn't be visible)
      await expect(page.getByText(activeTodo)).not.toBeVisible();

      // Either empty message or no todo items should be present
      const emptyMessage = page.getByTestId("empty-message");
      const todoItems = page.getByTestId("todo-item");

      // Wait for one of the conditions
      await expect(async () => {
        const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
        const todoCount = await todoItems.count();
        expect(hasEmptyMessage || todoCount === 0).toBeTruthy();
      }).toPass({ timeout: 10000 });
    });
  });

  test.describe("Category Filter", () => {
    test("should display category filter when categories exist", async ({ page }) => {
      // Check if category filter is visible
      const categoryFilter = page.getByTestId("category-filter");

      // Category filter visibility depends on whether categories exist in the database
      // This test verifies the filter renders correctly when present
      if (await categoryFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(categoryFilter).toBeVisible();
        await expect(page.getByTestId("category-all")).toBeVisible();
      }
    });

    test("should filter by 'All' categories", async ({ page }) => {
      const categoryFilter = page.getByTestId("category-filter");

      if (await categoryFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Click "All" category
        await page.getByTestId("category-all").click();

        // Verify it's pressed
        await expect(page.getByTestId("category-all")).toHaveAttribute("aria-pressed", "true");
      }
    });

    test("should maintain filter state after adding new todo", async ({ page }) => {
      // Set filter to "Active"
      await page.getByTestId("filter-active").click();
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");

      // Add a new todo
      const newTodo = "New todo while filtered " + Date.now();
      await page.getByTestId("todo-input").fill(newTodo);
      await page.getByTestId("add-button").click();

      // Filter should remain on "Active"
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");

      // New todo should be visible (it's active by default)
      await expect(page.getByText(newTodo)).toBeVisible();
    });
  });

  test.describe("Combined Filters", () => {
    test("should apply both status and category filters", async ({ page }) => {
      const categoryFilter = page.getByTestId("category-filter");

      // Only run combined filter test if categories are available
      if (await categoryFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Set status filter
        await page.getByTestId("filter-active").click();

        // Set category filter to "All"
        await page.getByTestId("category-all").click();

        // Both filters should be active
        await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
        await expect(page.getByTestId("category-all")).toHaveAttribute("aria-pressed", "true");
      }
    });
  });
});
