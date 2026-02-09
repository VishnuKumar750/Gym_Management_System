import { z } from "zod";

// Zod Schema
export const memberFormSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["male", "female", "other"]),
  assignedPackage: z.string(),
});

export type MemberFormData = z.infer<typeof memberFormSchema>;
