import { useQuery } from "@tanstack/react-query";
import type { ISupplement } from "@/types/supplement.types";
import { fetchSupplements } from "@/api/supplement.api";

type Params = {
  sort: string | null;
  status: string | null;
  search: string | null;
};

export function useSupplements({ sort, status, search }: Params) {
  return useQuery<ISupplement[]>({
    queryKey: ["supplements", sort, status, search],
    queryFn: () => fetchSupplements({ sort, status, search }),
    staleTime: 60_000,
  });
}
