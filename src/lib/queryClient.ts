import { QueryClient } from "@tanstack/react-query";

export const QUERY_TIMES = {
  TEN_SECONDS: 10 * 1000,
  THIRTY_SECONDS: 30 * 1000,
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: QUERY_TIMES.FIVE_MINUTES,
      gcTime: QUERY_TIMES.THIRTY_MINUTES,
      select: (data) => (data as { data?: unknown }).data ?? data,
    },
  },
});
