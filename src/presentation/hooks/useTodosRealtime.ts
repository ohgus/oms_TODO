import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@infrastructure/supabase/client";

const TODOS_QUERY_KEY = "todos";

// Check if we have valid Supabase config
const isValidConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useTodosRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Skip realtime subscription in test environment or when config is missing
    if (!isValidConfig) {
      return;
    }

    const channel = supabase
      .channel("todos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        () => {
          // Invalidate and refetch todos when any change occurs
          queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
