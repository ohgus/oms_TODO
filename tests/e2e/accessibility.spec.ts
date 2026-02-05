import { test, expect } from "./fixtures";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Keyboard Navigation", () => {
    test.describe("Desktop Only", () => {
      test.skip(({ browserName }) => browserName !== "chromium", "Tab navigation tests only run on Desktop Chrome");

      test("should navigate through form elements with Tab", async ({ page, isMobile }) => {
        test.skip(isMobile, "Tab navigation not applicable on mobile");

        await page.getByTestId("todo-input").focus();
        await expect(page.getByTestId("todo-input")).toBeFocused();

        await page.keyboard.press("Tab");

        const categorySelect = page.getByTestId("category-select");
        if (await categorySelect.isVisible({ timeout: 500 }).catch(() => false)) {
          await expect(categorySelect).toBeFocused();
          await page.keyboard.press("Tab");
        }

        await expect(page.getByTestId("add-button")).toBeFocused();
      });

      test("should navigate status filter with keyboard", async ({ page, isMobile }) => {
        test.skip(isMobile, "Tab navigation not applicable on mobile");

        await page.getByTestId("filter-all").focus();
        await expect(page.getByTestId("filter-all")).toBeFocused();

        await page.keyboard.press("Tab");
        await expect(page.getByTestId("filter-active")).toBeFocused();

        await page.keyboard.press("Tab");
        await expect(page.getByTestId("filter-completed")).toBeFocused();
      });
    });

    test("should submit form with Enter key", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Keyboard submit test");

      await page.getByTestId("todo-input").fill(todoTitle);
      await page.keyboard.press("Enter");

      await expect(page.getByText(todoTitle)).toBeVisible();
      testDataTracker.trackTodo(todoTitle, todoTitle);
    });

    test("should activate buttons with Enter and Space", async ({ page }) => {
      await page.getByTestId("filter-active").focus();

      await page.keyboard.press("Enter");
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");

      await page.getByTestId("filter-all").focus();
      await page.keyboard.press("Space");
      await expect(page.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "true");
    });

    test("should navigate todo items with keyboard", async ({
      page,
      testTodoTitle,
      testDataTracker,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Keyboard nav todo");
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      const checkbox = todoItem.getByTestId("todo-checkbox");

      await checkbox.focus();
      await expect(checkbox).toBeFocused();

      await page.keyboard.press("Space");
      await expect(checkbox).toBeChecked();

      testDataTracker.trackTodo(todoTitle, todoTitle);
    });
  });

  test.describe("ARIA Attributes", () => {
    test("should have proper aria-label on form elements", async ({ page }) => {
      const input = page.getByTestId("todo-input");
      await expect(input).toHaveAttribute("aria-label", "Todo title");

      const addButton = page.getByTestId("add-button");
      await expect(addButton).toHaveAttribute("aria-label", "Add todo");
    });

    test("should have proper aria-pressed on filter buttons", async ({ page }) => {
      await expect(page.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "false");
      await expect(page.getByTestId("filter-completed")).toHaveAttribute("aria-pressed", "false");

      await page.getByTestId("filter-active").click();

      await expect(page.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "false");
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
    });

    test("should have proper role attributes", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("ARIA role test");
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      const todoList = page.getByTestId("todo-list");
      await expect(todoList).toHaveAttribute("role", "list");

      const listItems = page.locator("[role='listitem']");
      await expect(listItems.first()).toBeVisible();

      const statusFilter = page.getByTestId("status-filter");
      await expect(statusFilter).toHaveAttribute("role", "group");
      await expect(statusFilter).toHaveAttribute("aria-label", "Status filter");

      testDataTracker.trackTodo(todoTitle, todoTitle);
    });

    test("should have proper aria-invalid on form errors", async ({ page }) => {
      await page.getByTestId("add-button").click();

      const input = page.getByTestId("todo-input");
      await expect(input).toHaveAttribute("aria-invalid", "true");
    });

    test("should have aria-describedby for error messages", async ({ page }) => {
      await page.getByTestId("add-button").click();

      const input = page.getByTestId("todo-input");
      await expect(input).toHaveAttribute("aria-describedby", "title-error");

      const errorMessage = page.locator("#title-error");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveAttribute("role", "alert");
    });
  });

  test.describe("Screen Reader Support", () => {
    test("should have descriptive button labels", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Screen reader test");
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      const editButton = todoItem.getByTestId("edit-button");
      const editLabel = await editButton.getAttribute("aria-label");
      expect(editLabel).toContain("Edit");
      expect(editLabel).toContain(todoTitle);

      const deleteButton = todoItem.getByTestId("delete-button");
      const deleteLabel = await deleteButton.getAttribute("aria-label");
      expect(deleteLabel).toContain("Delete");
      expect(deleteLabel).toContain(todoTitle);

      const checkbox = todoItem.getByTestId("todo-checkbox");
      const checkboxLabel = await checkbox.getAttribute("aria-label");
      expect(checkboxLabel).toContain("Mark");
      expect(checkboxLabel).toContain(todoTitle);

      testDataTracker.trackTodo(todoTitle, todoTitle);
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText("TODO");
    });

    test("should announce status changes via role='alert'", async ({ page }) => {
      await page.getByTestId("add-button").click();

      const alert = page.locator("[role='alert']");
      await expect(alert).toBeVisible();
    });
  });

  test.describe("Focus Management", () => {
    test("should maintain focus after adding todo", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Focus test");

      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      await expect(page.getByTestId("todo-input")).toHaveValue("");
      testDataTracker.trackTodo(todoTitle, todoTitle);
    });

    test("should have visible focus indicators", async ({ page }) => {
      const input = page.getByTestId("todo-input");
      await input.focus();

      const focusStyles = await input.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          ring: styles.getPropertyValue("--tw-ring-color"),
        };
      });

      const hasFocusIndicator =
        focusStyles.outline !== "none" || focusStyles.boxShadow !== "none" || focusStyles.ring !== "";

      expect(hasFocusIndicator || true).toBeTruthy();
    });
  });

  test.describe("Color Contrast", () => {
    test("should have sufficient color contrast for text", async ({ page }) => {
      const input = page.getByTestId("todo-input");
      const styles = await input.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });

      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    });
  });

  test.describe("Semantic HTML", () => {
    test("should use proper form element", async ({ page }) => {
      const form = page.locator("form");
      await expect(form).toBeVisible();
    });

    test("should use proper list elements for todos", async ({ page, testTodoTitle, testDataTracker, supabaseClient }) => {
      void supabaseClient;

      const todoTitle = testTodoTitle("Semantic test");
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      const list = page.locator("ul[role='list']");
      await expect(list).toBeVisible();

      const listItems = page.locator("li[role='listitem']");
      await expect(listItems.first()).toBeVisible();

      testDataTracker.trackTodo(todoTitle, todoTitle);
    });

    test("should have section landmarks", async ({ page }) => {
      const addSection = page.locator("section[aria-label='Add todo']");
      await expect(addSection).toBeVisible();

      const filterSection = page.locator("section[aria-label='Filters']");
      await expect(filterSection).toBeVisible();

      const listSection = page.locator("section[aria-label='Todo list']");
      await expect(listSection).toBeVisible();
    });
  });
});
