import api from "@/axios/axios-api";
import type { PackageFormValues } from "@/validators/feepackage.schema";

// GET PACKAGES
export const getPackages = async () => {
  const res = await api.get("/packages", { withCredentials: true });
  return res.data.data;
};

// POST PACKAGES
export const postPackges = async (data: PackageFormValues) => {
  const payload = {
    ...data,
    packageName: data.packageName.trim(),
    description: data.description?.trim(),
    features: data.features.map((f) => f.value.trim()),
  };

  const res = await api.post("/packages", payload, {
    withCredentials: true,
  });

  return res.data;
};

// DELETE PACKAGE
export const deletePackage = async (id: string) => {
  const res = await api.delete(`/packages/${id}`, { withCredentials: true });
  return res.data.data;
};

// GET SINGLE PACKAGES
export const getPackage = async (id: string) => {
  const res = await api.get(`/packages/${id}`, { withCredentials: true });
  return res.data.data;
};

// UPDATE PACKAGE
export const updatePackge = async (
  id: string,
  data: Record<string, string>,
) => {
  const res = await api.put(`/packages/${id}`, data, { withCredentials: true });
  return res.data.data;
};
