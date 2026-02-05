export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
}

const DEFAULT_COLOR = "#6366f1";
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

function generateId(): string {
  return crypto.randomUUID();
}

function validateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error("Category name is required");
  }
}

function validateColor(color: string): void {
  if (!HEX_COLOR_REGEX.test(color)) {
    throw new Error("Invalid color format");
  }
}

export function createCategory(input: CreateCategoryInput): Category {
  validateName(input.name);

  const color = input.color ?? DEFAULT_COLOR;
  if (input.color !== undefined) {
    validateColor(color);
  }

  return {
    id: generateId(),
    name: input.name.trim(),
    color,
    createdAt: new Date(),
  };
}
