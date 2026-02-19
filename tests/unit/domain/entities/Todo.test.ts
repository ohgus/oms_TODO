import { describe, it, expect } from "vitest";
import { createTodo, toggleTodoComplete, updateTodo } from "@domain/entities/Todo";

describe("Todo Entity", () => {
  describe("createTodo", () => {
    it("should create a todo with required fields", () => {
      const todo = createTodo({
        title: "Test Todo",
      });

      expect(todo.id).toBeDefined();
      expect(todo.title).toBe("Test Todo");
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.updatedAt).toBeInstanceOf(Date);
    });

    it("should create a todo with optional fields", () => {
      const todo = createTodo({
        title: "Test Todo",
        description: "Test Description",
        categoryId: "category-1",
      });

      expect(todo.description).toBe("Test Description");
      expect(todo.categoryId).toBe("category-1");
    });

    it("should throw error when title is empty", () => {
      expect(() => createTodo({ title: "" })).toThrow("Title is required");
    });

    it("should throw error when title is only whitespace", () => {
      expect(() => createTodo({ title: "   " })).toThrow("Title is required");
    });

    it("should generate unique ids for each todo", () => {
      const todo1 = createTodo({ title: "Todo 1" });
      const todo2 = createTodo({ title: "Todo 2" });

      expect(todo1.id).not.toBe(todo2.id);
    });

    it("should default priority to 2 when not specified", () => {
      const todo = createTodo({ title: "Test Todo" });

      expect(todo.priority).toBe(2);
    });

    it("should set priority when specified", () => {
      const todo = createTodo({ title: "Test Todo", priority: 3 });

      expect(todo.priority).toBe(3);
    });

    it("should set priority to 1 when specified", () => {
      const todo = createTodo({ title: "Test Todo", priority: 1 });

      expect(todo.priority).toBe(1);
    });

    it("should set dueDate when specified", () => {
      const dueDate = new Date("2026-03-15");
      const todo = createTodo({ title: "Test Todo", dueDate });

      expect(todo.dueDate).toEqual(dueDate);
    });

    it("should leave dueDate undefined when not specified", () => {
      const todo = createTodo({ title: "Test Todo" });

      expect(todo.dueDate).toBeUndefined();
    });
  });

  describe("toggleTodoComplete", () => {
    it("should toggle completed status from false to true", () => {
      const todo = createTodo({ title: "Test Todo" });
      const toggled = toggleTodoComplete(todo);

      expect(toggled.completed).toBe(true);
      expect(toggled.updatedAt.getTime()).toBeGreaterThanOrEqual(todo.updatedAt.getTime());
    });

    it("should toggle completed status from true to false", () => {
      const todo = createTodo({ title: "Test Todo" });
      const completed = toggleTodoComplete(todo);
      const uncompleted = toggleTodoComplete(completed);

      expect(uncompleted.completed).toBe(false);
    });

    it("should not mutate the original todo", () => {
      const todo = createTodo({ title: "Test Todo" });
      const toggled = toggleTodoComplete(todo);

      expect(todo.completed).toBe(false);
      expect(toggled.completed).toBe(true);
    });
  });

  describe("updateTodo", () => {
    it("should update todo title", () => {
      const todo = createTodo({ title: "Original Title" });
      const updated = updateTodo(todo, { title: "Updated Title" });

      expect(updated.title).toBe("Updated Title");
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(todo.updatedAt.getTime());
    });

    it("should update todo description", () => {
      const todo = createTodo({ title: "Test Todo" });
      const updated = updateTodo(todo, { description: "New Description" });

      expect(updated.description).toBe("New Description");
    });

    it("should update todo categoryId", () => {
      const todo = createTodo({ title: "Test Todo" });
      const updated = updateTodo(todo, { categoryId: "new-category" });

      expect(updated.categoryId).toBe("new-category");
    });

    it("should update todo priority", () => {
      const todo = createTodo({ title: "Test Todo" });
      const updated = updateTodo(todo, { priority: 3 });

      expect(updated.priority).toBe(3);
    });

    it("should update todo dueDate", () => {
      const todo = createTodo({ title: "Test Todo" });
      const dueDate = new Date("2026-04-01");
      const updated = updateTodo(todo, { dueDate });

      expect(updated.dueDate).toEqual(dueDate);
    });

    it("should remove dueDate when set to null", () => {
      const todo = createTodo({ title: "Test Todo", dueDate: new Date("2026-03-15") });
      const updated = updateTodo(todo, { dueDate: null });

      expect(updated.dueDate).toBeUndefined();
    });

    it("should throw error when updating with empty title", () => {
      const todo = createTodo({ title: "Test Todo" });

      expect(() => updateTodo(todo, { title: "" })).toThrow("Title is required");
    });

    it("should not mutate the original todo", () => {
      const todo = createTodo({ title: "Original" });
      const updated = updateTodo(todo, { title: "Updated" });

      expect(todo.title).toBe("Original");
      expect(updated.title).toBe("Updated");
    });
  });
});
