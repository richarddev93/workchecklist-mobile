import Container from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { Colors } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

interface ServiceDetailViewProps {
  service: {
    clientName: string;
    serviceType: string;
    status: "pending" | "in-progress" | "completed";
    statusLabel: string;
    date: string;
    location?: string;
    observations?: string;
  };
  completedItems: number;
  totalItems: number;
  onOpenChecklist: () => void;
  onOpenReport?: () => void;
  onBackHandler: () => void;

}

export function ServiceDetailView({
  service,
  completedItems,
  totalItems,
  onOpenChecklist,
  onOpenReport,
  onBackHandler
}: ServiceDetailViewProps) {
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
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
  }[service.status];
  return (
      <Container>
          <Header title="Detalhes" onBackHandler={onBackHandler} noBorder />
    <View className="gap-4 p-4">
      {/* Informações do serviço */}
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <View className="flex-1 gap-1">
            <CardTitle>{service.clientName}</CardTitle>
            <Text className="text-muted">{service.serviceType}</Text>
          </View>

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
        </CardHeader>

        <CardContent className="gap-3">
          <View>
            <Text className="text-muted text-xs">Data</Text>
            <Text>{new Date(service.date).toLocaleDateString("pt-BR")}</Text>
          </View>

          {service.location && (
            <View>
              <Text className="text-muted text-xs">Local</Text>
              <Text>{service.location}</Text>
            </View>
          )}

          {service.observations && (
            <View>
              <Text className="text-muted text-xs">Observações</Text>
              <Text>{service.observations}</Text>
            </View>
          )}
        </CardContent>
      </Card>

      {/* Progresso do checklist */}
      <Card>
        <CardContent className="gap-4">
          <Text className="font-medium">Progresso do Checklist</Text>

          <View className="flex-row justify-between">
            <Text className="text-muted text-sm">Itens concluídos</Text>
            <Text className="text-sm font-medium">
              {completedItems}/{totalItems}
            </Text>
          </View>

          <Progress value={progress} />

          <Pressable
            onPress={onOpenChecklist}
            className="flex-row items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3"
          >
            <MaterialIcons name="checklist" size={20} color="white" />
            <Text className="text-primary-foreground font-medium">
              Abrir checklist
            </Text>
          </Pressable>
        </CardContent>
      </Card>

      {/* Ações */}
      {service.status === "completed" && onOpenReport && (
        <Pressable
          onPress={onOpenReport}
          className={cn(
            "rounded-lg border border-primary px-4 py-3",
            "items-center"
          )}
        >
          <Text className="text-primary font-medium">Ver relatório</Text>
        </Pressable>
      )}
    </View>
    </Container>
  );
}
