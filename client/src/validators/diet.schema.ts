import { z } from "zod";

export const dietPlanFormSchema = z.object({
  planName: z.string().min(1, "Plan name is required").trim(),
  goal: z.enum([
    "weight_loss",
    "muscle_gain",
    "maintenance",
    "athletic_performance",
  ]),
  calories: z.object({
    daily: z.coerce.number().min(0),
    protein: z.coerce.number().min(0),
    carbs: z.coerce.number().min(0),
    fats: z.coerce.number().min(0),
  }),
  notes: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  isActive: z.boolean().default(true),
});

export type dietPlanFormData = z.infer<typeof dietPlanFormSchema>;

export interface MemberDiet {
  _id: string;
  member: {
    _id: string;
    memberId: string;
    name: string;
  };
  planName: string;
  goal: "weight_loss" | "muscle_gain" | "maintenance" | "athletic_performance";
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
  calories?: {
    daily: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}
