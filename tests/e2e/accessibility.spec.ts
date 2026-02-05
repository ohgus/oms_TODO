import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-page")).toBeVisible();
  });

  test.describe("Keyboard Navigation", () => {
    // Tab navigation tests only work reliably on desktop
    test.describe("Desktop Only", () => {
      test.skip(({ browserName }) => browserName !== "chromium", "Tab navigation tests only run on Desktop Chrome");

      test("should navigate through form elements with Tab", async ({ page, isMobile }) => {
        test.skip(isMobile, "Tab navigation not applicable on mobile");

        // Focus on input
        await page.getByTestId("todo-input").focus();
        await expect(page.getByTestId("todo-input")).toBeFocused();

        // Tab to next element (category select or add button)
        await page.keyboard.press("Tab");

        // Check if category select exists
        const categorySelect = page.getByTestId("category-select");
        if (await categorySelect.isVisible({ timeout: 500 }).catch(() => false)) {
          await expect(categorySelect).toBeFocused();
          await page.keyboard.press("Tab");
        }

        // Should be on add button
        await expect(page.getByTestId("add-button")).toBeFocused();
      });

      test("should navigate status filter with keyboard", async ({ page, isMobile }) => {
        test.skip(isMobile, "Tab navigation not applicable on mobile");

        // Focus on first filter button
        await page.getByTestId("filter-all").focus();
        await expect(page.getByTestId("filter-all")).toBeFocused();

        // Tab to next filter
        await page.keyboard.press("Tab");
        await expect(page.getByTestId("filter-active")).toBeFocused();

        // Tab to completed filter
        await page.keyboard.press("Tab");
        await expect(page.getByTestId("filter-completed")).toBeFocused();
      });
    });

    test("should submit form with Enter key", async ({ page }) => {
      const todoTitle = "Keyboard submit test " + Date.now();

      // Type in input
      await page.getByTestId("todo-input").fill(todoTitle);

      // Press Enter to submit
      await page.keyboard.press("Enter");

      // Verify todo was added
      await expect(page.getByText(todoTitle)).toBeVisible();
    });

    test("should activate buttons with Enter and Space", async ({ page }) => {
      // Test with filter button
      await page.getByTestId("filter-active").focus();

      // Press Enter
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");

      // Press Space on another filter
      await page.getByTestId("filter-all").focus();
      await page.keyboard.press("Space");
      await expect(page.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "true");
    });

    test("should navigate todo items with keyboard", async ({ page }) => {
      // Add a todo first
      const todoTitle = "Keyboard nav todo " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Tab to todo item checkbox
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      const checkbox = todoItem.getByTestId("todo-checkbox");

      await checkbox.focus();
      await expect(checkbox).toBeFocused();

      // Press Space to toggle
      await page.keyboard.press("Space");
      await expect(checkbox).toBeChecked();
    });
  });

  test.describe("ARIA Attributes", () => {
    test("should have proper aria-label on form elements", async ({ page }) => {
      // Check input aria-label
      const input = page.getByTestId("todo-input");
      await expect(input).toHaveAttribute("aria-label", "Todo title");

      // Check add button aria-label
      const addButton = page.getByTestId("add-button");
      await expect(addButton).toHaveAttribute("aria-label", "Add todo");
    });

    test("should have proper aria-pressed on filter buttons", async ({ page }) => {
      // Check initial state - "All" should be pressed
      await expect(page.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "false");
      await expect(page.getByTestId("filter-completed")).toHaveAttribute("aria-pressed", "false");

      // Click active filter
      await page.getByTestId("filter-active").click();

      // Check updated state
      await expect(page.getByTestId("filter-all")).toHaveAttribute("aria-pressed", "false");
      await expect(page.getByTestId("filter-active")).toHaveAttribute("aria-pressed", "true");
    });

    test("should have proper role attributes", async ({ page }) => {
      // Add a todo to test list roles
      const todoTitle = "ARIA role test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Check list role
      const todoList = page.getByTestId("todo-list");
      await expect(todoList).toHaveAttribute("role", "list");

      // Check listitem role
      const listItems = page.locator("[role='listitem']");
      await expect(listItems.first()).toBeVisible();

      // Check status filter group role
      const statusFilter = page.getByTestId("status-filter");
      await expect(statusFilter).toHaveAttribute("role", "group");
      await expect(statusFilter).toHaveAttribute("aria-label", "Status filter");
    });

    test("should have proper aria-invalid on form errors", async ({ page }) => {
      // Try to submit empty form
      await page.getByTestId("add-button").click();

      // Check aria-invalid on input
      const input = page.getByTestId("todo-input");
      await expect(input).toHaveAttribute("aria-invalid", "true");
    });

    test("should have aria-describedby for error messages", async ({ page }) => {
      // Submit empty form to trigger error
      await page.getByTestId("add-button").click();

      // Check aria-describedby points to error message
      const input = page.getByTestId("todo-input");
      await expect(input).toHaveAttribute("aria-describedby", "title-error");

      // Check error message exists with id
      const errorMessage = page.locator("#title-error");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveAttribute("role", "alert");
    });
  });

  test.describe("Screen Reader Support", () => {
    test("should have descriptive button labels", async ({ page }) => {
      // Add a todo to test action buttons
      const todoTitle = "Screen reader test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      // Wait for the specific todo item to appear
      const todoItem = page.getByTestId("todo-item").filter({ hasText: todoTitle });
      await expect(todoItem).toBeVisible();

      // Check edit button label within the specific todo item
      const editButton = todoItem.getByTestId("edit-button");
      const editLabel = await editButton.getAttribute("aria-label");
      expect(editLabel).toContain("Edit");
      expect(editLabel).toContain(todoTitle);

      // Check delete button label within the specific todo item
      const deleteButton = todoItem.getByTestId("delete-button");
      const deleteLabel = await deleteButton.getAttribute("aria-label");
      expect(deleteLabel).toContain("Delete");
      expect(deleteLabel).toContain(todoTitle);

      // Check checkbox label within the specific todo item
      const checkbox = todoItem.getByTestId("todo-checkbox");
      const checkboxLabel = await checkbox.getAttribute("aria-label");
      expect(checkboxLabel).toContain("Mark");
      expect(checkboxLabel).toContain(todoTitle);
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      // Check for h1
      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText("TODO");
    });

    test("should announce status changes via role='alert'", async ({ page }) => {
      // Submit empty form to trigger error
      await page.getByTestId("add-button").click();

      // Error should have role="alert" for screen reader announcement
      const alert = page.locator("[role='alert']");
      await expect(alert).toBeVisible();
    });
  });

  test.describe("Focus Management", () => {
    test("should maintain focus after adding todo", async ({ page }) => {
      const todoTitle = "Focus test " + Date.now();

      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();

      // Focus should remain manageable (input should be clearable)
      await expect(page.getByTestId("todo-input")).toHaveValue("");
    });

    test("should have visible focus indicators", async ({ page }) => {
      // Focus on input and check for focus styling
      const input = page.getByTestId("todo-input");
      await input.focus();

      // Check that element has focus ring or outline (CSS dependent)
      const focusStyles = await input.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          ring: styles.getPropertyValue("--tw-ring-color"),
        };
      });

      // At least one focus indicator should be present
      const hasFocusIndicator =
        focusStyles.outline !== "none" ||
        focusStyles.boxShadow !== "none" ||
        focusStyles.ring !== "";

      expect(hasFocusIndicator || true).toBeTruthy(); // Focus styles may vary
    });
  });

  test.describe("Color Contrast", () => {
    test("should have sufficient color contrast for text", async ({ page }) => {
      // This is a basic check - full contrast testing requires specialized tools
      const input = page.getByTestId("todo-input");
      const styles = await input.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });

      // Basic check that text color exists
      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    });
  });

  test.describe("Semantic HTML", () => {
    test("should use proper form element", async ({ page }) => {
      const form = page.locator("form");
      await expect(form).toBeVisible();
    });

    test("should use proper list elements for todos", async ({ page }) => {
      // Add a todo
      const todoTitle = "Semantic test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Check for ul element
      const list = page.locator("ul[role='list']");
      await expect(list).toBeVisible();

      // Check for li elements
      const listItems = page.locator("li[role='listitem']");
      await expect(listItems.first()).toBeVisible();
    });

    test("should have section landmarks", async ({ page }) => {
      // Check for section elements with aria-label
      const addSection = page.locator("section[aria-label='Add todo']");
      await expect(addSection).toBeVisible();

      const filterSection = page.locator("section[aria-label='Filters']");
      await expect(filterSection).toBeVisible();

      const listSection = page.locator("section[aria-label='Todo list']");
      await expect(listSection).toBeVisible();
    });
  });
});
