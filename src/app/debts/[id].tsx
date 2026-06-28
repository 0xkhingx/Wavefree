import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MynaIcon } from "@/components/MynaIcon";
import { FadeInView } from "@/components/FadeInView";
import { useLocalSearchParams, router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useDebts } from "@/hooks/useDebts";
import { fonts, spacing, borderRadius } from "@/constants/theme";
import type { Debt } from "@/types";

const GLASS = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.9)";

type PaymentItem = { id: string; name: string; sublabel: string; amount: number; kind: "paid" | "pending"; icon: string };
type PaymentGroup = { header: string; items: PaymentItem[] };

const HISTORY: Record<string, PaymentGroup[]> = {
  "1": [
    {
      header: "Today",
      items: [
        { id: "p1", name: "Chase Credit Card", sublabel: "Payment made", amount: 95, kind: "paid", icon: "◎" },
        { id: "p2", name: "Chase Credit Card", sublabel: "Scheduled", amount: 45, kind: "pending", icon: "◌" },
      ],
    },
    {
      header: "Yesterday",
      items: [
        { id: "p3", name: "Chase Credit Card", sublabel: "Payment made", amount: 120, kind: "paid", icon: "◎" },
      ],
    },
  ],
  "2": [
    {
      header: "Today",
      items: [
        { id: "p4", name: "Sallie Mae Student Loan", sublabel: "Payment scheduled", amount: 240, kind: "pending", icon: "◌" },
      ],
    },
    { header: "19 November", items: [{ id: "p5", name: "Sallie Mae Student Loan", sublabel: "Payment made", amount: 240, kind: "paid", icon: "◎" }] },
  ],
};

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DebtDetailScreen() {
  const { colors } = useTheme();
  const { debts } = useDebts();
  const { id } = useLocalSearchParams<{ id: string }>();
  const debt = debts.find((d) => d.id === id) ?? debts[0];
  const groups = HISTORY[debt?.id ?? ""] ?? fallbackHistory(debt);

  return (
    <FadeInView style={{ flex: 1 }}>
    <LinearGradient colors={["#e8f5f3", "#f0f9f7", "#eaf4f8"]} locations={[0, 0.5, 1]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <View style={styles.smallIconCircle}>
              <MynaIcon name="ChevronLeft" size={16} color={colors.text} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Pay</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.hero, { backgroundColor: GLASS, borderColor: GLASS_BORDER }]}>
          <View style={styles.cardPill}>
            <Text style={styles.cardPillText}>**** 2872</Text>
          </View>
          <Text style={[styles.debtName, { color: colors.text }]}>{debt?.name ?? "Debt"}</Text>
          <Text style={[styles.largeAmount, { color: colors.text }]}>{formatCurrency(debt?.amountOwed ?? 0)}</Text>
          <Text style={[styles.balanceText, { color: colors.textMuted }]}>Balance: {formatCurrency(debt?.totalAmount ?? 0)}</Text>
        </View>

        {groups.map((group) => (
          <View key={group.header} style={[styles.groupCard, { backgroundColor: GLASS, borderColor: GLASS_BORDER }]}>
            <Text style={[styles.groupHeader, { color: colors.textMuted }]}>{group.header}</Text>
            {group.items.map((item, index) => (
              <View key={item.id} style={[styles.paymentRow, index !== group.items.length - 1 && { borderBottomColor: "rgba(0,0,0,0.04)" }]}>
                <View style={styles.paymentLeft}>
                  <View style={[styles.paymentIcon, { backgroundColor: item.kind === "paid" ? "#ecfeff" : GLASS }]}>
                    <Text style={[styles.paymentIconText, { color: colors.primary }]}>{item.icon}</Text>
                  </View>
                  <View style={styles.paymentTextWrap}>
                    <Text style={[styles.paymentName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.paymentSub, { color: colors.textMuted }]}>{item.sublabel}</Text>
                  </View>
                </View>
                <Text style={[styles.paymentAmount, { color: item.kind === "paid" ? colors.primary : colors.textMuted }]}>
                  {item.kind === "paid" ? "+" : "-"}
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
    </FadeInView>
  );
}

function fallbackHistory(debt: Debt | undefined): PaymentGroup[] {
  if (!debt) return [];
  return [
    {
      header: "Today",
      items: [{ id: "x1", name: debt.name, sublabel: "Payment made", amount: debt.minimumPayment, kind: "paid", icon: "◎" }],
    },
    {
      header: "Yesterday",
      items: [{ id: "x2", name: debt.name, sublabel: "Scheduled", amount: debt.minimumPayment, kind: "pending", icon: "◌" }],
    },
  ];
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: spacing.md },
  smallIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: { fontSize: 18, fontFamily: "PlusJakartaSans_600SemiBold" },
  hero: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardPill: {
    alignSelf: "center",
    backgroundColor: "#111827",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 14,
  },
  cardPillText: { color: "#ffffff", fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold" },
  debtName: { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold", textAlign: "center" },
  largeAmount: { fontSize: 40, lineHeight: 44, fontFamily: "PlusJakartaSans_700Bold", textAlign: "center", marginTop: 18 },
  balanceText: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", textAlign: "center", marginTop: 6 },
  groupCard: { borderRadius: 22, borderWidth: 1, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4, marginBottom: 12 },
  groupHeader: { fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", marginBottom: 4 },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  paymentLeft: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 10 },
  paymentIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", marginRight: 10 },
  paymentIconText: { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold" },
  paymentTextWrap: { flex: 1 },
  paymentName: { fontSize: 14, lineHeight: 18, fontFamily: "PlusJakartaSans_600SemiBold" },
  paymentSub: { fontSize: 12, lineHeight: 14, fontFamily: "PlusJakartaSans_400Regular", marginTop: 2 },
  paymentAmount: { fontSize: 13, fontFamily: "PlusJakartaSans_700Bold" },
});
