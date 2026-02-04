import { useState, type ReactNode, useEffect } from "react";
import type { Theme } from "./theme.context";
import { ThemeContext } from "./theme.context";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // load from localstorage
    const saved = localStorage.getItem("theme") as Theme | null;
    if (
      saved &&
      (saved === "light" || saved === "dark" || saved === "system")
    ) {
      return saved;
    }

    // default to system preference
    return "system";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light",
  );

  useEffect(() => {
    const applyTheme = () => {
      if (theme === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-schema: dark)",
        ).matches;
        setEffectiveTheme(systemPrefersDark ? "dark" : "light");
      } else {
        setEffectiveTheme(theme);
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia("(prefers-color-schema: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }
  }, [effectiveTheme, theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isDark: effectiveTheme === "dark" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
