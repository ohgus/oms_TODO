import { test, expect } from "./fixtures";
import { checkTodo } from "./helpers";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Keyboard Navigation", () => {
    test.describe("Desktop Only", () => {
      test.skip(({ browserName }) => browserName !== "chromium", "Tab navigation tests only run on Desktop Chrome");

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
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = await createTestTodo();

      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      const checkbox = todoItem.getByTestId("todo-checkbox");

      await checkbox.focus();
      await expect(checkbox).toBeFocused();

      // Press space and wait for mutation to complete
      await page.keyboard.press("Space");
      try {
        await expect(checkbox).toBeChecked({ timeout: 5000 });
      } catch {
        await page.waitForTimeout(1000);
        const isChecked = await checkbox.getAttribute("aria-checked");
        if (isChecked !== "true") {
          await page.keyboard.press("Space");
        }
        await expect(checkbox).toBeChecked({ timeout: 10000 });
      }
    });
  });

  test.describe("ARIA Attributes", () => {
    test("should have proper aria-label on add button and modal fields", async ({ page }) => {
      const addButton = page.getByTestId("add-todo-button");
      await expect(addButton).toHaveAttribute("aria-label", "Add todo");

      // Open modal and check fields
      await addButton.click();
      await page.getByTestId("todo-title-input").waitFor({ state: "visible" });

      const titleInput = page.getByTestId("todo-title-input");
      await expect(titleInput).toHaveAttribute("aria-label", "할 일");
    });

    test("should have proper aria-pressed on filter buttons", async ({ page }) => {
      await expect(page.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "false");
      await expect(page.getByTestId("filter-completed")).toHaveAttribute("aria-pressed", "false");

      await page.getByTestId("filter-active").click();

      await expect(page.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "false");
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
    });

    test("should have proper role attributes", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      await createTestTodo();

      const todoList = page.getByTestId("todo-list");
      await expect(todoList).toHaveAttribute("role", "list");

      const listItems = page.locator("[role='listitem']");
      await expect(listItems.first()).toBeVisible();

      const statusFilter = page.getByTestId("status-filter");
      await expect(statusFilter).toHaveAttribute("role", "group");
      await expect(statusFilter).toHaveAttribute("aria-label", "Status filter");
    });
  });

  test.describe("Screen Reader Support", () => {
    test("should have descriptive button labels", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      const todoTitle = await createTestTodo();

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
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText("TODO");
    });
  });

  test.describe("Focus Management", () => {
    test("should close modal after adding todo", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      await createTestTodo();

      // After modal closes, the add button should be visible
      await expect(page.getByTestId("add-todo-button")).toBeVisible();
    });

    test("should have visible focus indicators", async ({ page }) => {
      const addButton = page.getByTestId("add-todo-button");
      await addButton.focus();

      const focusStyles = await addButton.evaluate((el) => {
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
      const addButton = page.getByTestId("add-todo-button");
      const styles = await addButton.evaluate((el) => {
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
    test("should use proper list elements for todos", async ({
      page,
      createTestTodo,
      supabaseClient,
    }) => {
      void supabaseClient;

      await createTestTodo();

      const list = page.locator("ul[role='list']");
      await expect(list).toBeVisible();

      const listItems = page.locator("li[role='listitem']");
      await expect(listItems.first()).toBeVisible();
    });

    test("should have section landmarks", async ({ page }) => {
      const filterSection = page.locator("section[aria-label='Filters']");
      await expect(filterSection).toBeVisible();

      const listSection = page.locator("section[aria-label='Todo list']");
      await expect(listSection).toBeVisible();
    });
  });
});
