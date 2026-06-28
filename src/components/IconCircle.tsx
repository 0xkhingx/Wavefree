import { View } from "react-native";
import { MynaIcon } from "./MynaIcon";

export function IconCircle({
  name,
  size = 18,
  color = "#64748b",
  circleSize = 40,
  active,
}: {
  name: string;
  size?: number;
  color?: string;
  circleSize?: number;
  active?: boolean;
}) {
  return (
    <View
      style={{
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        backgroundColor: active ? "#0f172a" : "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
        borderColor: active ? "#0f172a" : "rgba(255, 255, 255, 0.9)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MynaIcon name={name} size={size} color={color} />
    </View>
  );
}
