import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock Supabase client to prevent network requests in tests
vi.mock("@infrastructure/supabase/client", () => ({
  supabase: {
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: vi.fn() }) }),
      subscribe: () => ({ unsubscribe: vi.fn() }),
    }),
    removeChannel: vi.fn().mockResolvedValue(undefined),
    from: () => {
      const chainable = {
        select: () => chainable,
        insert: () => chainable,
        update: () => chainable,
        delete: () => chainable,
        eq: () => chainable,
        single: () => Promise.resolve({ data: null, error: null }),
        then: (resolve: (value: { data: unknown[]; error: null }) => void) =>
          resolve({ data: [], error: null }),
      };
      return chainable;
    },
  },
}));
