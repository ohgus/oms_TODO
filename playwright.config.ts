import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load environment variables for Supabase access in tests
dotenv.config({ path: ".env.local" });

export default defineConfig({
  testDir: "./tests/e2e",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 3,
  workers: process.env.CI ? 1 : 2,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  // Mobile-First: 모바일 테스트를 먼저 실행
  projects: [
    {
      name: "Mobile Chrome",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"], browserName: "webkit" },
    },
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
