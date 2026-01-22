import { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon?: LucideIcon;
  color: string;
  onPress?: () => void;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  onPress,
}: StatCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-1 active:opacity-80"
    >
      <Card className="h-28">
        <CardContent className="flex flex-row items-center justify-between gap-4 h-full">
          <View className="flex-1">
            <CardTitle className="text-muted-foreground text-sm">
              {title}
            </CardTitle>

            <CardDescription className="text-3xl font-bold text-foreground">
              {value}
            </CardDescription>
          </View>

          {Icon && <Icon size={32} color={color} strokeWidth={1.5} />}
        </CardContent>
      </Card>
    </Pressable>
  );
}
