import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// Create a mock client for test environments
const createMockClient = (): SupabaseClient => {
  return {
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    }),
    removeChannel: () => Promise.resolve(),
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
  } as unknown as SupabaseClient;
};

const isValidConfig = supabaseUrl && supabaseAnonKey;

export const supabase: SupabaseClient = isValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();
