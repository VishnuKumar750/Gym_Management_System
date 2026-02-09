import { useQuery } from "@tanstack/react-query";
import { fetchPackages } from "@/api/packages.api";
import type { IPackage } from "@/types/package.types";

export function usePackages() {
  return useQuery<IPackage[]>({
    queryKey: ["packages"],
    queryFn: fetchPackages,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
