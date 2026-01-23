import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useConfig } from "@/context/ConfigContext";
import { analyticsEvents } from "@/lib/analytics";
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

  const generateReportText = (): string => {
    const lines: string[] = [];

    // Header
    lines.push("═".repeat(60));
    lines.push("RELATÓRIO DE SERVIÇO".padStart(35));
    lines.push("═".repeat(60));
    lines.push("");

    // Empresa
    lines.push("INFORMAÇÕES DA EMPRESA");
    lines.push("─".repeat(60));
    lines.push(`Nome: ${companyInfo.name}`);
    if (companyInfo.address) {
      lines.push(`Endereço: ${companyInfo.address}`);
    }
    if (companyInfo.phone) {
      lines.push(`Telefone: ${companyInfo.phone}`);
    }
    if (companyInfo.email) {
      lines.push(`Email: ${companyInfo.email}`);
    }
    lines.push("");

    // Info do Relatório
    lines.push("INFORMAÇÕES DO RELATÓRIO");
    lines.push("─".repeat(60));
    lines.push(`Data de Emissão: ${new Date().toLocaleDateString("pt-BR")}`);
    lines.push(`Nº do Serviço: #${service.id}`);
    lines.push("");

    // Cliente
    lines.push("DADOS DO CLIENTE");
    lines.push("─".repeat(60));
    lines.push(`Nome: ${service.clientName}`);
    lines.push(`Tipo de Serviço: ${service.serviceType}`);
    lines.push(
      `Data do Serviço: ${new Date(service.date).toLocaleDateString("pt-BR")}`,
    );
    lines.push(`Local: ${service.address}`);
    lines.push("");

    // Checklist
    lines.push("CHECKLIST EXECUTADO");
    lines.push("─".repeat(60));
    service.checklist.forEach((item, index) => {
      const status = item.completed ? "[✓]" : "[✗]";
      lines.push(`${status} ${item.title}`);

      if (item.note) {
        lines.push(`    Obs: ${item.note}`);
      }
      if (item.photos && item.photos.length > 0) {
        lines.push(`    Fotos: ${item.photos.length} foto(s) anexada(s)`);
      }
    });
    lines.push("");

    // Resumo
    lines.push("RESUMO");
    lines.push("─".repeat(60));
    const completedCount = service.checklist.filter((i) => i.completed).length;
    lines.push(`Status: Concluído`);
    lines.push(
      `Itens Concluídos: ${completedCount}/${service.checklist.length}`,
    );
    lines.push("");

    // Footer
    lines.push("═".repeat(60));
    lines.push("Relatório gerado por WorkCheckList".padStart(38));
    lines.push("═".repeat(60));

    return lines.join("\n");
  };

  const onDownloadReport = async () => {
    try {
      const reportText = generateReportText();
      const fileName = `relatorio_${service.clientName.replace(/\s+/g, "_")}_${new Date().getTime()}.txt`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, reportText);

      Alert.alert("✓ Sucesso", `Relatório salvo como: ${fileName}`);
    } catch (error) {
      Alert.alert("✗ Erro", "Não foi possível salvar o relatório");
      console.error(error);
    }
  };

  const onShareReport = async () => {
    try {
      const reportText = generateReportText();

      await Share.share({
        message: reportText,
        title: `Relatório - ${service.clientName}`,
      });

      analyticsEvents.reportShared({ channel: "text" });
    } catch (error) {
      const isOffline =
        typeof globalThis !== "undefined" &&
        (globalThis as any).navigator?.onLine === false;
      if (isOffline) {
        analyticsEvents.offlineUsed({ screen: "service_report_share" });
      }
      Alert.alert("✗ Erro", "Não foi possível compartilhar o relatório");
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* HEADER */}
      <View className="bg-white border-b border-gray-200 px-4 py-4 pt-6">
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
            <TouchableOpacity onPress={onDownloadReport} className="p-2">
              <Ionicons name="download-outline" size={22} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShareReport} className="p-2">
              <Ionicons name="share-social-outline" size={22} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4 pb-40">
        {/* EMPRESA */}
        <View className="bg-white rounded-lg p-5 border border-gray-200 mb-6">
          <View className="flex-row gap-4 pb-5 border-b border-gray-200">
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

          <View className="pt-5 space-y-3">
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
        <View className="bg-white rounded-lg p-5 border border-gray-200 mb-6">
          <Text className="text-gray-900 font-semibold mb-4">
            Dados do cliente
          </Text>

          <View className="space-y-3">
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
        <View className="bg-white rounded-lg p-5 border border-gray-200 mb-6">
          <Text className="text-gray-900 font-semibold mb-4">
            Checklist executado
          </Text>

          {service.checklist.map((item) => {
            const photos = item.photos ?? [];
            const hasPhotos = photos.length > 0;

            return (
              <View
                key={item.id}
                className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0"
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
        <View className="bg-white rounded-lg p-5 border border-gray-200 mb-6">
          <Text className="text-gray-900 font-semibold mb-4">Resumo</Text>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Status</Text>
            <Text className="text-emerald-600 font-medium">Concluído</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Itens concluídos</Text>
            <Text className="text-gray-900">
              {service.checklist.filter((i) => i.completed).length}/
              {service.checklist.length}
            </Text>
          </View>
        </View>

        {/* FOOTER EMPRESA */}
        <View className="bg-white rounded-lg p-5 border border-gray-200 mb-6">
          <View className="border-t border-gray-200 pt-5 pb-2 items-center">
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

        {/* BRANDING FOOTER */}
        <View className="items-center py-8">
          <Image
            source={require("@/assets/images/icon.png")}
            className="w-12 h-12 mb-3"
            resizeMode="contain"
          />
          <Text className="text-gray-500 text-sm font-medium">
            Relatório por WorkCheckList
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
