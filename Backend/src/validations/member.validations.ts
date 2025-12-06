import { z } from 'zod';
import { MembershipPlan, MembershipStatus } from '../enums/day.enums';

export const createMemberSchema = z.object({
  user: z.string(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  age: z.number().min(10, 'Age must be valid'),
  membership: z
    .object({
      plan: z.nativeEnum(MembershipPlan),
      startDate: z.string(),
      endDate: z.string(),
      status: z.nativeEnum(MembershipStatus).optional(),
    })
    .optional(),
});
