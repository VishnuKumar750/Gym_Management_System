// src/validators/auth/auth.schema.ts

import { z } from 'zod';

// ── Role Constants ───────────────────────────────────────────────────────────
// Using `as const` for type inference + literal types (best practice)
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  MEMBER: 'MEMBER',
} as const;

// Infer union type of roles automatically
export type Role = (typeof ROLES)[keyof typeof ROLES];

// ── Login Schema ─────────────────────────────────────────────────────────────
// Recommended: Use descriptive, user-friendly error messages
export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(4, 'Password must be at least 4 characters')
    .max(100, 'Password is too long')
    .trim(),
});

// Infer input type automatically (best practice)
export type LoginInput = z.infer<typeof LoginSchema>;

// ── Optional: Login Response Schema (if your backend returns structured data)
export const LoginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: z.enum([
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.STAFF,
      ROLES.MEMBER,
    ]),
    name: z.string().optional(),
  }),
  token: z.string(),
  expiresIn: z.number().optional(),
});

// Infer type for response
export type LoginResponse = z.infer<typeof LoginResponseSchema>;