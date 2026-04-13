import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 min
      gcTime: 1000 * 60 * 30, // 30 minutes - cache persists for 30 min
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus (can be enabled per-query)
      refetchOnReconnect: true, // Refetch when reconnecting
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});
