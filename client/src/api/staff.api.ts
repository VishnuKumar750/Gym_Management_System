import api from "@/axios/axios-api";
import type { Staff } from "@/types/staff.types";

export const fetchStaff = async (): Promise<Staff[]> => {
  const { data } = await api.get("/user/staff", {
    withCredentials: true,
  });
  return data.data;
};
