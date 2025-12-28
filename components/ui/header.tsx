import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title?: string;
  onBackHandler?: () => void;
}
export function Header({
  title = "WorkChecklist",
  onBackHandler,
}: HeaderProps) {
  return (
    <View className="bg-white border-b border-gray-200 px-4 py-4">
      <TouchableOpacity onPress={onBackHandler}>
        <MaterialIcons name="arrow-right" color={Colors.light.icon} size={23} />
      </TouchableOpacity>
      <View className="flex justify-between">
        <Text className="text-gray-900 text-3xl font-bold">{title}</Text>
      </View>
    </View>
  );
}
