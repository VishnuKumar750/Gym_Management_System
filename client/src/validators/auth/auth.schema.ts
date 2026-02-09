import { z } from "zod";
export const signinSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .toLowerCase()
    .trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
});

export type SigninFormValues = z.infer<typeof signinSchema>;
