// src/features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { loginApi } from '@/features/auth/api/auth.api' // ← your API function
import type { LoginInput, User } from '@/types/login.types'

export function useLogin() {
  const { login: setAuth } = useAuth()

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const { user, token } = await loginApi(data) // your real API call
      return { user, token }
    },
    onSuccess: ({ user, token }) => {
      setAuth(user, token) // update auth context
      // Optional: toast.success("Welcome back!")
    },
    onError: (error) => {
      console.error("Login failed:", error)
      // Optional: toast.error("Login failed")
    },
  })
}