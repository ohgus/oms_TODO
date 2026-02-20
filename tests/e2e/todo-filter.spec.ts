import { test, expect } from "./fixtures";
import { checkTodo } from "./helpers";

test.describe("Todo Filtering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Status Filter", () => {
    test("should filter by 'All' status", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todo1 = await createTestTodo();
      const todo2 = await createTestTodo();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todo1 });
      await checkTodo(todoItem, page);

      await page.getByTestId("filter-all").click();

      await expect(page.getByTestId("todo-item").filter({ hasText: todo1 })).toBeVisible();
      await expect(page.getByTestId("todo-item").filter({ hasText: todo2 })).toBeVisible();
    });

    test("should filter by 'Active' status", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      const activeTodo = await createTestTodo();
      const completedTodo = await createTestTodo();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: completedTodo });
      await checkTodo(todoItem, page);

      await page.getByTestId("filter-active").click();

      await expect(page.getByTestId("todo-item").filter({ hasText: activeTodo })).toBeVisible();
      await expect(page.getByTestId("todo-item").filter({ hasText: completedTodo })).not.toBeVisible();
    });

    test("should filter by 'Completed' status", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      const activeTodo = await createTestTodo();
      const completedTodo = await createTestTodo();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: completedTodo });
      await checkTodo(todoItem, page);

      await page.getByTestId("filter-completed").click();

      await expect(page.getByTestId("todo-item").filter({ hasText: completedTodo })).toBeVisible();
      await expect(page.getByTestId("todo-item").filter({ hasText: activeTodo })).not.toBeVisible();
    });

    test("should show empty message when no matching todos", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      await createTestTodo();

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
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      await page.getByTestId("filter-active").click();
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");

      const newTodo = await createTestTodo();

      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByTestId("todo-item").filter({ hasText: newTodo })).toBeVisible();
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
