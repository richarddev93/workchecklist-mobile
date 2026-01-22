import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useConfig } from "@/context/ConfigContext";
import { useServices } from "../context/ServiceContext";

interface ServiceReportProps {
  serviceId: string;
  onBack: () => void;
}

export function ServiceReport({ serviceId, onBack }: ServiceReportProps) {
  const { getServiceById } = useServices();
  const { companyInfo } = useConfig();

  const dbService = getServiceById(serviceId);

  if (!dbService) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">Serviço não encontrado</Text>
      </View>
    );
  }

  // Map database fields (snake_case) to component fields
  const service = {
    id: dbService.id,
    clientName: dbService.client_name || "Sem informação",
    serviceType: dbService.service_type || "Sem informação",
    date: dbService.service_date || new Date().toISOString(),
    address: dbService.location || "Sem informação",
    checklist: dbService.checklist_data
      ? JSON.parse(dbService.checklist_data)
      : [],
  };

  const handleShare = () => {
    Alert.alert("Compartilhar", "Funcionalidade será implementada");
  };

  const handleDownload = () => {
    Alert.alert("Download", "Funcionalidade será implementada");
  };

  return (
    <View className="flex-1 bg-background">
      {/* HEADER */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">
              Relatório
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity onPress={handleDownload} className="p-2">
              <Ionicons name="download-outline" size={22} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} className="p-2">
              <Ionicons name="share-social-outline" size={22} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4 space-y-4">
        {/* EMPRESA */}
        <View className="bg-white rounded-lg p-4 border border-gray-200">
          <View className="flex-row gap-4 pb-4 border-b border-gray-200">
            {companyInfo.logo && (
              <Image
                source={{ uri: companyInfo.logo }}
                className="w-28 h-14"
                resizeMode="contain"
              />
            )}

            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">
                {companyInfo.name}
              </Text>
              {companyInfo.address && (
                <Text className="text-gray-600">{companyInfo.address}</Text>
              )}
              <View className="flex-row flex-wrap gap-3 mt-1">
                {companyInfo.phone && (
                  <Text className="text-gray-600">{companyInfo.phone}</Text>
                )}
                {companyInfo.email && (
                  <Text className="text-gray-600">{companyInfo.email}</Text>
                )}
              </View>
            </View>
          </View>

          <View className="pt-4 space-y-2">
            <Text className="text-center font-semibold text-gray-900">
              Relatório de Serviço
            </Text>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Data de emissão</Text>
              <Text className="text-gray-900">
                {new Date().toLocaleDateString("pt-BR")}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Nº do serviço</Text>
              <Text className="text-gray-900">#{service.id}</Text>
            </View>
          </View>
        </View>

        {/* CLIENTE */}
        <View className="bg-white rounded-lg p-4 border border-gray-200">
          <Text className="text-gray-900 font-semibold mb-3">
            Dados do cliente
          </Text>

          <View className="space-y-2">
            <View>
              <Text className="text-gray-600">Nome</Text>
              <Text className="text-gray-900">{service.clientName}</Text>
            </View>

            <View>
              <Text className="text-gray-600">Tipo de serviço</Text>
              <Text className="text-gray-900">{service.serviceType}</Text>
            </View>

            <View>
              <Text className="text-gray-600">Data</Text>
              <Text className="text-gray-900">
                {new Date(service.date).toLocaleDateString("pt-BR")}
              </Text>
            </View>

            {service.address && (
              <View>
                <Text className="text-gray-600">Local</Text>
                <Text className="text-gray-900">{service.address}</Text>
              </View>
            )}
          </View>
        </View>

        {/* CHECKLIST */}
        <View className="bg-white rounded-lg p-4 border border-gray-200">
          <Text className="text-gray-900 font-semibold mb-3">
            Checklist executado
          </Text>

          {service.checklist.map((item) => {
            const photos = item.photos ?? [];
            const hasPhotos = photos.length > 0;

            return (
              <View
                key={item.id}
                className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0"
              >
                <View className="flex-row gap-3">
                  <Ionicons
                    name={item.completed ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={item.completed ? "#10b981" : "#d1d5db"}
                  />

                  <View className="flex-1">
                    <Text
                      className={
                        item.completed ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {item.title}
                    </Text>

                    {hasPhotos && (
                      <View className="flex-row items-center gap-1 mt-1">
                        <Ionicons
                          name="camera-outline"
                          size={14}
                          color="#2563eb"
                        />
                        <Text className="text-[#2563eb] text-xs">
                          {photos.length} foto(s)
                        </Text>
                      </View>
                    )}

                    {item.note && (
                      <View className="mt-2 bg-blue-50 border border-blue-100 rounded-md p-2">
                        <Text className="text-gray-700">
                          <Text className="font-semibold">Obs: </Text>
                          {item.note}
                        </Text>
                      </View>
                    )}

                    {hasPhotos && (
                      <View className="flex-row flex-wrap gap-2 mt-3">
                        {photos.map((photo, index) => (
                          <Image
                            key={index}
                            source={{ uri: photo }}
                            className="w-24 h-24 rounded-lg border border-gray-200"
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* OBSERVAÇÕES */}
        {/*service.observations && (
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="text-gray-900 font-semibold mb-2">
              Observações
            </Text>
            <Text className="text-gray-600">{service.observations}</Text>
          </View>
        )*/}

        {/* RESUMO */}
        <View className="bg-white rounded-lg p-4 border border-gray-200">
          <Text className="text-gray-900 font-semibold mb-2">Resumo</Text>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Status</Text>
            <Text className="text-emerald-600 font-medium">Concluído</Text>
          </View>

          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-600">Itens concluídos</Text>
            <Text className="text-gray-900">
              {service.checklist.filter((i) => i.completed).length}/
              {service.checklist.length}
            </Text>
          </View>
        </View>

        {/* FOOTER EMPRESA */}
        <View className="bg-white rounded-lg p-4 border border-gray-200">
          <View className="border-t border-gray-200 pt-4 items-center">
            <Text className="text-gray-900 font-medium">
              {companyInfo.name}
            </Text>

            <View className="flex-row gap-2 mt-1">
              {companyInfo.phone && (
                <Text className="text-gray-600">{companyInfo.phone}</Text>
              )}
              {companyInfo.email && (
                <Text className="text-gray-600">{companyInfo.email}</Text>
              )}
            </View>

            {companyInfo.address && (
              <Text className="text-gray-600 mt-1 text-center">
                {companyInfo.address}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
