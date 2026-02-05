import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.stories.{ts,tsx}", "src/**/*.d.ts"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/**/*.{test,spec}.{ts,tsx}"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
          passWithNoTests: true,
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@domain": path.resolve(dirname, "./src/domain"),
      "@data": path.resolve(dirname, "./src/data"),
      "@presentation": path.resolve(dirname, "./src/presentation"),
      "@infrastructure": path.resolve(dirname, "./src/infrastructure"),
      "@shared": path.resolve(dirname, "./src/shared"),
    },
  },
});
