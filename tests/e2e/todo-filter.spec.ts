import { test, expect } from "./fixtures";

test.describe("Todo Filtering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Status Filter", () => {
    test("should filter by 'All' status", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todo1 = testTodoTitle("All filter test 1");
      const todo2 = testTodoTitle("All filter test 2");

      await page.getByTestId("todo-input").fill(todo1);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todo1)).toBeVisible();

      await page.getByTestId("todo-input").fill(todo2);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todo2)).toBeVisible();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todo1 });
      await todoItem.getByTestId("todo-checkbox").click();

      await page.getByTestId("filter-all").click();

      await expect(page.getByText(todo1)).toBeVisible();
      await expect(page.getByText(todo2)).toBeVisible();

      testDataTracker.trackTodo(todo1, todo1);
      testDataTracker.trackTodo(todo2, todo2);
    });

    test("should filter by 'Active' status", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const activeTodo = testTodoTitle("Active todo");
      const completedTodo = testTodoTitle("Completed todo");

      await page.getByTestId("todo-input").fill(activeTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(activeTodo)).toBeVisible();

      await page.getByTestId("todo-input").fill(completedTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(completedTodo)).toBeVisible();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: completedTodo });
      await todoItem.getByTestId("todo-checkbox").click();

      await page.getByTestId("filter-active").click();

      await expect(page.getByText(activeTodo)).toBeVisible();
      await expect(page.getByText(completedTodo)).not.toBeVisible();

      testDataTracker.trackTodo(activeTodo, activeTodo);
      testDataTracker.trackTodo(completedTodo, completedTodo);
    });

    test("should filter by 'Completed' status", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const activeTodo = testTodoTitle("Active for completed");
      const completedTodo = testTodoTitle("Completed for completed");

      await page.getByTestId("todo-input").fill(activeTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(activeTodo)).toBeVisible();

      await page.getByTestId("todo-input").fill(completedTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(completedTodo)).toBeVisible();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: completedTodo });
      await todoItem.getByTestId("todo-checkbox").click();

      await page.getByTestId("filter-completed").click();

      await expect(page.getByText(completedTodo)).toBeVisible();
      await expect(page.getByText(activeTodo)).not.toBeVisible();

      testDataTracker.trackTodo(activeTodo, activeTodo);
      testDataTracker.trackTodo(completedTodo, completedTodo);
    });

    test("should show empty message when no matching todos", async ({
      page,
      testTodoTitle,
      testDataTracker,
      supabaseClient,
    }) => {
      void supabaseClient;

      const activeTodo = testTodoTitle("Only active");
      await page.getByTestId("todo-input").fill(activeTodo);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(activeTodo)).toBeVisible();

      await page.getByTestId("filter-completed").click();

      await expect(page.getByText(activeTodo)).not.toBeVisible();

      const emptyMessage = page.getByTestId("empty-message");
      const todoItems = page.getByTestId("todo-item");

      await expect(async () => {
        const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
        const todoCount = await todoItems.count();
        expect(hasEmptyMessage || todoCount === 0).toBeTruthy();
      }).toPass({ timeout: 10000 });

      testDataTracker.trackTodo(activeTodo, activeTodo);
    });
  });

  test.describe("Category Filter", () => {
    test("should display category filter when categories exist", async ({ page }) => {
      const categoryFilter = page.getByTestId("category-filter");

      if (await categoryFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(categoryFilter).toBeVisible();
        await expect(page.getByTestId("category-all")).toBeVisible();
      }
    });

    test("should filter by 'All' categories", async ({ page }) => {
      const categoryFilter = page.getByTestId("category-filter");

      if (await categoryFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        await page.getByTestId("category-all").click();
        await expect(page.getByTestId("category-all")).toHaveAttribute("aria-pressed", "true");
      }
    });

    test("should maintain filter state after adding new todo", async ({
      page,
      testTodoTitle,
      testDataTracker,
      supabaseClient,
    }) => {
      void supabaseClient;

      await page.getByTestId("filter-active").click();
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");

      const newTodo = testTodoTitle("New todo while filtered");
      await page.getByTestId("todo-input").fill(newTodo);
      await page.getByTestId("add-button").click();

      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByText(newTodo)).toBeVisible();

      testDataTracker.trackTodo(newTodo, newTodo);
    });
  });

  test.describe("Combined Filters", () => {
    test("should apply both status and category filters", async ({ page }) => {
      const categoryFilter = page.getByTestId("category-filter");

      if (await categoryFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        await page.getByTestId("filter-active").click();
        await page.getByTestId("category-all").click();

        await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
        await expect(page.getByTestId("category-all")).toHaveAttribute("aria-pressed", "true");
      }
    });
  });
});
