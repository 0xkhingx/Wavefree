import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { MynaIcon } from "@/components/MynaIcon";

const TABS = [
  { name: "index" as const, icon: "Home" as const },
  { name: "debts" as const, icon: "CreditCard" as const },
  { name: "allocate" as const, icon: "LayersThree" as const },
  { name: "profile" as const, icon: "User" as const },
];

function TabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.pill}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const tab = TABS.find((t) => t.name === route.name);
        const icon = tab?.icon ?? "Home";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.circle, isFocused && styles.circleActive]}>
              <MynaIcon
                name={icon as any}
                size={26}
                color={isFocused ? "#0f172a" : "#94a3b8"}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: 264,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
});
