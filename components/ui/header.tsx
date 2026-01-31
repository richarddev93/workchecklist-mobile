import { Colors } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { ChevronLeft } from "lucide-react-native";
import type { ComponentProps } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title?: string;
  onBackHandler?: () => void;
  noBorder?: boolean;
  actionIcon?: ComponentProps<typeof MaterialIcons>["name"];
  onActionPress?: () => void;
  actionLabel?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function Header({
  title = "WorkChecklist",
  onBackHandler,
  noBorder = false,
  actionIcon = "more-vert",
  onActionPress,
  actionLabel,
  subtitle,
  showLogo = false,
}: HeaderProps) {
  return (
    <View
      className={cn(
        "flex flex-row bg-white items-center px-4 py-4 justify-between",
        !noBorder && "border-b border-gray-200",
      )}
    >
      <View className="flex flex-row items-center gap-2 flex-1">
        {onBackHandler && (
          <TouchableOpacity onPress={onBackHandler} className="mr-1">
            <ChevronLeft
              color={Colors.light.icon}
              size={28}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        )}

        {showLogo && !title && (
          <Image
            source={require("@/assets/images/Logo-horizontal.png")}
            className="h-10"
            resizeMode="contain"
            style={{ width: 120 }}
          />
        )}

        <View className="flex-1">
          <Text className="text-gray-900 text-2xl font-bold" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-gray-500 text-sm" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          accessibilityLabel={actionLabel ?? "Abrir ações"}
          className="ml-3"
        >
          <MaterialIcons
            name={actionIcon}
            color={Colors.light.icon}
            size={28}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
