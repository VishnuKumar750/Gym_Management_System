import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";
import type { INotification } from "@/types/notification.types";

const fetchNotifications = async (): Promise<INotification[]> => {
  const { data } = await api.get("/notification", {
    withCredentials: true,
  });
  return data.data;
};

export function useNotifications() {
  return useQuery<INotification[]>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
