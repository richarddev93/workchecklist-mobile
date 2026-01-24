import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import Container from "@/components/container";
import { Header } from "@/components/ui/header";
import { Progress } from "@/components/ui/progress";
import { Colors } from "@/constants/theme";
import { ServiceStatus } from "@/types";
import { ChecklistItemComponent } from "../components/checklist-item";
import { useServiceChecklistViewModel } from "../viewmodels/useServiceChecklistVM";
import { useServiceViewModel } from "../viewmodels/useServiceVM";

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

  const displayClientName =
    (service as any).client_name ?? service.clientName ?? "Serviço sem nome";
  const displayServiceType =
    (service as any).service_type ?? service.serviceType ?? "Tipo não definido";
  const displayDate = (service as any).service_date ?? service.date ?? "";
  const displayAddress = (service as any).location ?? service.address ?? "";
  const displayStatusLabel =
    normalizedStatus === "in-progress"
      ? "Em andamento"
      : normalizedStatus === "completed"
        ? "Concluído"
        : "Pendente";

  async function handleToggle(itemId: string) {
    if (!isInProgress) {
      Alert.alert(
        "Inicie o serviço",
        "Para concluir itens, primeiro inicie o serviço.",
      );
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
      Alert.alert(
        "Checklist incompleto",
        "Complete todos os itens antes de finalizar o serviço.",
      );
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
      <View className="flex-1 bg-gray-50">
        <Header
          title="Checklist do Serviço"
          subtitle="Gerencie os itens do checklist"
          onBackHandler={onBack}
          onActionPress={handleDelete}
          actionIcon="delete-outline"
          actionLabel="Excluir serviço"
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Card */}
          <View className="px-4 pt-4 pb-3">
            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <View className="p-5">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1 pr-3">
                    <Text className="text-2xl font-bold text-gray-900 mb-1">
                      {displayClientName}
                    </Text>
                    <Text className="text-base text-gray-600">
                      {displayServiceType}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: statusStyle.bg,
                      borderColor: statusStyle.border,
                    }}
                    className="px-4 py-2 rounded-full border-2"
                  >
                    <Text
                      style={{ color: statusStyle.text }}
                      className="text-sm font-semibold"
                    >
                      {displayStatusLabel}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-6">
                  {displayDate ? (
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                        Data
                      </Text>
                      <Text className="text-base font-semibold text-gray-900">
                        {(() => {
                          try {
                            return new Date(displayDate).toLocaleDateString(
                              "pt-BR",
                            );
                          } catch {
                            return displayDate;
                          }
                        })()}
                      </Text>
                    </View>
                  ) : null}

                  {displayAddress ? (
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                        Local
                      </Text>
                      <Text className="text-base font-semibold text-gray-900">
                        {displayAddress}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>

          {/* Progress Card */}
          <View className="px-4 pb-3">
            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Progresso do Checklist
              </Text>

              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm font-medium text-gray-600">
                  Itens concluídos
                </Text>
                <Text className="text-2xl font-bold text-blue-600">
                  {completedItems}/{totalItems}
                </Text>
              </View>

              <Progress value={progress} className="h-3" />
            </View>
          </View>

          {/* Checklist Items */}
          <View className="px-4">
            {checklist.length === 0 ? (
              <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
                <Text className="text-center text-gray-400 text-base">
                  Carregando checklist...
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {checklist.map((item) => (
                  <ChecklistItemComponent
                    key={item.id}
                    item={item}
                    onToggle={() => handleToggle(item.id)}
                    onNoteChange={(note) => updateNote(item.id, note)}
                    onPhotosChange={(photos) => updatePhotos(item.id, photos)}
                    disabledToggle={!isInProgress}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fixed Bottom Action Button */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-2xl">
          {normalizedStatus === "pending" && (
            <TouchableOpacity
              onPress={() => {
                try {
                  markInProgress();
                } catch (error) {
                  Alert.alert("Erro", "Não foi possível iniciar o serviço.");
                }
              }}
              className="rounded-2xl py-4 items-center bg-orange-500 shadow-lg"
              style={{
                shadowColor: "#f97316",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text className="font-bold text-white text-lg">
                Iniciar serviço
              </Text>
            </TouchableOpacity>
          )}

          {normalizedStatus === "in-progress" && (
            <TouchableOpacity
              disabled={!allCompleted}
              onPress={handleComplete}
              className={`rounded-2xl py-4 items-center ${
                allCompleted ? "bg-emerald-500 shadow-lg" : "bg-gray-200"
              }`}
              style={
                allCompleted
                  ? {
                      shadowColor: "#10b981",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }
                  : {}
              }
            >
              <Text
                className={`font-bold text-lg ${
                  allCompleted ? "text-white" : "text-gray-400"
                }`}
              >
                Finalizar serviço
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Container>
  );
}
