import Container from "@/components/container";
import { Header } from "@/components/ui/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { useConfigViewModel } from "@/core/config/viewmodels/useConfigVM";
import { cn } from "@/lib/utils";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { CompanyInfoForm } from "../components/company-info-form";
import { ReportHeaderPreview } from "../components/report-header-preview";
import { ServicesTypes } from "../components/services-types";
import { Templates } from "../components/templates";
import { UpgradeCard } from "../components/upgrade-card";

type SettingsTab = "templates" | "types" | "company";

type TemplateTemplate = {
  id: string;
  name: string;
  items: string[];
};
export default function SettingsView() {
  const {
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany,
    disableSave,
    handleOnEdit,
    saveServiceType,
    handleDelete,
    handleUpdate,
    newType,
    setNewType,
    setEditingType,
    setShowNewType,
    showNewType,
    editingType
  } = useConfigViewModel();

  const [tab, setTab] = useState<SettingsTab>("templates");
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useRouter();
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



  const INITIAL_TEMPLATES_TEMPLATE: TemplateTemplate[] = [
    {
      id: "1",
      name: "Manutenção Preventiva",
      items: ["Verificar níveis de óleo", "Apertar conexões", "Limpeza geral"],
    },
    {
      id: "2",
      name: "Instalação",
      items: ["Conferir equipamentos", "Fixação no local", "Teste final"],
    },
  ];

  const [templatesTemplate, setTemplatesTemplate] = useState<
    TemplateTemplate[]
  >(INITIAL_TEMPLATES_TEMPLATE);

  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const [newTemplate, setNewTemplate] = useState<{
    name: string;
    items: string[];
  }>({
    name: "",
    items: [""],
  });

  function handleAddTemplate() {
    if (!newTemplate.name.trim()) return;

    setTemplatesTemplate((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newTemplate.name.trim(),
        items: newTemplate.items.filter(Boolean),
      },
    ]);

    setNewTemplate({ name: "", items: [""] });
    setShowNewTemplate(false);
  }

  function handleUpdateTemplate(id: string, name: string, items: string[]) {
    setTemplatesTemplate((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name, items } : t))
    );
    setEditingTemplate(null);
  }

  function handleDeleteTemplate(id: string) {
    setTemplatesTemplate((prev) => prev.filter((t) => t.id !== id));

    if (editingTemplate === id) {
      setEditingTemplate(null);
    }
  }

  return (
    <Container>
      <Header
        title="Confirguracões"
        noBorder
        onBackHandler={() => navigation.back()}
      />
      <View className="flex h-full bg-surface gap-2">
        <View className="flex pt-4 pb-4 bg-white border-b border-gray-200">
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
          {tab === "templates" && (
            <Templates
              templates={templatesTemplate}
              showNewTemplate={showNewTemplate}
              newTemplate={newTemplate}
              editingTemplate={editingTemplate}
              setShowNewTemplate={setShowNewTemplate}
              setNewTemplate={setNewTemplate}
              setEditingTemplate={setEditingTemplate}
              onAdd={handleAddTemplate}
              onUpdate={handleUpdateTemplate}
              onDelete={handleDeleteTemplate}
            />
          )}
          {tab === "company" && (
            <ScrollView
              className="flex-1 gap-4"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
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
          )}
          {tab === "types" && (
            <ServicesTypes
              serviceTypes={serviceTypes}
              showNewType={showNewType}
              newType={newType}
              editingType={editingType}
              setShowNewType={setShowNewType}
              setNewType={setNewType}
              setEditingType={setEditingType}
              onAdd={saveServiceType}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </View>
        {tab === "company" && (
          <View className="bg-white border-t border-border px-4 pt-4">
            <TouchableOpacity
              disabled={disableSave}
              style={{ marginBottom: tabBarHeight }}
              className={cn(
                "bg-primary py-4 rounded-xl items-center",
                disableSave ? " bg-secondary" : ""
              )}
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
