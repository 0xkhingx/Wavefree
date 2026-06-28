import { useState } from "react";
import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MynaIcon } from "@/components/MynaIcon";
import { FadeInView } from "@/components/FadeInView";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { fonts, spacing, borderRadius } from "@/constants/theme";
import type { UrgencyLevel } from "@/types";

const GLASS = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.9)";

const URGENCY_OPTIONS: { label: string; value: UrgencyLevel; color: string }[] = [
  { label: "Critical", value: "critical", color: "#EF5350" },
  { label: "High", value: "high", color: "#F09BAE" },
  { label: "Medium", value: "medium", color: "#F7C98A" },
  { label: "Low", value: "low", color: "#4CAF9F" },
];

export default function AddDebtScreen() {
  const { colors } = useTheme();
  const [urgency, setUrgency] = useState<UrgencyLevel>("medium");

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient colors={["#e8f5f3", "#f0f9f7", "#eaf4f8"]} locations={[0, 0.5, 1]} style={{ flex: 1 }}>
        <FadeInView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <View style={styles.smallIconCircle}>
              <MynaIcon name="ChevronLeft" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.backText, { color: colors.primary }]}>  Back</Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>Add Debt</Text>

          {["Creditor Name", "Total Amount Owed", "Minimum Payment", "Due Date"].map((label) => (
            <View key={label} style={[styles.card, { backgroundColor: GLASS, borderColor: GLASS_BORDER }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: "rgba(255, 255, 255, 0.8)", color: colors.text, borderColor: GLASS_BORDER }]}
                placeholderTextColor={colors.textMuted}
                placeholder={label}
              />
            </View>
          ))}

          <View style={[styles.card, { backgroundColor: GLASS, borderColor: GLASS_BORDER }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Urgency Level</Text>
            <View style={styles.segmentRow}>
              {URGENCY_OPTIONS.map((opt) => {
                const active = urgency === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.segment,
                      active && { backgroundColor: opt.color + "18", borderColor: opt.color },
                    ]}
                    onPress={() => setUrgency(opt.value)}
                  >
                    <Text style={[styles.segmentText, { color: active ? opt.color : colors.textMuted }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={styles.saveBtnText}>Save Debt</Text>
          </TouchableOpacity>
        </ScrollView>
        </FadeInView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingTop: spacing.lg },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  smallIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: fonts.sizes.md, fontFamily: "PlusJakartaSans_600SemiBold" },
  title: { fontSize: 28, fontFamily: "PlusJakartaSans_700Bold", marginBottom: spacing.lg },
  card: {
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  label: {
    fontSize: fonts.sizes.xs,
    fontFamily: "PlusJakartaSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  input: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fonts.sizes.md,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  segmentRow: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  segment: {
    flexGrow: 1,
    minWidth: "46%",
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    backgroundColor: GLASS,
  },
  segmentText: { fontSize: fonts.sizes.xs, fontFamily: "PlusJakartaSans_500Medium" },
  saveBtn: {
    borderRadius: 20,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  saveBtnText: { fontSize: fonts.sizes.lg, fontFamily: "PlusJakartaSans_700Bold", color: "#FFFFFF" },
});
