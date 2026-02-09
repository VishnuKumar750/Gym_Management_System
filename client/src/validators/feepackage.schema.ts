import { z } from "zod";

export const packageFormSchema = z.object({
  packageName: z.string().min(1),

  duration: z.coerce.number().min(1),
  price: z.coerce.number().min(0),

  features: z.array(
    z.object({
      value: z.string().min(1),
    }),
  ),

  isActive: z.boolean().default(true),

  description: z.string().optional(),
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;
