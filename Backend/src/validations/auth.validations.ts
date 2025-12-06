import { z } from 'zod';
import { UserRole } from '../enums/roles.enums';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  // .regex(
  //   /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
  //   'Password must include uppercase, number, and special character'
  // )
  role: z.nativeEnum(UserRole, {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be admin, user or member',
  }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid email format'),
  password: z.string({ required_error: 'Password is required' }),
});
