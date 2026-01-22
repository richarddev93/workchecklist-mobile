import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import Container from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Progress } from "@/components/ui/progress";
import { Colors } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { ServiceStatus } from "@/types";
import { ChecklistItemComponent } from "../components/checklist-item";
import { useServiceChecklistViewModel } from "../viewmodels/useServiceChecklistVM";
import { useServiceViewModel } from "../viewmodels/useServiceVM";

interface ServiceChecklistProps {
  serviceId: string;
  onBack: () => void;
}

export function ServiceChecklistView({ serviceId, onBack }: ServiceChecklistProps) {
  const {
    service,
    checklist,
    completedItems,
    totalItems,
    allCompleted,
    toggleItem,
    updateNote,
    updatePhotos,
    markInProgress,
    completeService,
  } = useServiceChecklistViewModel(serviceId);

  const [deleting, setDeleting] = useState(false);
  const { deleteService } = useServiceViewModel();

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">Serviço não encontrado</Text>
      </View>
    );
  }

  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isInProgress = service.status === "in-progress";

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

  const normalizedStatus = (service.status as ServiceStatus) || "pending";
  const statusStyle = statusStyles[normalizedStatus] ?? statusStyles.pending;

  const displayClientName = (service as any).client_name ?? service.clientName ?? "Serviço sem nome";
  const displayServiceType = (service as any).service_type ?? service.serviceType ?? "Tipo não definido";
  const displayDate = (service as any).service_date ?? service.date ?? "";
  const displayAddress = (service as any).location ?? service.address ?? "";
  const displayStatusLabel = normalizedStatus === "in-progress"
    ? "Em andamento"
    : normalizedStatus === "completed"
      ? "Concluído"
      : "Pendente";

  async function handleToggle(itemId: string) {
    if (!isInProgress) {
      Alert.alert("Inicie o serviço", "Para concluir itens, primeiro inicie o serviço.");
      return;
    }

    try {
      await toggleItem(itemId);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o item.");
    }
  }

  async function handleComplete() {
    const success = await completeService();

    if (!success) {
      Alert.alert("Checklist incompleto", "Complete todos os itens antes de finalizar o serviço.");
      return;
    }

    onBack();
  }

  function handleDelete() {
    if (!service || deleting) return;

    Alert.alert(
      "Excluir serviço",
      "Tem certeza que deseja excluir este serviço? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteService(String(serviceId));
              onBack();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o serviço.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  }

  return (
    <Container>
      <View className="flex-1 bg-background px-4">
        <Header
          title="Checklist do Serviço"
          subtitle="Gerencie os itens do checklist"
          onBackHandler={onBack}
          onActionPress={handleDelete}
          actionIcon="delete-outline"
          actionLabel="Excluir serviço"
        />

        <View className="bg-white border-b border-gray-200 px-4 py-4 gap-4">
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-2">
              <View className="flex-1 gap-1">
                <CardTitle className="text-xl font-bold">
                  {displayClientName}
                </CardTitle>
                <Text className="text-muted text-base">{displayServiceType}</Text>
              </View>

              <View
                style={{ backgroundColor: statusStyle.bg, borderColor: statusStyle.border }}
                className={cn("px-3 py-1 rounded-full border")}
              >
                <Text style={{ color: statusStyle.text }} className={cn("text-xs font-medium")}>
                  {displayStatusLabel}
                </Text>
              </View>
            </CardHeader>

            <CardContent className="gap-3">
              {displayDate ? (
                <View>
                  <Text className="text-muted text-xs">Data</Text>
                  <Text className="text-base font-medium">
                    {(() => {
                      try {
                        return new Date(displayDate).toLocaleDateString("pt-BR");
                      } catch {
                        return displayDate;
                      }
                    })()}
                  </Text>
                </View>
              ) : null}

              {displayAddress ? (
                <View>
                  <Text className="text-muted text-xs">Local</Text>
                  <Text className="text-base font-medium">{displayAddress}</Text>
                </View>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="gap-4">
              <Text className="font-semibold text-lg">Progresso do Checklist</Text>

              <View className="flex-row justify-between items-center">
                <Text className="text-muted text-sm">Itens concluídos</Text>
                <Text className="text-sm font-bold text-primary">
                  {completedItems}/{totalItems}
                </Text>
              </View>

              <Progress value={progress} />
            </CardContent>
          </Card>
        </View>

        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          {checklist.length === 0 ? (
            <View className="flex-1 justify-center">
              <Text className="text-center text-gray-500 py-12">Carregando checklist...</Text>
            </View>
          ) : (
            checklist.map((item) => (
              <ChecklistItemComponent
                key={item.id}
                item={item}
                onToggle={() => handleToggle(item.id)}
                onNoteChange={(note) => updateNote(item.id, note)}
                onPhotosChange={(photos) => updatePhotos(item.id, photos)}
                disabledToggle={!isInProgress}
              />
            ))
          )}
        </ScrollView>

        <View className="border-t border-gray-200 bg-white p-4">
          {normalizedStatus === "pending" && (
            <TouchableOpacity
              onPress={() => {
                try {
                  markInProgress();
                } catch (error) {
                  Alert.alert("Erro", "Não foi possível iniciar o serviço.");
                }
              }}
              className="rounded-lg py-3 items-center bg-orange-500"
            >
              <Text className="font-medium text-white">Iniciar serviço</Text>
            </TouchableOpacity>
          )}

          {normalizedStatus === "in-progress" && (
            <TouchableOpacity
              disabled={!allCompleted}
              onPress={handleComplete}
              className={`rounded-lg py-3 items-center ${allCompleted ? "bg-emerald-500" : "bg-gray-100"}`}
            >
              <Text className={`font-medium ${allCompleted ? "text-white" : "text-gray-400"}`}>
                Finalizar serviço
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Container>
  );
}

