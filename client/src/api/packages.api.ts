import api from "@/axios/axios-api";
import type { IPackage } from "@/types/package.types";

export const fetchPackages = async (): Promise<IPackage[]> => {
  const { data } = await api.get("/packages", {
    withCredentials: true,
  });

  return data.data;
};
