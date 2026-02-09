import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";
import type { IBill } from "@/types/bill.types";

const fetchBills = async (): Promise<IBill[]> => {
  const { data } = await api.get("/bills/admin", {
    withCredentials: true,
  });
  return data.data;
};

export function useBills() {
  return useQuery<IBill[]>({
    queryKey: ["bills", "admin"],
    queryFn: fetchBills,
  });
}
