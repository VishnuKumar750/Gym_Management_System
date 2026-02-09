import api from "@/axios/axios-api";
import type { MemberFormData } from "@/validators/user/user.schema";

// api function
export const getMembers = async () => {
  const { data } = await api.get("/user/members", {
    withCredentials: true,
  });
  return data.data;
};

// GET MEMBER BILLS
export const getMemberBills = async () => {
  const res = await api.get("/bills/member", { withCredentials: true });
  return res.data.data;
};

// GET MEMBER ANALYTICS
export const getMemberAnalytics = async () => {
  const res = await api.get("/user/member/analytics", {
    withCredentials: true,
  });
  return res.data.data;
};

// GET STAFF ANALYTICS
export const getStaffAnalytics = async () => {
  const res = await api.get("/user/staff/analytics", { withCredentials: true });
  return res.data.data;
};

export const postMember = async (data: MemberFormData) => {
  const res = await api.post("/api/members", data, { withCredentials: true });
  return res.data.data;
};

export const createUser = async (data: MemberFormData) => {
  const res = await api.post("/user/members", data);
  return res.data;
};
