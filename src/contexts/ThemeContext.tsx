import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { oceanColors, type ThemeColors } from "@/constants/theme";

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [manualMode, setManualMode] = useState<"light" | "dark" | null>(null);

  const isDark = (manualMode ?? systemScheme) === "dark";

  const colors = useMemo(() => (isDark ? oceanColors.dark : oceanColors.light), [isDark]);

  const toggleTheme = useCallback(() => {
    setManualMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
