import type { ViewStyle } from "react-native";

export const oceanColors = {
  light: {
    primary: "#00d4b4",
    primaryLight: "#66e6d4",
    primaryDark: "#0f766e",
    secondary: "#cbd5e1",
    secondaryLight: "#e2e8f0",
    accent: "#00d4b4",
    accentLight: "#ccfbf1",
    background: "#f8fafc",
    surface: "#FFFFFF",
    surfaceAlt: "#f8fafc",
    text: "#0f172a",
    textSecondary: "#334155",
    textMuted: "#64748b",
    border: "#e2e8f0",
    error: "#dc2626",
    success: "#0f766e",
    warning: "#14b8a6",
    cardShadow: "rgba(15, 23, 42, 0.08)",
    tabBarBackground: "#FFFFFF",
    tabBarBorder: "#e2e8f0",
    tabBarActive: "#00d4b4",
    tabBarInactive: "#94a3b8",
  },
  dark: {
    primary: "#00d4b4",
    primaryLight: "#66e6d4",
    primaryDark: "#0f766e",
    secondary: "#cbd5e1",
    secondaryLight: "#e2e8f0",
    accent: "#00d4b4",
    accentLight: "#ccfbf1",
    background: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    text: "#0f172a",
    textSecondary: "#334155",
    textMuted: "#64748b",
    border: "#e2e8f0",
    error: "#dc2626",
    success: "#0f766e",
    warning: "#14b8a6",
    cardShadow: "rgba(0, 0, 0, 0.3)",
    tabBarBackground: "#ffffff",
    tabBarBorder: "#e2e8f0",
    tabBarActive: "#00d4b4",
    tabBarInactive: "#94a3b8",
  },
};

export type ThemeColors = typeof oceanColors.light;

export const fonts = {
  regular: {
    fontFamily: "PlusJakartaSans_400Regular",
  },
  medium: {
    fontFamily: "PlusJakartaSans_500Medium",
  },
  semiBold: {
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  bold: {
    fontFamily: "PlusJakartaSans_700Bold",
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows: Record<string, ViewStyle> = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const urgencyColors = {
  low: {
    light: "#2E7D6F",
    dark: "#4CAF9F",
  },
  medium: {
    light: "#F2A65A",
    dark: "#F7C98A",
  },
  high: {
    light: "#E85D75",
    dark: "#F09BAE",
  },
  critical: {
    light: "#D32F2F",
    dark: "#EF5350",
  },
};
