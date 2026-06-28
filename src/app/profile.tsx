import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MynaIcon } from "@/components/MynaIcon";
import { FadeInView } from "@/components/FadeInView";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { fonts, spacing } from "@/constants/theme";

const GLASS = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.9)";

export default function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <FadeInView style={{ flex: 1 }}>
    <LinearGradient colors={["#e8f5f3", "#f0f9f7", "#eaf4f8"]} locations={[0, 0.5, 1]} style={styles.container}>
      <View style={[styles.card, { backgroundColor: GLASS, borderColor: GLASS_BORDER }]}>
        <View style={styles.iconCircle}>
          <MynaIcon name="User" size={18} color="#64748b" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <Text style={[styles.text, { color: colors.textMuted }]}>
          Account settings live here. Opened from the Dashboard, not the bottom tab bar.
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, justifyContent: "center" },
  card: { borderRadius: 28, padding: spacing.lg, borderWidth: 1 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: { fontSize: 28, fontFamily: "PlusJakartaSans_700Bold", marginBottom: spacing.sm },
  text: { fontSize: fonts.sizes.md, lineHeight: 22, fontFamily: "PlusJakartaSans_400Regular", marginBottom: spacing.lg },
  button: { borderRadius: 20, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: fonts.sizes.md, fontFamily: "PlusJakartaSans_700Bold" },
});
