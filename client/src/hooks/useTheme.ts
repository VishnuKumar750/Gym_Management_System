import { ThemeContext } from "@/context/theme/theme.context";
import { useContext } from "react";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return ctx;
}
