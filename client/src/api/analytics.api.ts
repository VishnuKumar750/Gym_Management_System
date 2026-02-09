import api from "@/axios/axios-api";

// GET ADMIN ANALYTICS
export const getAnalytics = async () => {
  const res = await api.get("/user/admin/analytics/", {
    withCredentials: true,
  });
  return res.data.data;
};
