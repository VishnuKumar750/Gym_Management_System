import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/api/analytics.api";
import type { AnalyticsData } from "@/types/analytics.types";

export function useAdminAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ["adminAnalytics"],
    queryFn: getAnalytics,
    refetchInterval: 30_000,
  });
}
