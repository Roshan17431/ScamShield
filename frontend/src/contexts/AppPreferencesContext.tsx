import { createContext, useContext, type ReactNode } from "react";
import { useAnimationPreference } from "../hooks/useAnimationPreference";
import { useTheme, type ThemeMode, type ThemePreference } from "../hooks/useTheme";

interface AppPreferencesContextValue {
  theme: ThemeMode;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const themeState = useTheme();
  const animationState = useAnimationPreference();

  return (
    <AppPreferencesContext.Provider value={{ ...themeState, ...animationState }}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error("useAppPreferences must be used inside AppPreferencesProvider");
  }

  return context;
}
