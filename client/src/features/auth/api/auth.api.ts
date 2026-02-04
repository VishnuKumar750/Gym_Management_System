// src/features/auth/api/authApi.ts
import axios from 'axios'
import type { LoginInput, User } from '@/types/login.types'

export async function loginApi(data: LoginInput): Promise<{ user: User; token: string }> {
  const response = await axios.post('/api/auth/signin', data)
  return response.data
}