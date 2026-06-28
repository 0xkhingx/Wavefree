import { useEffect } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isDark } = useTheme();

  return (
    <View style={styles.outer}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.inner}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 280,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ animation: "fade", animationDuration: 0 }} />
          <Stack.Screen name="add-debt" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
          <Stack.Screen name="profile" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
          <Stack.Screen name="debts/[id]" options={{ animation: "slide_from_right" }} />
        </Stack>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    ...(Platform.OS === "web" ? { alignItems: "center" as const } : {}),
  },
  inner: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
  },
});
