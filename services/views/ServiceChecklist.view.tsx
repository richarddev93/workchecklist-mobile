import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Colors } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { ServiceStatus } from "@/types";
import { ChecklistItemComponent } from "../components/checklist-item";
import { useServiceChecklistViewModel } from "../viewmodels/useServiceChecklistVM";

interface ServiceChecklistProps {
  serviceId: string;
  onBack: () => void;
}

export function ServiceChecklistView({
  serviceId,
  onBack,
}: ServiceChecklistProps) {
  const {
    service,
    completedItems,
    totalItems,
    hasAnyCompleted,
    allCompleted,
    toggleItem,
    updateNote,
    updatePhotos,
    markInProgress,
    completeService,
  } = useServiceChecklistViewModel(serviceId);

  const [showFeedback, setShowFeedback] = useState(false);

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">Serviço não encontrado</Text>
      </View>
    );
  }

  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  function handleToggle(itemId: string) {
    toggleItem(itemId);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 300);
  }

  function handleComplete() {
    const success = completeService();

    if (!success) {
      Alert.alert(
        "Checklist incompleto",
        "Complete todos os itens antes de finalizar o serviço."
      );
      return;
    }

    onBack();
  }
  const statusStyles: Record<
    ServiceStatus,
    {
      bg: string;
      text: string;
      border: string;
    }
  > = {
    "in-progress": {
      bg: Colors.light.warning + "20",
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
  };
  const statusStyle = statusStyles[service.status];

  return (
    <View className="flex-1 bg-background px-4">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center gap-3 mb-4">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-900">
            Checklist do Serviços
          </Text>
        </View>

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

            {service.address && (
              <View>
                <Text className="text-muted text-xs">Local</Text>
                <Text>{service.address}</Text>
              </View>
            )}
          </CardContent>
        </Card>
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
          </CardContent>
        </Card>
      </View>

      {/* Checklist */}
      <ScrollView className="flex-1 px-4 py-4">
        {service.checklist.length === 0 ? (
          <Text className="text-center text-gray-500 py-12">
            Nenhum item no checklist
          </Text>
        ) : (
          service.checklist.map((item) => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              onToggle={() => handleToggle(item.id)}
              onNoteChange={(note) => updateNote(item.id, note)}
              onPhotosChange={(photos) => updatePhotos(item.id, photos)}
            />
          ))
        )}
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-200 bg-white p-4">
        {service.status === "pending" && (
          <TouchableOpacity
            disabled={!hasAnyCompleted}
            onPress={markInProgress}
            className={`rounded-lg py-3 items-center ${
              hasAnyCompleted ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-medium ${
                hasAnyCompleted ? "text-white" : "text-gray-400"
              }`}
            >
              Iniciar serviço
            </Text>
          </TouchableOpacity>
        )}

        {service.status === "in-progress" && (
          <TouchableOpacity
            disabled={!allCompleted}
            onPress={handleComplete}
            className={`rounded-lg py-3 items-center ${
              allCompleted ? "bg-emerald-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-medium ${
                allCompleted ? "text-white" : "text-gray-400"
              }`}
            >
              Finalizar serviço
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
