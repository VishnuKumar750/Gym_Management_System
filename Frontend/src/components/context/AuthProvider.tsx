import { useEffect, useState } from "react";
import { AuthContext, type AuthContextType, type UserType,  } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const newUser = JSON.parse(stored);
      setUser(newUser);
    }

  }, []);

  const login: AuthContextType["login"] = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout: AuthContextType["logout"] = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
