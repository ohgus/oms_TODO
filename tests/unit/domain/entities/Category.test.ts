import { describe, it, expect } from "vitest";
import { createCategory } from "@domain/entities/Category";

describe("Category Entity", () => {
  describe("createCategory", () => {
    it("should create a category with required fields", () => {
      const category = createCategory({
        name: "Work",
      });

      expect(category.id).toBeDefined();
      expect(category.name).toBe("Work");
      expect(category.color).toBe("#6366f1"); // default color
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    it("should create a category with custom color", () => {
      const category = createCategory({
        name: "Personal",
        color: "#ef4444",
      });

      expect(category.color).toBe("#ef4444");
    });

    it("should throw error when name is empty", () => {
      expect(() => createCategory({ name: "" })).toThrow("Category name is required");
    });

    it("should throw error when name is only whitespace", () => {
      expect(() => createCategory({ name: "   " })).toThrow("Category name is required");
    });

    it("should generate unique ids for each category", () => {
      const category1 = createCategory({ name: "Work" });
      const category2 = createCategory({ name: "Personal" });

      expect(category1.id).not.toBe(category2.id);
    });

    it("should throw error when color is invalid hex format", () => {
      expect(() => createCategory({ name: "Work", color: "red" })).toThrow(
        "Invalid color format"
      );
      expect(() => createCategory({ name: "Work", color: "#gg0000" })).toThrow(
        "Invalid color format"
      );
    });

    it("should accept valid hex color formats", () => {
      const category1 = createCategory({ name: "Work", color: "#fff" });
      const category2 = createCategory({ name: "Personal", color: "#ffffff" });

      expect(category1.color).toBe("#fff");
      expect(category2.color).toBe("#ffffff");
    });
  });
});
