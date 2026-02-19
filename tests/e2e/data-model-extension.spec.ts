import { test, expect } from "./fixtures";

test.describe("Data Model Extension", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Priority Default Value", () => {
    test("should create a todo with default priority", async ({
      page,
      supabaseClient,
      testTodoTitle,
      testDataTracker,
    }) => {
      const todoTitle = testTodoTitle("Priority default");

      // Create a todo via UI
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();
      testDataTracker.trackTodo(todoTitle, todoTitle);

      // Verify default priority in DB
      const { data } = await supabaseClient.client
        .from("todos")
        .select("priority")
        .eq("title", todoTitle)
        .single();

      expect(data?.priority).toBe(2);
    });
  });

  test.describe("CRUD Regression", () => {
    test("should complete add → toggle → delete cycle", async ({
      page,
      testTodoTitle,
    }) => {
      const todoTitle = testTodoTitle("Data model CRUD");

      // ADD
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

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
    test("should switch status filter correctly", async ({
      page,
      testTodoTitle,
      testDataTracker,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Data model filter");

      // Create and complete a todo
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();
      testDataTracker.trackTodo(todoTitle, todoTitle);

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await todoItem.getByTestId("todo-checkbox").click();
      await expect(todoItem.getByTestId("todo-checkbox")).toBeChecked();

      // Active filter: completed todo should not show
      await page.getByTestId("filter-active").click();
      await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 5000 });

      // All filter: todo should show
      await page.getByTestId("filter-all").click();
      await expect(page.getByText(todoTitle)).toBeVisible();
    });
  });
});
