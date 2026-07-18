import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";
export type ThemePreference = ThemeMode | "system";

const STORAGE_KEY = "scamshield-theme";

export function useTheme() {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system") {
      return storedTheme;
    }

    return "system";
  });
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(getSystemTheme);
  const theme = themePreference === "system" ? systemTheme : themePreference;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => setSystemTheme(mediaQuery.matches ? "dark" : "light");

    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, themePreference);
  }, [theme, themePreference]);

  const updateThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreference(preference);
  }, []);

  const toggleTheme = useCallback(() => {
    updateThemePreference(theme === "dark" ? "light" : "dark");
  }, [theme, updateThemePreference]);

  return {
    theme,
    themePreference,
    setThemePreference: updateThemePreference,
    toggleTheme
  };
}

function getSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
