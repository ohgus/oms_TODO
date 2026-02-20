import { test, expect } from "./fixtures";
import { checkTodo, uncheckTodo } from "./helpers";

test.describe("Todo CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Create Todo", () => {
    test("should add a new todo", async ({ page, createTestTodo, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = await createTestTodo();
      await expect(page.getByTestId("todo-item").filter({ hasText: todoTitle })).toBeVisible();
    });

    test("should clear form after adding todo", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      await createTestTodo();

      // Re-open modal and verify form is empty
      await page.getByTestId("add-todo-button").click();
      await page.getByTestId("todo-title-input").waitFor({ state: "visible" });
      await expect(page.getByTestId("todo-title-input")).toHaveValue("");
    });

    test("should disable submit button when title is empty", async ({ page }) => {
      await page.getByTestId("add-todo-button").click();
      await page.getByTestId("todo-title-input").waitFor({ state: "visible" });

      await expect(page.getByTestId("todo-submit-button")).toBeDisabled();
    });

    test("should add todo with category", async ({
      page,
      testTodoTitle,
      testDataTracker,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Todo with category");
      const today = new Date();
      const dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // Open modal
      await page.getByTestId("add-todo-button").click();
      await page.getByTestId("todo-title-input").waitFor({ state: "visible" });

      // Fill title
      await page.getByTestId("todo-title-input").fill(todoTitle);

      // Fill due date
      await page.locator("#todo-due-date").fill(dueDate);

      // Select category if available (scope to drawer content)
      const drawer = page.locator("[data-vaul-drawer]");
      const categoryButtons = drawer.locator("button.rounded-full");
      const hasCat = await categoryButtons
        .first()
        .isVisible({ timeout: 1000 })
        .catch(() => false);
      if (hasCat) {
        await categoryButtons.first().click();
      }

      // Submit
      await page.getByTestId("todo-submit-button").click();
      await page
        .getByTestId("todo-item")
        .filter({ hasText: todoTitle })
        .first()
        .waitFor({ state: "visible" });
      testDataTracker.trackTodo(todoTitle, todoTitle);
    });
  });

  test.describe("Read Todo", () => {
    test("should display todo list", async ({ page, createTestTodo, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = await createTestTodo();

      const todoList = page.getByTestId("todo-list");
      await expect(todoList).toBeVisible();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();
    });

    test("should show empty message when no todos", async ({ page }) => {
      // Switch to completed filter where there are likely no items
      await page.getByTestId("filter-completed").click();

      const emptyMessage = page.getByTestId("empty-message");
      const todoItems = page.getByTestId("todo-item");

      await expect(async () => {
        const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
        const todoCount = await todoItems.count();
        expect(hasEmptyMessage || todoCount === 0).toBeTruthy();
      }).toPass({ timeout: 10000 });
    });
  });

  test.describe("Update Todo", () => {
    test("should toggle todo completion status", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = await createTestTodo();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      const checkbox = todoItem.getByTestId("todo-checkbox");

      await expect(checkbox).not.toBeChecked();

      await checkTodo(todoItem, page);

      const title = todoItem.getByTestId("todo-title");
      await expect(title).toHaveClass(/line-through/);

      await uncheckTodo(todoItem, page);
      await expect(title).not.toHaveClass(/line-through/);
    });
  });

  test.describe("Delete Todo", () => {
    test("should delete a todo", async ({ page, createTestTodo }) => {
      const todoTitle = await createTestTodo();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await todoItem.getByTestId("delete-button").click();

      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Full CRUD Flow", () => {
    test("should complete full CRUD cycle", async ({ page, createTestTodo }) => {
      // CREATE
      const todoTitle = await createTestTodo();

      // READ
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      // UPDATE
      await checkTodo(todoItem, page);

      // DELETE
      await todoItem.getByTestId("delete-button").click();
      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).not.toBeVisible({ timeout: 10000 });
    });
  });
});
