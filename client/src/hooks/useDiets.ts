import { useQuery } from "@tanstack/react-query";
import { getDiets } from "@/api/diet/diet.api";
import type { MemberDiet } from "@/validators/diet.schema";

export function useDiets() {
  return useQuery<MemberDiet[]>({
    queryKey: ["diets"],
    queryFn: getDiets,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
