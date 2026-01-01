import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useConfig } from "@/context/ConfigContext";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

type SettingsTab = "templates" | "types" | "company";

export default function SettingsView() {
  const {
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
  } = useConfig();

  const [tab, setTab] = useState<SettingsTab>("templates");

  async function pickLogo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      updateCompanyInfo({
        logo: `data:image/png;base64,${result.assets[0].base64}`,
      });
    }
  }

  return (
    <View className="flex-1 gap-2 bg-background">
      {/* Header */}
      <View className="flex gap-5 px-4 pt-4 pb-8">
        <Text className="text-xl font-semibold mb-3">Configurações</Text>

        <Tabs value={tab} onValueChange={(v) => setTab(v as SettingsTab)}>
          <TabsList className="flex-row gap-2  p-2 bg-transparent">
            {[
              { value: "templates", label: "Templates" },
              { value: "types", label: "Tipos de Serviço" },
              { value: "company", label: "Informações da Empresa" },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={cn(
                  "flex flex-1  items-center rounded-lg px-4 py-2 h-16 border border-border",

                  tab === t.value
                    ? "!bg-primary !border-tab-icon-selected"
                    : "bg-transparent"
                )}
              >
                <Text
                  className={cn(
                    "text-sm text-center",
                    tab === t.value ? "!text-white" : "text-gray-600"
                  )}
                >
                  {t.label}
                </Text>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* Upgrade Card */}
        <View className="bg-primary rounded-xl p-4 mb-5">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="ribbon-outline" size={18} color="white" />
            <Text className="text-white font-semibold">
              Upgrade para Premium
            </Text>
          </View>
          <Text className="text-white/90 text-sm mb-3">
            Desbloqueie recursos ilimitados e remova anúncios
          </Text>
          <TouchableOpacity className="bg-white self-start px-4 py-2 rounded-lg">
            <Text className="text-primary font-medium">Ver Planos</Text>
          </TouchableOpacity>
        </View>

        {/* TEMPLATES */}
        {tab === "templates" && (
          <>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">
                {templates.length} templates
              </Text>

              <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
                <Text className="text-white font-medium">+ Novo template</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {templates.map((tpl) => (
                <View
                  key={tpl.id}
                  className="bg-white rounded-xl p-4 border border-border"
                >
                  <View className="flex-row justify-between mb-2">
                    <Text className="font-semibold">{tpl.name}</Text>

                    <View className="flex-row gap-3">
                      <Ionicons name="create-outline" size={18} />
                      <TouchableOpacity onPress={() => deleteTemplate(tpl.id)}>
                        <Ionicons name="trash-outline" size={18} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {tpl.items.map((item, i) => (
                    <View key={i} className="flex-row gap-2 items-center">
                      <View className="w-5 h-5 rounded bg-gray-100 items-center justify-center">
                        <Text className="text-xs">{i + 1}</Text>
                      </View>
                      <Text className="text-gray-600">{item}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </>
        )}

        {/* TIPOS */}
        {tab === "types" && (
          <>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600">{serviceTypes.length} tipos</Text>

              <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
                <Text className="text-white font-medium">+ Novo tipo</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {serviceTypes.map((type) => (
                <View
                  key={type.id}
                  className="bg-white rounded-xl p-4 border border-border flex-row justify-between"
                >
                  <Text>{type.name}</Text>

                  <View className="flex-row gap-3">
                    <Ionicons name="create-outline" size={18} />
                    <TouchableOpacity
                      onPress={() => deleteServiceType(type.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* EMPRESA */}
        {tab === "company" && (
          <>
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <Text className="text-blue-700 text-sm">
                Essas informações aparecerão no cabeçalho e rodapé dos
                relatórios
              </Text>
            </View>

            <View className="bg-white rounded-xl p-4 border border-border gap-3">
              <Text className="font-semibold">Nome da Empresa *</Text>
              <Text className="text-gray-600">{companyInfo.name}</Text>

              <Text className="font-semibold mt-2">Contato</Text>
              <Text className="text-gray-600">{companyInfo.phone || "-"}</Text>
              <Text className="text-gray-600">{companyInfo.email || "-"}</Text>

              <Text className="font-semibold mt-2">Endereço</Text>
              <Text className="text-gray-600">
                {companyInfo.address || "-"}
              </Text>

              <TouchableOpacity
                onPress={pickLogo}
                className="flex-row items-center gap-2 mt-3"
              >
                <Ionicons name="image-outline" size={20} />
                <Text className="text-primary">
                  {companyInfo.logo ? "Alterar logo" : "Upload da logo"}
                </Text>
              </TouchableOpacity>

              {companyInfo.logo && (
                <Image
                  source={{ uri: companyInfo.logo }}
                  className="mt-3 w-40 h-16"
                  resizeMode="contain"
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
