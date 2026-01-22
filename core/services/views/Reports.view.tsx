import Container from "@/components/container";
import { Header } from "@/components/ui/header";
import { Service } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ReportsProps {
  completedServices: Service[];
  onNavigate: (screen: string, params?: any) => void;
  onBack: () => void;
}

export function ReportsView({
  completedServices,
  onNavigate,
  onBack,
}: ReportsProps) {
  return (
    <Container>
      {/* Header */}
      <Header
        title="Relatórios"
        subtitle="Serviços concluídos"
      />

      {/* Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {completedServices.length === 0 ? (
          <View className="items-center py-12">
            <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4">
              Nenhum relatório disponível
            </Text>
            <Text className="text-gray-400 mt-2 text-center">
              Complete um serviço para gerar relatórios
            </Text>
          </View>
        ) : (
          completedServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => {
                onNavigate(service.id);
              }}
              className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
              activeOpacity={0.8}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium mb-1">
                    {service.clientName}
                  </Text>

                  <Text className="text-gray-600">{service.serviceType}</Text>

                  <Text className="text-gray-500 mt-2">
                    {new Date(service.date).toLocaleDateString("pt-BR")}
                  </Text>
                </View>

                <Ionicons name="document-text" size={22} color="#2563eb" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Container>
  );
}
