/**
 * Custom Playwright Fixtures
 * Extends Playwright test with automatic test data cleanup
 */

/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { TestDataTracker } from "./test-data-tracker";
import { createSupabaseTestClient, type SupabaseTestClient } from "./supabase-test-client";

export interface TestFixtures {
  testDataTracker: TestDataTracker;
  supabaseClient: SupabaseTestClient;
  testTodoTitle: (suffix?: string) => string;
  createTestTodo: (title?: string, options?: { dueDate?: string }) => Promise<string>;
}

export const test = base.extend<TestFixtures>({
  // eslint-disable-next-line no-empty-pattern
  testDataTracker: async ({}, use) => {
    const tracker = new TestDataTracker();
    await use(tracker);
  },

  supabaseClient: async ({ testDataTracker }, use) => {
    const client = createSupabaseTestClient();

    await use(client);

    // Cleanup after test completes (even if test fails)
    // Uses pattern-based cleanup since we track by title, not actual UUIDs
    try {
      const trackedItems = testDataTracker.getTrackedItems();

      if (trackedItems.length > 0) {
        // Use pattern-based cleanup for test data
        const deletedCount = await client.cleanupTestTodos(/\s+\d{13}$/);
        if (deletedCount > 0) {
          console.log(`Cleaned up ${deletedCount} test todo(s)`);
        }
      }
    } catch (error) {
      console.warn("Cleanup failed:", error);
    }

    testDataTracker.clear();
  },

  // eslint-disable-next-line no-empty-pattern
  testTodoTitle: async ({}, use) => {
    const generator = (suffix?: string): string => {
      const timestamp = Date.now();
      const base = suffix ? `${suffix} ` : "Test todo ";
      return `${base}${timestamp}`;
    };

    await use(generator);
  },

  createTestTodo: async ({ page, testDataTracker, testTodoTitle }, use) => {
    const createTodo = async (
      title?: string,
      options?: { dueDate?: string }
    ): Promise<string> => {
      const todoTitle = title || testTodoTitle();

      // Default dueDate to today so the todo appears in the "오늘" tab
      const today = new Date();
      const dueDate =
        options?.dueDate ??
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // Open modal
      await page.getByTestId("add-todo-button").click();
      await page.getByTestId("todo-title-input").waitFor({ state: "visible" });

      // Fill title
      await page.getByTestId("todo-title-input").fill(todoTitle);

      // Fill due date
      await page.locator("#todo-due-date").fill(dueDate);

      // Submit
      await page.getByTestId("todo-submit-button").click();

      // Wait for todo to appear in the list (use todo-item to avoid strict mode violation
      // when the same text appears in multiple sections like calendar's "this week")
      await page
        .getByTestId("todo-item")
        .filter({ hasText: todoTitle })
        .first()
        .waitFor({ state: "visible" });

      // Wait for any pending realtime events / query refetches to settle
      await page.waitForTimeout(500);

      // Track by title for pattern-based cleanup
      testDataTracker.trackTodo(todoTitle, todoTitle);

      return todoTitle;
    };

    await use(createTodo);
  },
});

export { expect } from "@playwright/test";
