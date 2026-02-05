/**
 * Test Data Tracker
 * Tracks created test items for cleanup after each test
 */

export const TEST_DATA_PREFIX = "E2E_TEST_";

export interface TrackedItem {
  id: string;
  type: "todo" | "category";
  title: string;
  createdAt: Date;
}

export class TestDataTracker {
  private items: TrackedItem[] = [];

  trackTodo(id: string, title: string): void {
    this.items.push({
      id,
      type: "todo",
      title,
      createdAt: new Date(),
    });
  }

  trackCategory(id: string, name: string): void {
    this.items.push({
      id,
      type: "category",
      title: name,
      createdAt: new Date(),
    });
  }

  getTrackedItems(): TrackedItem[] {
    return [...this.items];
  }

  getTodoIds(): string[] {
    return this.items.filter((item) => item.type === "todo").map((item) => item.id);
  }

  getCategoryIds(): string[] {
    return this.items.filter((item) => item.type === "category").map((item) => item.id);
  }

  clear(): void {
    this.items = [];
  }

  static isTestData(title: string): boolean {
    return title.startsWith(TEST_DATA_PREFIX) || /\s+\d{13}$/.test(title);
  }
}
