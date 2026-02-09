import { useQuery } from "@tanstack/react-query";
import { fetchStaff } from "@/api/staff.api";
import type { Staff } from "@/types/staff.types";

export function useStaff() {
  return useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: fetchStaff,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
