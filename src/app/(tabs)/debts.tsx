import { useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MynaIcon } from "@/components/MynaIcon";
import { FadeInView } from "@/components/FadeInView";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { fonts, spacing, borderRadius } from "@/constants/theme";
import type { Debt, UrgencyLevel } from "@/types";
import { useDebts } from "@/hooks/useDebts";

type Filter = "all" | UrgencyLevel;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const DOT_COLORS: Record<UrgencyLevel, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#14b8a6",
  low: "#64748b",
};

const GLASS = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.9)";

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DebtsScreen() {
  const { colors } = useTheme();
  const { debts, loading, error } = useDebts();
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = filter === "all" ? debts : debts.filter((d) => d.urgency === filter);

  return (
    <FadeInView style={{ flex: 1 }}>
    <LinearGradient colors={["#e8f5f3", "#f0f9f7", "#eaf4f8"]} locations={[0, 0.5, 1]} style={styles.container}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Debts</Text>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterTab, active && { backgroundColor: colors.primary + "18", borderColor: colors.primary }]}
              onPress={() => setFilter(f.value)}
            >
              <Text style={[styles.filterText, { color: active ? colors.primary : colors.textMuted }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.lg }} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {filtered.map((debt) => (
          <TouchableOpacity key={debt.id} activeOpacity={0.8} onPress={() => router.push(`/debts/${debt.id}`)}>
            <DebtRow debt={debt} colors={colors} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={() => router.push("/add-debt")}>
        <MynaIcon name="Plus" size={22} color="#ffffff" />
      </TouchableOpacity>
    </LinearGradient>
    </FadeInView>
  );
}

function DebtRow({ debt, colors }: { debt: Debt; colors: any }) {
  return (
    <View style={[styles.row, { borderBottomColor: "rgba(0,0,0,0.04)" }]}>
      <View style={styles.rowLeft}>
        <View style={[styles.dot, { backgroundColor: DOT_COLORS[debt.urgency] }]} />
        <View style={styles.rowTextWrap}>
          <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={1}>
            {debt.name}
          </Text>
          <Text style={[styles.rowSub, { color: colors.textMuted }]} numberOfLines={1}>
            Due {new Date(debt.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </Text>
        </View>
      </View>
      <View style={styles.rowRight}>
        <Text style={[styles.rowAmount, { color: colors.text }]}>{formatCurrency(debt.amountOwed)}</Text>
        <View style={styles.smallIconCircle}>
          <MynaIcon name="ChevronRight" size={14} color="#94a3b8" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans_700Bold",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  filterRow: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS,
  },
  filterText: { fontSize: fonts.sizes.sm, fontFamily: "PlusJakartaSans_500Medium" },
  list: { paddingHorizontal: spacing.md },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  rowTextWrap: { flex: 1 },
  rowName: { fontSize: 15, lineHeight: 19, fontFamily: "PlusJakartaSans_600SemiBold" },
  rowSub: { marginTop: 3, fontSize: 12, lineHeight: 14, fontFamily: "PlusJakartaSans_500Medium" },
  rowRight: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  rowAmount: { fontSize: 14, lineHeight: 18, fontFamily: "PlusJakartaSans_700Bold", marginRight: 8 },
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
  fab: {
    position: "absolute",
    bottom: 24,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  errorText: { color: "#dc2626", fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", textAlign: "center", marginVertical: spacing.md },
});
