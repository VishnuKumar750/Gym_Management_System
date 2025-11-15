import { createContext } from "react";

export type AuthContextType = {
  user: string | null;
  login: (userData: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);



