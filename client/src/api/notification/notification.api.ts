import api from "@/axios/axios-api";

// Fetch notifications
export const fetchNotifications = async () => {
  const { data } = await api.get("/notification/member-notification", {
    withCredentials: true,
  });
  return data.data;
};
