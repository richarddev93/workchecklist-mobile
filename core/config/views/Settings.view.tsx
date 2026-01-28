import Container from "@/components/container";
import { Header } from "@/components/ui/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useConfigViewModel } from "@/core/config/viewmodels/useConfigVM";
import { cn } from "@/lib/utils";
import { SettingsTab } from "@/types";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { CompanyInfoForm } from "../components/company-info-form";
import { ReportHeaderPreview } from "../components/report-header-preview";
import { ServicesTypes } from "../components/services-types";
import { Templates } from "../components/templates";
import { UpgradeCard } from "../components/upgrade-card";

export default function SettingsView() {
  const {
    templates,
    serviceTypes,
    companyInfo,
    saveCompany,
    disableSave,
    handleOnEdit,
    saveServiceType,
    handleDeleteServiceType,
    handleUpdateServiceType,
    newType,
    setNewType,
    setEditingType,
    setShowNewType,
    showNewType,
    editingType,
    pickLogo,
    cleanLogo,
    templatesHandle,
    updateCompanyInfo,
    resetAllData,
  } = useConfigViewModel();

  const [tab, setTab] = useState<SettingsTab>("templates");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useRouter();

  /* 🔍 Detecta teclado */
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardOpen(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardOpen(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const hideUpgradeCard = true;

  return (
    <Container>
      <Header title="Configurações" noBorder />

      <View className="flex-1 bg-surface">
        {/* Tabs fixas */}
        <View className="pt-4 pb-4 bg-white border-b border-gray-200">
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
                      : "bg-secondary",
                  )}
                >
                  <Text
                    className={cn(
                      "text-sm text-center",
                      tab === t.value ? "!text-white" : "text-gray-600",
                    )}
                  >
                    {t.label}
                  </Text>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </View>

        {/* 👇 CONTEÚDO */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* UpgradeCard NÃO rola */}
          {!hideUpgradeCard && (
            <View className="px-2">
              <UpgradeCard onHandler={() => console.log()} />
            </View>
          )}

          {/* ---------- TEMPLATES (SEM SCROLL) ---------- */}
          {tab === "templates" && (
            <View className="flex-1 px-2">
              <Templates
                templates={templates}
                showNewTemplate={templatesHandle.showNewTemplate}
                newTemplate={templatesHandle.newTemplate}
                editingTemplate={templatesHandle.editingTemplate}
                setShowNewTemplate={templatesHandle.setShowNewTemplate}
                setNewTemplate={templatesHandle.setNewTemplate}
                setEditingTemplate={templatesHandle.setEditingTemplate}
                onAdd={templatesHandle.handleAddTemplate}
                onUpdate={templatesHandle.handleUpdateTemplate}
                onDelete={templatesHandle.handleDeleteTemplate}
                types={serviceTypes}
              />
            </View>
          )}

          {/* ---------- TYPES (SEM SCROLL) ---------- */}
          {tab === "types" && (
            <View className="flex-1 px-2">
              <ServicesTypes
                serviceTypes={serviceTypes}
                showNewType={showNewType}
                newType={newType}
                editingType={editingType}
                setShowNewType={setShowNewType}
                setNewType={setNewType}
                setEditingType={setEditingType}
                onAdd={saveServiceType}
                onUpdate={handleUpdateServiceType}
                onDelete={handleDeleteServiceType}
              />
            </View>
          )}

          {/* ---------- COMPANY (SÓ FORM ROLA) ---------- */}
          {tab === "company" && (
            <>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                  paddingBottom: tabBarHeight + 120,
                }}
              >
                <CompanyInfoForm
                  data={companyInfo}
                  onChange={updateCompanyInfo}
                  onPickLogo={pickLogo}
                  onCleanLogo={cleanLogo}
                  onEdit={handleOnEdit}
                />

                <ReportHeaderPreview companyInfo={companyInfo} />
              </ScrollView>

              {/* Botão FIXO */}
              <View className="bg-white border-t border-border px-4 pt-4">
                <TouchableOpacity
                  disabled={disableSave}
                  className={cn(
                    "py-4 rounded-xl items-center",
                    disableSave ? "bg-secondary" : "bg-primary",
                  )}
                  onPress={() => saveCompany(companyInfo)}
                >
                  <Text className="text-white font-semibold text-base">
                    Salvar informações
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-4 rounded-xl items-center mt-3 bg-red-500"
                  onPress={resetAllData}
                  activeOpacity={0.85}
                >
                  <Text className="text-white font-semibold text-base">
                    Resetar dados (serviços, tipos, templates)
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
}
