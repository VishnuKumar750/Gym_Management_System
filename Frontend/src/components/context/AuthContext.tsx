import { createContext } from "react";

export type UserType = {
  id: string, 
  name: string, 
  email: string, 
  role: "admin" | "user" | "manager";
}

export type AuthContextType = {
  user: UserType | null;
  login: (userData: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);



