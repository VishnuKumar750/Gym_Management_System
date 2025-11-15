import { useEffect, useState } from "react";
import { AuthContext, type AuthContextType,  } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
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
