import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function NumpadKey({
  label,
  onPress,
  isIcon,
}: {
  label: string;
  onPress: () => void;
  isIcon?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.key} onPress={onPress} activeOpacity={0.7}>
      {isIcon ? (
        <Feather name="delete" size={20} color="#0f172a" />
      ) : (
        <Text style={styles.keyText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function AllocateScreen() {
  const [amount, setAmount] = useState("");

  const displayAmount = amount ? formatCurrency(parseFloat(amount.replace(/,/g, ""))) : "$0";
  const numericValue = parseFloat(amount.replace(/,/g, "")) || 0;

  const append = (digit: string) => {
    if (digit === "." && amount.includes(".")) return;
    const next = digit === "." && amount === "" ? "0." : `${amount}${digit}`;
    const parts = next.replace(/,/g, "").split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAmount(parts.join("."));
  };

  const backspace = () => {
    const removed = amount.slice(0, -1);
    const parts = removed.replace(/,/g, "").split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAmount(parts.join("."));
  };

  const handleAllocate = () => {
    if (numericValue <= 0) return;
    console.log("Allocate", numericValue);
  };

  return (
    <LinearGradient colors={["#e8f5f3", "#f0f9f7", "#eaf4f8"]} locations={[0, 0.5, 1]} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topBar}>
          <TouchableOpacity>
            <Feather name="chevron-left" size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.title}>Allocate</Text>
          <Feather name="users" size={22} color="#0f172a" />
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.amount}>{displayAmount}</Text>
          <Text style={styles.amountLabel}>Income ready to allocate</Text>
        </View>

        <View style={styles.noteRow}>
          <Feather name="message-square" size={16} color="#94a3b8" />
          <TextInput
            style={styles.noteInput}
            placeholder="Note"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.numpad}>
          <View style={styles.numpadRow}>
            <NumpadKey label="1" onPress={() => append("1")} />
            <NumpadKey label="2" onPress={() => append("2")} />
            <NumpadKey label="3" onPress={() => append("3")} />
          </View>
          <View style={styles.numpadRow}>
            <NumpadKey label="4" onPress={() => append("4")} />
            <NumpadKey label="5" onPress={() => append("5")} />
            <NumpadKey label="6" onPress={() => append("6")} />
          </View>
          <View style={styles.numpadRow}>
            <NumpadKey label="7" onPress={() => append("7")} />
            <NumpadKey label="8" onPress={() => append("8")} />
            <NumpadKey label="9" onPress={() => append("9")} />
          </View>
          <View style={styles.numpadRow}>
            <NumpadKey label="." onPress={() => append(".")} />
            <NumpadKey label="0" onPress={() => append("0")} />
            <NumpadKey label="" onPress={backspace} isIcon />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.allocateBtn, amount && numericValue > 0 ? styles.allocateBtnActive : {}]}
          onPress={handleAllocate}
          activeOpacity={0.8}
        >
          <Text style={styles.allocateBtnText}>Allocate</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  title: { fontSize: 17, fontFamily: "PlusJakartaSans_600SemiBold", color: "#0f172a" },
  amountSection: { alignItems: "center", marginBottom: 28 },
  amount: { fontSize: 52, lineHeight: 58, fontFamily: "PlusJakartaSans_700Bold", color: "#0f172a" },
  amountLabel: { fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", color: "#94a3b8", marginTop: 8 },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  noteInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    color: "#0f172a",
    padding: 0,
  },
  numpad: { gap: 10, marginBottom: 16 },
  numpadRow: { flexDirection: "row", gap: 10 },
  key: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: { fontSize: 26, fontFamily: "PlusJakartaSans_500Medium", color: "#0f172a" },
  allocateBtn: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  allocateBtnActive: { backgroundColor: "#0f172a" },
  allocateBtnText: { fontSize: 16, fontFamily: "PlusJakartaSans_600SemiBold", color: "#ffffff" },
});
