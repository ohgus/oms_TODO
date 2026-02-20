import { test, expect } from "./fixtures";
import { checkTodo } from "./helpers";

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
      const today = new Date();
      const dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // Create a todo via modal
      await page.getByTestId("add-todo-button").click();
      await page.getByTestId("todo-title-input").waitFor({ state: "visible" });
      await page.getByTestId("todo-title-input").fill(todoTitle);
      await page.locator("#todo-due-date").fill(dueDate);
      await page.getByTestId("todo-submit-button").click();
      await page
        .getByTestId("todo-item")
        .filter({ hasText: todoTitle })
        .first()
        .waitFor({ state: "visible", timeout: 10000 });
      testDataTracker.trackTodo(todoTitle, todoTitle);

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
    test("should add and delete a todo", async ({ page, createTestTodo }) => {
      const todoTitle = await createTestTodo();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      // DELETE
      await todoItem.getByTestId("delete-button").click();
      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Filter Regression", () => {
    test("should switch status filter correctly", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = await createTestTodo();

      // Complete the todo
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await checkTodo(todoItem, page);

      // Active filter: completed todo should not show
      await page.getByTestId("filter-active").click();
      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).not.toBeVisible({ timeout: 10000 });

      // All filter: todo should show
      await page.getByTestId("filter-all").click();
      await expect(
        page.getByTestId("todo-item").filter({ hasText: todoTitle })
      ).toBeVisible({ timeout: 10000 });
    });
  });
});
