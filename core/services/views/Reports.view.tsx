import AdMobManager from "@/components/admob/admob-manager";
import Container from "@/components/container";
import { Header } from "@/components/ui/header";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Service } from "@/types";
import { getBannerAdUnitId } from "@/lib/ads";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
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
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "name_asc">(
    "date_desc",
  );

  const parseServiceDate = (value?: string) => {
    if (!value) return 0;
    if (value.includes("/")) {
      const [day, month, year] = value.split("/").map(Number);
      if (day && month && year) {
        return new Date(year, month - 1, day).getTime();
      }
    }
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const sortedServices = useMemo(() => {
    const list = [...completedServices];

    switch (sortBy) {
      case "date_asc":
        return list.sort(
          (a, b) =>
            parseServiceDate(a.service_date) - parseServiceDate(b.service_date),
        );
      case "name_asc":
        return list.sort((a, b) =>
          String(a.client_name || "").localeCompare(
            String(b.client_name || ""),
          ),
        );
      case "date_desc":
      default:
        return list.sort(
          (a, b) =>
            parseServiceDate(b.service_date) - parseServiceDate(a.service_date),
        );
    }
  }, [completedServices, sortBy]);

  const handleSortChange = (option: any) => {
    const nextValue =
      typeof option === "string" ? option : (option?.value ?? "date_desc");
    setSortBy(nextValue as "date_desc" | "date_asc" | "name_asc");
  };

  return (
    <View className="flex-1">
      <Container>
        {/* Header */}
        <Header title="Relatórios" subtitle="Serviços concluídos" />

        {/* Content */}
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <View className="mb-4 items-start">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="rounded-full px-4 py-2 h-10 border border-border bg-gray-100">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="filter" size={16} color="#6b7280" />
                  <SelectValue placeholder="Ordenar" className="text-md" />
                </View>
              </SelectTrigger>
              <SelectContent className="w-56 bg-white">
                <SelectGroup>
                  <SelectItem label="Mais recentes" value="date_desc">
                    Mais recentes
                  </SelectItem>
                  <SelectItem label="Mais antigas" value="date_asc">
                    Mais antigas
                  </SelectItem>
                  <SelectItem label="Nome do cliente" value="name_asc">
                    Nome do cliente
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>

          {sortedServices.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#d1d5db"
              />
              <Text className="text-gray-500 mt-4">
                Nenhum relatório disponível
              </Text>
              <Text className="text-gray-400 mt-2 text-center">
                Complete um serviço para gerar relatórios
              </Text>
            </View>
          ) : (
            sortedServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => {
                  onNavigate(service.id);
                }}
                className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm"
                activeOpacity={0.85}
              >
                <View className="flex-row items-start gap-3">
                  <View className="w-1 rounded-full bg-primary mt-1" />

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-900 font-semibold text-base">
                        {service.client_name || "Cliente não informado"}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2 mt-1">
                      <Ionicons
                        name="briefcase-outline"
                        size={14}
                        color="#6b7280"
                      />
                      <Text className="text-gray-600 text-sm">
                        {service.service_type || "Tipo não informado"}
                      </Text>
                    </View>

                    <View className="flex-row flex-wrap items-center gap-4 mt-2">
                      {service.service_date && (
                        <View className="flex-row items-center gap-1">
                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#6b7280"
                          />
                          <Text className="text-gray-500 text-sm">
                            {new Date(service.service_date).toLocaleDateString(
                              "pt-BR",
                            )}
                          </Text>
                        </View>
                      )}

                      {service.location && (
                        <View className="flex-row items-center gap-1">
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#6b7280"
                          />
                          <Text
                            className="text-gray-500 text-sm"
                            numberOfLines={1}
                          >
                            {service.location}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View className="items-center justify-center">
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9ca3af"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Container>
      <View className="bg-white justify-center items-center">
        <AdMobManager unitId={getBannerAdUnitId("reports_banner")} />
      </View>
    </View>
  );
}
