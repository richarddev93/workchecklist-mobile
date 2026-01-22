import { Colors } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { Separator } from "../../../../components/ui/separator";

export type ServiceStatus = "pending" | "in-progress" | "completed";

export interface ServiceProgress {
  completed: number;
  total: number;
}

export interface ServiceItem {
  id: string;
  clientName: string;
  serviceType: string;
  status: ServiceStatus;
  statusLabel: string;
  date: string;
  address: string;
  progress: ServiceProgress;
}
interface ServiceCardProps {
  firstItem?: boolean;
  service: ServiceItem;
  onPress: () => void;
}

export function ServiceCard({ service, firstItem, onPress }: ServiceCardProps) {
  const statusStyle = {
    "in-progress": {
      bg: Colors.light.warning + "20", // fundo suave
      text: Colors.light.warning,
      border: Colors.light.warning,
    },
    pending: {
      bg: Colors.light.secondary + "20",
      text: Colors.light.secondaryForeground,
      border: Colors.light.secondaryForeground,
    },
    completed: {
      bg: Colors.light.success + "20",
      text: Colors.light.success,
      border: Colors.light.success,
    },
  }[service.status as ServiceStatus] ?? {
    bg: Colors.light.secondary + "20",
    text: Colors.light.secondaryForeground,
    border: Colors.light.secondaryForeground,
  };

  const progressPercent =
    service.progress.total > 0
      ? (service.progress.completed / service.progress.total) * 100
      : 0;
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card className={cn("mb-2 gap-2", firstItem ? "mt-4" : "")}>
        <CardHeader className="gap-1">
          <View className="flex-row  justify-between items-center gap-2">
            <CardTitle className="text-xl">{service.clientName}</CardTitle>
            <View
              style={{
                backgroundColor: statusStyle.bg,
                borderColor: statusStyle.border,
              }}
              className={cn("px-3 py-1 rounded-full border")}
            >
              <Text
                style={{ color: statusStyle.text }}
                className={cn("text-xs font-medium")}
              >
                {service.statusLabel}
              </Text>
            </View>
          </View>
          <CardDescription>
            <Text className="text-lg">{service.serviceType}</Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <View className="flex-1 flex-row items-center gap-2">
            <MaterialIcons
              name="calendar-today"
              size={24}
              color={Colors.light.icon}
            />
            <Text className="text-sm text-muted">{service.date}</Text>
          </View>

          <View className="flex-1 flex-row items-center gap-2">
            <MaterialIcons name="pin" size={24} color={Colors.light.icon} />
            <Text className="text-sm text-muted">{service.address}</Text>
          </View>
        </CardContent>
        <Separator />
        <CardFooter>
          <View className="flex-1 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-lg text-muted">Progresso</Text>
              <Text className="text-lg font-medium">
                {service.progress.completed}/{service.progress.total}
              </Text>
            </View>
            <Progress value={progressPercent} indicatorClassName="bg-primary" />
          </View>
        </CardFooter>
      </Card>
    </Pressable>
  );
}
