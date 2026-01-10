import Container from "@/components/container";
import { Header } from "@/components/ui/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useConfigViewModel } from "@/core/config/viewmodels/useConfigVM";
import { cn } from "@/lib/utils";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { CompanyInfoForm } from "../components/company-info-form";
import { ReportHeaderPreview } from "../components/report-header-preview";
import { UpgradeCard } from "../components/upgrade-card";

type SettingsTab = "templates" | "types" | "company";

export default function SettingsView() {
  const {
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany,
  } = useConfigViewModel();

  const [tab, setTab] = useState<SettingsTab>("templates");
  const tabBarHeight = useBottomTabBarHeight();
  const { height } = useWindowDimensions();

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

  function cleanLogo() {
    updateCompanyInfo({ logo: undefined });
  }

  return (
    <Container>
      <Header noBorder />
      <View className="flex h-full bg-surface gap-2">
        <View className="flex pb-4 bg-white border-b border-gray-200">
          <Tabs value={tab} onValueChange={(v) => setTab(v as SettingsTab)}>
            <TabsList className="flex-row gap-2 p-2 bg-transparent">
              {[
                { value: "templates", label: "Templates" },
                { value: "types", label: "Tipos de Serviço" },
                { value: "company", label: "Informações da Empresa" },
              ].map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-lg px-3 py-2 min-h-16 border",
                    tab === t.value
                      ? "!bg-primary !border-tab-icon-selected"
                      : "bg-secondary"
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
        <View className="flex flex-1 px-4">
          <UpgradeCard onHandler={() => console.log()} />

          <ScrollView
            className="flex-1 gap-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {tab === "company" && (
              <>
                <CompanyInfoForm
                  data={companyInfo}
                  onChange={updateCompanyInfo}
                  onPickLogo={pickLogo}
                  onCleanLogo={cleanLogo}
                />
                <ReportHeaderPreview companyInfo={companyInfo} />
              </>
            )}
          </ScrollView>
        </View>
        {tab === "company" && (
          <View className="bg-white border-t border-border px-4 pt-4">
            <TouchableOpacity
              style={{ marginBottom: tabBarHeight }}
              className="bg-primary py-4 rounded-xl items-center"
              onPress={() => saveCompany(companyInfo)}
            >
              <Text className="text-white font-semibold text-base">
                Salvar informações
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Container>
  );
}
