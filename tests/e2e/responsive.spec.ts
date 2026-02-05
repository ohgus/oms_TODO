import { test, expect } from "@playwright/test";

test.describe("Mobile-First Responsive Design", () => {
  // Mobile viewports (primary focus)
  const viewports = {
    mobile: { width: 375, height: 667 }, // iPhone SE (reference)
    mobileLarge: { width: 414, height: 896 }, // iPhone 12 Pro
    tablet: { width: 768, height: 1024 }, // iPad
    desktop: { width: 1280, height: 720 }, // Desktop
  };

  test.describe("Mobile (375px) - Primary Viewport", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto("/");
      await expect(page.getByTestId("home-page")).toBeVisible();
    });

    test("should render correctly on mobile viewport", async ({ page }) => {
      // Take screenshot for visual verification
      await page.screenshot({ path: "tests/e2e/screenshots/mobile-375.png" });

      // Verify main elements are visible
      await expect(page.getByTestId("todo-input")).toBeVisible();
      await expect(page.getByTestId("add-button")).toBeVisible();
      await expect(page.getByTestId("status-filter")).toBeVisible();
    });

    test("should have no horizontal scroll on mobile", async ({ page }) => {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    test("should have touch-friendly button sizes (min 44px)", async ({ page }) => {
      // Check add button size
      const addButton = page.getByTestId("add-button");
      const addBox = await addButton.boundingBox();
      expect(addBox?.height).toBeGreaterThanOrEqual(44);
      expect(addBox?.width).toBeGreaterThanOrEqual(44);

      // Check filter buttons
      const filterAll = page.getByTestId("filter-all");
      const filterBox = await filterAll.boundingBox();
      expect(filterBox?.height).toBeGreaterThanOrEqual(44);
    });

    test("should display single-column layout on mobile", async ({ page }) => {
      // Add a todo to verify layout
      const todoTitle = "Mobile layout test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Verify todo item fits within viewport
      const todoItem = page.getByTestId("todo-item").first();
      const todoBox = await todoItem.boundingBox();
      expect(todoBox?.width).toBeLessThanOrEqual(viewports.mobile.width);
    });

    test("should have readable font sizes (min 14px)", async ({ page }) => {
      const todoInput = page.getByTestId("todo-input");
      const fontSize = await todoInput.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      const fontSizeValue = parseInt(fontSize, 10);
      expect(fontSizeValue).toBeGreaterThanOrEqual(14);
    });
  });

  test.describe("Mobile Large (414px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobileLarge);
      await page.goto("/");
      await expect(page.getByTestId("home-page")).toBeVisible();
    });

    test("should render correctly on large mobile viewport", async ({ page }) => {
      await page.screenshot({ path: "tests/e2e/screenshots/mobile-414.png" });

      await expect(page.getByTestId("todo-input")).toBeVisible();
      await expect(page.getByTestId("add-button")).toBeVisible();
    });

    test("should have no horizontal scroll on large mobile", async ({ page }) => {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  });

  test.describe("Tablet (768px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await page.goto("/");
      await expect(page.getByTestId("home-page")).toBeVisible();
    });

    test("should render correctly on tablet viewport", async ({ page }) => {
      await page.screenshot({ path: "tests/e2e/screenshots/tablet-768.png" });

      await expect(page.getByTestId("todo-input")).toBeVisible();
      await expect(page.getByTestId("add-button")).toBeVisible();
    });

    test("should show expanded button text on tablet", async ({ page }) => {
      // On tablet/desktop, "Add" text should be visible
      const addButton = page.getByTestId("add-button");
      const buttonText = await addButton.innerText();
      expect(buttonText).toContain("Add");
    });
  });

  test.describe("Desktop (1280px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.goto("/");
      await expect(page.getByTestId("home-page")).toBeVisible();
    });

    test("should render correctly on desktop viewport", async ({ page }) => {
      await page.screenshot({ path: "tests/e2e/screenshots/desktop-1280.png" });

      await expect(page.getByTestId("todo-input")).toBeVisible();
      await expect(page.getByTestId("add-button")).toBeVisible();
    });

    test("should center content with max-width on desktop", async ({ page }) => {
      const container = page.locator(".max-w-2xl");
      const containerBox = await container.boundingBox();

      // Container should be centered (not full width)
      expect(containerBox?.width).toBeLessThan(viewports.desktop.width);
    });
  });

  test.describe("Responsive Interactions", () => {
    test("should work correctly across viewport changes", async ({ page }) => {
      // Start on mobile
      await page.setViewportSize(viewports.mobile);
      await page.goto("/");

      // Add a todo on mobile
      const todoTitle = "Responsive test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Resize to desktop
      await page.setViewportSize(viewports.desktop);
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Resize back to mobile
      await page.setViewportSize(viewports.mobile);
      await expect(page.getByText(todoTitle)).toBeVisible();
    });

    test("should maintain functionality on all viewports", async ({ page }) => {
      for (const [name, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        await page.goto("/");

        // Verify basic functionality
        await expect(page.getByTestId("todo-input")).toBeVisible();
        await expect(page.getByTestId("add-button")).toBeEnabled();
        await expect(page.getByTestId("status-filter")).toBeVisible();

        // Take screenshot for each viewport
        await page.screenshot({
          path: `tests/e2e/screenshots/viewport-${name}.png`,
        });
      }
    });
  });

  test.describe("Touch Target Verification", () => {
    test("should have adequate touch targets for all interactive elements", async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto("/");

      // Add a todo to test todo item buttons
      const todoTitle = "Touch target test " + Date.now();
      await page.getByTestId("todo-input").fill(todoTitle);
      await page.getByTestId("add-button").click();
      await expect(page.getByText(todoTitle)).toBeVisible();

      // Check checkbox touch target
      const checkbox = page.getByTestId("checkbox-wrapper").first();
      const checkboxBox = await checkbox.boundingBox();
      expect(checkboxBox?.height).toBeGreaterThanOrEqual(44);
      expect(checkboxBox?.width).toBeGreaterThanOrEqual(44);

      // Check delete button touch target
      const deleteButton = page.getByTestId("delete-button").first();
      const deleteBox = await deleteButton.boundingBox();
      expect(deleteBox?.height).toBeGreaterThanOrEqual(44);
      expect(deleteBox?.width).toBeGreaterThanOrEqual(44);

      // Check edit button touch target
      const editButton = page.getByTestId("edit-button").first();
      const editBox = await editButton.boundingBox();
      expect(editBox?.height).toBeGreaterThanOrEqual(44);
      expect(editBox?.width).toBeGreaterThanOrEqual(44);
    });
  });
});
