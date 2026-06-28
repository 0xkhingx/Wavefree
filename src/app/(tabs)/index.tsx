import { useState, useCallback } from "react";
import { Text, View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, G } from "react-native-svg";
import { MynaIcon } from "@/components/MynaIcon";
import { FadeInView } from "@/components/FadeInView";
import { spacing } from "@/constants/theme";
import type { Debt } from "@/types";
import { useDebts } from "@/hooks/useDebts";

const TEAL = "#00d4b4";
const TEXT = "#0f172a";
const TEXT_MUTED = "#64748b";
const TEXT_SUBTLE = "#94a3b8";
const GLASS = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.9)";
const TRACK = "rgba(0, 0, 0, 0.06)";

function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatPercent(pct: number): string {
  return `${Math.max(0, Math.min(pct, 100)).toFixed(0)}%`;
}

function ProgressBar({ paid, total }: { paid: number; total: number }) {
  const pct = total > 0 ? Math.max(0, Math.min(paid / total, 1)) : 0;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

function CircularProgress({ progress: _ }: { progress: number }) {
  const cx = 110;
  const cy = 110;
  const r = 90;
  const size = 220;
  const gapDeg = 14;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { pct: 0.35, color: "#6366f1" },
    { pct: 0.28, color: "#f59e0b" },
    { pct: 0.22, color: "#1e293b" },
    { pct: 0.15, color: "#e2e8f0" },
  ];

  let cumulativeDeg = 0;
  const arcs = segments.map((seg) => {
    const startAngle = cumulativeDeg;
    const segDeg = seg.pct * 360 - gapDeg;
    const segArcLength = (segDeg / 360) * circumference;
    cumulativeDeg += seg.pct * 360;
    return {
      color: seg.color,
      segArcLength,
      rotate: startAngle,
    };
  });

  return (
    <>
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 20, marginBottom: 8 }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle cx={cx} cy={cy} r={r} stroke="#ede9e3" strokeWidth={20} strokeLinecap="round" fill="none" />
          {arcs.map((arc, i) => (
            <G key={i} transform={`rotate(${arc.rotate}, ${cx}, ${cy})`}>
              <Circle
                cx={cx}
                cy={cy}
                r={r}
                stroke={arc.color}
                strokeWidth={20}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${arc.segArcLength} ${circumference}`}
                strokeDashoffset={0}
              />
            </G>
          ))}
        </Svg>
        <View style={{ position: "absolute", alignItems: "center" }}>
          <Text style={{ fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", color: "#94a3b8" }}>Total owed</Text>
          <Text style={{ fontSize: 26, fontFamily: "PlusJakartaSans_700Bold", color: "#0f172a", marginTop: 4 }}>{formatCurrency(Math.round(56700))}</Text>
        </View>
      </View>
    </>
  );
}

export default function DashboardScreen() {
  const { debts, loading, error, refetch } = useDebts();
  const [refreshing, setRefreshing] = useState(false);

  const totalRemaining = debts.reduce((sum, debt) => sum + debt.amountOwed, 0);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
  const cleared = totalDebt > 0 ? 1 - totalRemaining / totalDebt : 0;
  const nextDue = [...debts].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  const mostUrgent = [...debts].sort((a, b) => urgencyOrder(a) - urgencyOrder(b))[0];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <FadeInView style={{ flex: 1 }}>
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={TEAL} />}
      >
        <View style={styles.topBar}>
          <View style={styles.avatarCircle}>
            <MynaIcon name="User" size={18} color={TEAL} />
          </View>
          <Text style={styles.pageTitle}>Your Debt</Text>
          <View style={styles.iconCircle}>
            <MynaIcon name="Bell" size={18} color={TEXT_MUTED} />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.bigNumber}>{formatCurrency(totalRemaining)}</Text>
          <Text style={styles.smallLabel}>Debt remaining</Text>
          <Text style={styles.dateHint}>{nextDue ? `Next due ${formatShortDate(nextDue.dueDate)}` : "No due dates found"}</Text>
        </View>

        <CircularProgress progress={cleared} />

        <View style={styles.statDivider} />

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: "#eef2ff" }]}>
              <MynaIcon name="TrendingUp" size={18} color="#6366f1" />
            </View>
            <Text style={styles.statLabel}>Total Income</Text>
            <Text style={styles.statValue}>{formatCurrency(250000)}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: "#fffbeb" }]}>
              <MynaIcon name="CreditCard" size={18} color="#f59e0b" />
            </View>
            <Text style={styles.statLabel}>Total Debt</Text>
            <Text style={[styles.statValue, { color: "#f59e0b" }]}>{formatCurrency(56700)}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: "#f0fdfa" }]}>
              <MynaIcon name="CheckCircle" size={18} color="#00d4b4" />
            </View>
            <Text style={styles.statLabel}>Paid Off</Text>
            <Text style={[styles.statValue, { color: "#00d4b4" }]}>{formatCurrency(12300)}</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>On-track!</Text>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.listTitle}>Debts</Text>
          {loading && <ActivityIndicator size="small" color={TEAL} style={{ marginVertical: spacing.md }} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!loading &&
            debts.map((debt, index) => (
              <DebtRow key={debt.id} debt={debt} isLast={index === debts.length - 1} />
            ))}
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
    </FadeInView>
  );
}

function DebtRow({ debt, isLast }: { debt: Debt; isLast: boolean }) {
  const paid = debt.totalAmount - debt.amountOwed;
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.rowTop}>
        <View style={[styles.dot, { backgroundColor: urgencyColor(debt.urgency) }]} />
        <View style={styles.rowTextWrap}>
          <Text style={styles.rowName} numberOfLines={1}>{debt.name}</Text>
          <Text style={styles.rowSub} numberOfLines={1}>{`Due ${formatShortDate(debt.dueDate)}`}</Text>
        </View>
        <View style={styles.rowAmountWrap}>
          <Text style={styles.rowAmount}>{formatCurrency(debt.amountOwed)}</Text>
          <View style={styles.smallIconCircle}>
            <MynaIcon name="ChevronRight" size={14} color={TEXT_SUBTLE} />
          </View>
        </View>
      </View>
      <ProgressBar paid={paid} total={debt.totalAmount} />
    </View>
  );
}

function urgencyOrder(debt: Debt): number {
  return { critical: 0, high: 1, medium: 2, low: 3 }[debt.urgency];
}

function urgencyColor(urgency: Debt["urgency"]): string {
  return {
    critical: "#ff4444",
    high: "#ff8c00",
    medium: "#f5c518",
    low: "#00d4b4",
  }[urgency] ?? "#94a3b8";
}

function truncateText(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1))}…`;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 18 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: { fontSize: 17, fontFamily: "PlusJakartaSans_600SemiBold", color: TEXT, textAlign: "center", flex: 1 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    backgroundColor: "#FFF176",
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },
  bigNumber: { fontSize: 40, lineHeight: 44, fontFamily: "PlusJakartaSans_700Bold", color: TEXT, textAlign: "center" },
  smallLabel: { fontSize: 14, lineHeight: 18, fontFamily: "PlusJakartaSans_500Medium", color: "rgba(26, 26, 26, 0.6)", marginTop: 4, textAlign: "center" },
  dateHint: { fontSize: 12, fontFamily: "PlusJakartaSans_500Medium", color: "rgba(26, 26, 26, 0.5)", marginTop: 6, textAlign: "center" },
  statDivider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 8 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: { fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", color: "#94a3b8", marginTop: 8, textAlign: "center" },
  statValue: { fontSize: 18, fontFamily: "PlusJakartaSans_700Bold", color: "#0f172a", marginTop: 2, textAlign: "center" },
  statusPill: {
    alignSelf: "center",
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#0ea5a5",
    backgroundColor: GLASS,
  },
  statusText: { color: "#0f766e", fontSize: 12, fontFamily: "PlusJakartaSans_600SemiBold" },
  listCard: {
    backgroundColor: GLASS,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  listTitle: { fontSize: 16, lineHeight: 20, fontFamily: "PlusJakartaSans_700Bold", color: TEXT, marginBottom: 8 },
  row: { paddingVertical: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.04)" },
  rowTop: { flexDirection: "row", alignItems: "flex-start" },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, marginRight: 10 },
  rowTextWrap: { flex: 1, paddingRight: 10 },
  rowName: { fontSize: 14, lineHeight: 18, fontFamily: "PlusJakartaSans_600SemiBold", color: TEXT },
  rowSub: { marginTop: 3, fontSize: 12, fontFamily: "PlusJakartaSans_500Medium", color: TEXT_MUTED },
  rowAmountWrap: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  rowAmount: { fontSize: 14, fontFamily: "PlusJakartaSans_700Bold", color: TEXT, marginRight: 6 },
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
  progressTrack: { height: 6, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.04)", overflow: "hidden", marginTop: 10 },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: TEAL },
  errorText: { color: "#dc2626", fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", marginVertical: 8 },
});
