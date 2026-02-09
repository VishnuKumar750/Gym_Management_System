import api from "@/axios/axios-api";
import type { SigninFormValues } from "@/validators/auth/auth.schema";

// SIGNIN
export const signinApi = async (payload: SigninFormValues) => {
  const { data } = await api.post("/auth/signin", payload, {
    withCredentials: true,
  });
  return data;
};
