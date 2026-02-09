import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";
import type { Member } from "@/types/member.types";

const fetchMembers = async (): Promise<Member[]> => {
  const { data } = await api.get("/user/members", {
    withCredentials: true,
  });
  return data.data;
};

export function useMembers() {
  return useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: fetchMembers,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
