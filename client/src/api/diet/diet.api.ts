import api from "@/axios/axios-api";
import type { dietPlanFormData, MemberDiet } from "@/validators/diet.schema";

export const createDietPlan = async ({
  id,
  data,
}: {
  id: string;
  data: dietPlanFormData;
}) => {
  const res = await api.post(
    `/dietPlan/${id}`,
    {
      ...data,
    },
    { withCredentials: true },
  );

  return res.data;
};

// GET DIETS
export const getDiets = async (): Promise<MemberDiet[]> => {
  const { data } = await api.get("/dietPlan", {
    withCredentials: true,
  });
  console.log("diets", data.data);
  return data.data;
};
