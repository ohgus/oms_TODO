/**
 * Global Teardown
 * Cleans up any orphaned test data after all E2E tests complete
 */

import { createSupabaseTestClient } from "./fixtures/supabase-test-client";

async function globalTeardown(): Promise<void> {
  console.log("\n[Global Teardown] Starting cleanup of orphaned test data...");

  try {
    const client = createSupabaseTestClient();

    // Pattern matches: "Some text 1234567890123" (13-digit timestamp at end)
    const timestampPattern = /\s+\d{13}$/;

    const deletedCount = await client.cleanupTestTodos(timestampPattern);

    if (deletedCount > 0) {
      console.log(`[Global Teardown] Cleaned up ${deletedCount} orphaned test todo(s)`);
    } else {
      console.log("[Global Teardown] No orphaned test data found");
    }
  } catch (error) {
    console.warn("[Global Teardown] Error:", error);
    // Don't fail the test run for cleanup errors
  }
}

export default globalTeardown;
