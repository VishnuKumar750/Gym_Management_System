export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MEMBER" | "STAFF";
  name?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface LoginResponse {
  user: User;
  token: string;

  expiresIn?: string;
  message?: string;
}

export interface LoginErrorResponse {
  message?: string;
  errors?: string;
  status?: number;
}

export type Role = "admin" | "staff" | "trainer" | "member";
