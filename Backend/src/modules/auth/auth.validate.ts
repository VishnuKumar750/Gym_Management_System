import { z } from 'zod'

// email regex (practical, not insane)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// password regex
// at least 6 chars, one letter and one number
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/

export const signinSchema = z.object({
  email: z.string().trim().regex(EMAIL_REGEX, 'Invalid email format'),

  password: z
    .string()
    .regex(PASSWORD_REGEX, 'Password must be at least 6 characters and contain letters and numbers')
})

export type SigninInput = z.infer<typeof signinSchema>
