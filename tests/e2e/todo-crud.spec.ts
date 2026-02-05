import { test, expect } from "@playwright/test";

test.describe("Todo CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to be ready
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Create Todo", () => {
    test("should add a new todo", async ({ page }) => {
      const todoTitle = "Test todo item " + Date.now();

      // Fill in the todo input
      await page.getByTestId("todo-input").fill(todoTitle);

      // Click the add button
      await page.getByTestId("add-button").click();

      // Verify the todo appears in the list
      await expect(page.getByText(todoTitle)).toBeVisible();
    });

    test("should clear input after adding todo", async ({ page }) => {
      const todoTitle = "Clear input test " + Date.now();

      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      // Verify input is cleared
      await expect(page.getByTestId("todo-input")).toHaveValue("");
    });

    test("should show error when adding empty todo", async ({ page }) => {
      // Click add without entering anything
      await page.getByTestId("add-button").click();

      // Verify error message appears
      await expect(page.getByRole("alert")).toBeVisible();
      await expect(page.getByText("Title is required")).toBeVisible();
    });

    test("should add todo with category", async ({ page }) => {
      const todoTitle = "Todo with category " + Date.now();

      await page.getByTestId("todo-input").fill(todoTitle);

      // Select category if available
      const categorySelect = page.getByTestId("category-select");
      if (await categorySelect.isVisible({ timeout: 1000 }).catch(() => false)) {
        // Get first non-empty option
        const options = categorySelect.locator("option");
        const count = await options.count();
        if (count > 1) {
          await categorySelect.selectOption({ index: 1 });
        }
      }

      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();
    });
  });

  test.describe("Read Todo", () => {
    test("should display todo list", async ({ page }) => {
      // Add a todo first
      const todoTitle = "Display test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      // Wait for the todo to appear
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Verify todo list is visible (when there are items, the list should be visible)
      const todoList = page.getByTestId("todo-list");
      await expect(todoList).toBeVisible();

      // Verify todo item exists
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();
    });

    test("should show empty message when no todos", async ({ page }) => {
      // First, ensure we're on a clean state by checking the current filter
      // If empty message is already shown, the test passes
      const emptyMessage = page.getByTestId("empty-message");
      const todoList = page.getByTestId("todo-list");

      // Check initial state - either empty or has items
      const hasItems = await todoList.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasItems) {
        // Delete all existing todos if any
        const deleteButtons = page.getByTestId("delete-button");
        let count = await deleteButtons.count();

        // Delete one by one with proper waiting
        while (count > 0) {
          await deleteButtons.first().click();
          // Wait for deletion to complete
          await page.waitForTimeout(500);
          count = await deleteButtons.count();
        }
      }

      // Verify empty message is shown
      await expect(emptyMessage).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Update Todo", () => {
    test("should toggle todo completion status", async ({ page }) => {
      // Add a todo first
      const todoTitle = "Toggle test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      // Wait for todo to appear
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Find the todo item and toggle checkbox
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      const checkbox = todoItem.getByTestId("todo-checkbox");

      // Verify initial state (unchecked)
      await expect(checkbox).not.toBeChecked();

      // Toggle to completed
      await checkbox.click();
      await expect(checkbox).toBeChecked();

      // Verify the title has line-through style
      const title = todoItem.getByTestId("todo-title");
      await expect(title).toHaveClass(/line-through/);

      // Toggle back to incomplete
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
      await expect(title).not.toHaveClass(/line-through/);
    });
  });

  test.describe("Delete Todo", () => {
    test("should delete a todo", async ({ page }) => {
      // Add a todo first
      const todoTitle = "Delete test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      // Wait for todo to appear
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Find and delete the todo
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await todoItem.getByTestId("delete-button").click();

      // Wait for deletion to complete and verify todo is removed
      await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Full CRUD Flow", () => {
    test("should complete full CRUD cycle", async ({ page }) => {
      const todoTitle = "Full CRUD " + Date.now();

      // CREATE
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // READ - Verify it's in the list
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      // UPDATE - Toggle completion
      const checkbox = todoItem.getByTestId("todo-checkbox");
      await checkbox.click();
      await expect(checkbox).toBeChecked();

      // DELETE
      await todoItem.getByTestId("delete-button").click();
      await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 10000 });
    });
  });
});
