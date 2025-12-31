import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

interface StatCardProps {
  title: string;
  value: number;
  iconName?: MaterialIconName;
  color: string;
  onPress?: () => void;
}

export default function StatCard({
  title,
  value,
  iconName,
  color,
  onPress,
}: StatCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-1 active:opacity-80"
    >
      <Card>
        <CardContent className="flex flex-row items-center justify-between gap-4">
          <View className="flex-1">
            <CardTitle className="text-muted-foreground">{title}</CardTitle>

            <CardDescription className="text-3xl font-bold text-foreground">
              {value}
            </CardDescription>
          </View>

          {iconName && (
            <MaterialIcons name={iconName} size={28} color={color} />
          )}
        </CardContent>
      </Card>
    </Pressable>
  );
}
