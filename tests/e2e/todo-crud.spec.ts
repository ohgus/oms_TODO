import { test, expect } from "./fixtures";

test.describe("Todo CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Create Todo", () => {
    test("should add a new todo", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      // supabaseClient is included to trigger cleanup after test
      void supabaseClient;

      const todoTitle = testTodoTitle("Create test");

      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      await expect(page.getByText(todoTitle)).toBeVisible();
      testDataTracker.trackTodo(todoTitle, todoTitle);
    });

    test("should clear input after adding todo", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Clear input test");

      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      await expect(page.getByTestId("todo-input")).toHaveValue("");
      testDataTracker.trackTodo(todoTitle, todoTitle);
    });

    test("should show error when adding empty todo", async ({ page }) => {
      await page.getByTestId("add-button").click();

      await expect(page.getByRole("alert")).toBeVisible();
      await expect(page.getByText("Title is required")).toBeVisible();
    });

    test("should add todo with category", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Todo with category");

      await page.getByTestId("todo-input").fill(todoTitle);

      const categorySelect = page.getByTestId("category-select");
      if (await categorySelect.isVisible({ timeout: 1000 }).catch(() => false)) {
        const options = categorySelect.locator("option");
        const count = await options.count();
        if (count > 1) {
          await categorySelect.selectOption({ index: 1 });
        }
      }

      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();
      testDataTracker.trackTodo(todoTitle, todoTitle);
    });
  });

  test.describe("Read Todo", () => {
    test("should display todo list", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Display test");
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      await expect(page.getByText(todoTitle)).toBeVisible();

      const todoList = page.getByTestId("todo-list");
      await expect(todoList).toBeVisible();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();
      testDataTracker.trackTodo(todoTitle, todoTitle);
    });

    test("should show empty message when no todos", async ({ page }) => {
      const emptyMessage = page.getByTestId("empty-message");
      const todoList = page.getByTestId("todo-list");

      const hasItems = await todoList.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasItems) {
        const deleteButtons = page.getByTestId("delete-button");
        let count = await deleteButtons.count();

        while (count > 0) {
          await deleteButtons.first().click();
          await page.waitForTimeout(500);
          count = await deleteButtons.count();
        }
      }

      await expect(emptyMessage).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Update Todo", () => {
    test("should toggle todo completion status", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Toggle test");
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      await expect(page.getByText(todoTitle)).toBeVisible();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      const checkbox = todoItem.getByTestId("todo-checkbox");

      await expect(checkbox).not.toBeChecked();

      await checkbox.click();
      await expect(checkbox).toBeChecked();

      const title = todoItem.getByTestId("todo-title");
      await expect(title).toHaveClass(/line-through/);

      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
      await expect(title).not.toHaveClass(/line-through/);

      testDataTracker.trackTodo(todoTitle, todoTitle);
    });
  });

  test.describe("Delete Todo", () => {
    test("should delete a todo", async ({ page, testTodoTitle }) => {
      // No tracking needed - todo is deleted in test
      const todoTitle = testTodoTitle("Delete test");
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      await expect(page.getByText(todoTitle)).toBeVisible();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await todoItem.getByTestId("delete-button").click();

      await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Full CRUD Flow", () => {
    test("should complete full CRUD cycle", async ({ page, testTodoTitle }) => {
      // No tracking needed - todo is deleted in test
      const todoTitle = testTodoTitle("Full CRUD");

      // CREATE
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // READ
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      // UPDATE
      const checkbox = todoItem.getByTestId("todo-checkbox");
      await checkbox.click();
      await expect(checkbox).toBeChecked();

      // DELETE
      await todoItem.getByTestId("delete-button").click();
      await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 10000 });
    });
  });
});
