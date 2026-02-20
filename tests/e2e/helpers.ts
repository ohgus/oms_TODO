import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Toggle a checkbox to checked state.
 *
 * Clicks the checkbox-wrapper (44×44px touch target) instead of the
 * tiny checkbox button (16×16px) for more reliable interaction on
 * mobile viewports. Uses a generous timeout for mutation round-trip.
 */
export async function checkTodo(todoItem: Locator, page: Page): Promise<void> {
  void page;
  const wrapper = todoItem.getByTestId("checkbox-wrapper");
  const checkbox = todoItem.getByTestId("todo-checkbox");
  await wrapper.click();
  await expect(checkbox).toBeChecked({ timeout: 20000 });
}

/**
 * Toggle a checkbox to unchecked state.
 */
export async function uncheckTodo(todoItem: Locator, page: Page): Promise<void> {
  void page;
  const wrapper = todoItem.getByTestId("checkbox-wrapper");
  const checkbox = todoItem.getByTestId("todo-checkbox");
  await wrapper.click();
  await expect(checkbox).not.toBeChecked({ timeout: 20000 });
}
