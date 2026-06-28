import { useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

const GLASS = "rgba(255, 255, 255, 0.75)";
const GLASS_BORDER = "rgba(255, 255, 255, 0.9)";
const TEAL = "#00d4b4";

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  showChevron,
  rightElement,
  danger,
  valueTeal,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  danger?: boolean;
  valueTeal?: boolean;
}) {
  const content = (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Feather name={icon as any} size={16} color={danger ? "#ff4444" : TEAL} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: "#ff4444" }]}>{label}</Text>
      {value ? (
        <Text style={[styles.rowValue, valueTeal && { color: TEAL }]}>{value}</Text>
      ) : null}
      {rightElement || null}
      {showChevron ? (
        <Feather name="chevron-right" size={14} color="#94a3b8" style={{ marginLeft: 6 }} />
      ) : null}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
  }
  return content;
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

export default function ProfileScreen() {
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);

  return (
    <LinearGradient colors={["#e8f5f3", "#f0f9f7", "#eaf4f8"]} locations={[0, 0.5, 1]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
          <Text style={styles.memberSince}>Member since June 2026</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <SectionLabel label="Financial Baseline" />
        <View style={[styles.card, styles.baselineCard]}>
          <SettingsRow icon="dollar-sign" label="Monthly Income" value="₦250,000" showChevron />
          <View style={styles.divider} />
          <SettingsRow icon="percent" label="Personal Buffer" value="₦80,000" showChevron />
          <View style={styles.divider} />
          <SettingsRow icon="globe" label="Currency" value="NGN — Nigerian Naira" showChevron />
        </View>

        <SectionLabel label="Your Progress" />
        <View style={styles.card}>
          <SettingsRow icon="trending-up" label="Started with" value="₦1,200,000" />
          <View style={styles.divider} />
          <SettingsRow icon="check-circle" label="Paid off so far" value="₦340,000" valueTeal />
          <View style={styles.divider} />
          <SettingsRow icon="calendar" label="Debt-free estimate" value="March 2028" />
        </View>

        <SectionLabel label="Notifications" />
        <View style={styles.card}>
          <SettingsRow
            icon="bell"
            label="Payment reminders"
            rightElement={
              <Switch
                value={paymentReminders}
                onValueChange={setPaymentReminders}
                trackColor={{ false: "#e5e7eb", true: TEAL }}
                thumbColor="#ffffff"
              />
            }
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="bell"
            label="Weekly summary"
            rightElement={
              <Switch
                value={weeklySummary}
                onValueChange={setWeeklySummary}
                trackColor={{ false: "#e5e7eb", true: TEAL }}
                thumbColor="#ffffff"
              />
            }
          />
          <View style={styles.divider} />
          <SettingsRow icon="clock" label="Remind me" value="3 days before due" showChevron />
        </View>

        <SectionLabel label="Preferences" />
        <View style={styles.card}>
          <SettingsRow
            icon="moon"
            label="Dark mode"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#e5e7eb", true: TEAL }}
                thumbColor="#ffffff"
              />
            }
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="lock"
            label="Biometric lock"
            rightElement={
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: "#e5e7eb", true: TEAL }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        <SectionLabel label="Account" />
        <View style={styles.card}>
          <SettingsRow icon="download" label="Export Payment History" showChevron />
          <View style={styles.divider} />
          <SettingsRow icon="log-out" label="Sign Out" />
          <View style={styles.divider} />
          <SettingsRow icon="alert-triangle" label="Delete Account" danger />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  identity: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF9C4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontFamily: "PlusJakartaSans_700Bold", color: "#0f172a" },
  name: { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", color: "#0f172a", marginTop: 12 },
  email: { fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", color: "#64748b", marginTop: 2 },
  memberSince: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular", color: "#94a3b8", marginTop: 4 },
  editBtn: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: TEAL,
    marginTop: 8,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#94a3b8",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: GLASS,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    padding: 16,
    marginBottom: 16,
  },
  baselineCard: { paddingVertical: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 212, 180, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#0f172a",
  },
  rowValue: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#64748b",
    marginRight: 4,
  },
  divider: { height: 1, backgroundColor: "#f1f5f9" },
});
