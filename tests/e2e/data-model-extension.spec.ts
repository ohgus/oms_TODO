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
    }) => {
      const todoTitle = testTodoTitle("Priority default");

      // Create a todo via UI
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 10000 });

      // Query DB immediately after UI confirmation (mutation success = DB write complete)
      const { data } = await supabaseClient.getClient()
        .from("todos")
        .select("id, priority")
        .eq("title", todoTitle)
        .single();

      expect(data?.priority).toBe(2);

      // Self-cleanup to avoid affecting parallel tests
      if (data?.id) {
        await supabaseClient.deleteTodo(data.id);
      }
    });
  });

  test.describe("CRUD Regression", () => {
    test("should add and delete a todo", async ({
      page,
      testTodoTitle,
    }) => {
      const todoTitle = testTodoTitle("Data model CRUD");

      // ADD
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 10000 });

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      // DELETE
      const deleteButton = todoItem.getByTestId("delete-button");
      await deleteButton.waitFor({ state: "visible" });
      await deleteButton.click();
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

      // Create a todo
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 10000 });
      testDataTracker.trackTodo(todoTitle, todoTitle);

      // Complete the todo
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      const checkbox = todoItem.getByTestId("todo-checkbox");
      await checkbox.click();
      await expect(checkbox).toBeChecked({ timeout: 10000 });

      // Active filter: completed todo should not show
      await page.getByTestId("filter-active").click();
      await expect(page.getByText(todoTitle)).not.toBeVisible({ timeout: 10000 });

      // All filter: todo should show
      await page.getByTestId("filter-all").click();
      await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 10000 });
    });
  });
});
