import z from 'zod'

// member scheme
export const MemberSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  feePackageId: z.string().optional(),
  assignedPackage: z
    .object({
      name: z.string(),
      amount: z.number(),
      durationMonths: z.number(),
      assignedAt: z.date()
    })
    .optional(),
  assignedDiet: z
    .object({
      dietDetails: z.string(),
      assignedBy: z.string(),
      assignedAt: z.date()
    })
    .optional(),
  joinDate: z.date().optional(),
  isActive: z.boolean().optional()
})
