import { Colors } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title?: string;
  onBackHandler?: () => void;
  noBorder?: boolean;
}

export function Header({
  title = "WorkChecklist",
  onBackHandler,
  noBorder = false,
}: HeaderProps) {
  return (
    <View
      className={cn(
        "flex flex-row bg-white items-center px-4 py-4",
        !noBorder && "border-b border-gray-200"
      )}
    >
      {onBackHandler && (
        <TouchableOpacity onPress={onBackHandler} className="mr-2">
          <MaterialIcons
            name="arrow-left"
            color={Colors.light.icon}
            size={36}
          />
        </TouchableOpacity>
      )}

      <View className="flex justify-between">
        <Text className="text-gray-900 text-3xl font-bold">{title}</Text>
      </View>
    </View>
  );
}
