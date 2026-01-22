import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Text } from "@/components/ui/text";
import { useConfigViewModel } from "@/core/config/viewmodels/useConfigVM";
import { useServiceViewModel } from "@/core/services/viewmodels/useServiceVM";
import { Service } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Toast } from "toastify-react-native";

export function NewServiceView() {
  const router = useRouter();
  const { templates, serviceTypes } = useConfigViewModel();
  const { addService } = useServiceViewModel();

  const [formData, setFormData] = useState({
    clientName: "",
    serviceType: "",
    serviceDate: "",
    location: "",
    observations: "",
    template: "",
  });

  const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateService = async () => {
    if (!formData.clientName.trim()) {
      Toast.show({
        type: "error",
        text1: "Nome do cliente é obrigatório",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (!formData.serviceType) {
      Toast.show({
        type: "error",
        text1: "Selecione um tipo de serviço",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (!formData.serviceDate) {
      Toast.show({
        type: "error",
        text1: "Data do serviço é obrigatória",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (!formData.template) {
      Toast.show({
        type: "error",
        text1: "Selecione um template de checklist",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const templateData = templates.find((t) => t.name === formData.template);

      console.log("Creating service - Selected template:", {
        templateName: formData.template,
        templateData,
        allTemplates: templates,
      });

      const serviceData: Omit<Service, "id" | "created_at" | "updated_at"> = {
        client_name: formData.clientName.trim(),
        service_type: formData.serviceType,
        service_date: formData.serviceDate,
        location: formData.location.trim(),
        observations: formData.observations.trim(),
        template_id: templateData?.id ? String(templateData.id) : "",
        status: "in-progress",
        progress: 0,
      };

      console.log("Creating service with data:", serviceData);
      await addService(serviceData);

      // Navegar de volta para a lista de serviços
      setTimeout(() => {
        router.navigate("/services");
      }, 500);
    } catch (error) {
      console.error("Error creating service:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao criar serviço",
        text2: "Tente novamente",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header title="Novo serviço" onBackHandler={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1 bg-surface"
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nome do cliente */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Nome do cliente <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Digite o nome do cliente"
              placeholderTextColor="#d1d5db"
              value={formData.clientName}
              onChangeText={(text) => handleInputChange("clientName", text)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            />
          </View>

          {/* Tipo de serviço */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Tipo de serviço <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() =>
                setShowServiceTypeDropdown(!showServiceTypeDropdown)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
            >
              <Text
                className={
                  formData.serviceType ? "text-gray-900" : "text-gray-400"
                }
              >
                {formData.serviceType || "Selecione o tipo de serviço"}
              </Text>
            </TouchableOpacity>

            {showServiceTypeDropdown && (
              <View className="absolute z-10 w-full mt-12 bg-white border border-gray-300 rounded-lg shadow-lg">
                {serviceTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => {
                      handleInputChange("serviceType", type.name);
                      setShowServiceTypeDropdown(false);
                      Keyboard.dismiss();
                    }}
                    className="px-4 py-3 border-b border-gray-100"
                  >
                    <Text className="text-gray-900">{type.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Data do serviço */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Data do serviço <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#d1d5db"
              value={formData.serviceDate}
              onChangeText={(text) => handleInputChange("serviceDate", text)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            />
          </View>

          {/* Local */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Local
            </Text>
            <TextInput
              placeholder="Endereço do serviço"
              placeholderTextColor="#d1d5db"
              value={formData.location}
              onChangeText={(text) => handleInputChange("location", text)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            />
          </View>

          {/* Observações */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Observações
            </Text>
            <TextInput
              placeholder="Informações adicionais sobre o serviço"
              placeholderTextColor="#d1d5db"
              value={formData.observations}
              onChangeText={(text) => handleInputChange("observations", text)}
              multiline
              numberOfLines={10}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
              textAlignVertical="top"
              style={{ minHeight: 150 }}
            />
          </View>

          {/* Template de checklist */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Template de checklist <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
            >
              <Text
                className={
                  formData.template ? "text-gray-900" : "text-gray-400"
                }
              >
                {formData.template || "Selecione um template"}
              </Text>
            </TouchableOpacity>

            {showTemplateDropdown && (
              <View className="absolute z-10 w-full mt-12 bg-white border border-gray-300 rounded-lg shadow-lg">
                {templates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    onPress={() => {
                      handleInputChange("template", template.name);
                      setShowTemplateDropdown(false);
                      Keyboard.dismiss();
                    }}
                    className="px-4 py-3 border-b border-gray-100"
                  >
                    <Text className="text-gray-900">{template.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Botão fixo no footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-gray-200 px-4 py-4">
          <Button
            onPress={handleCreateService}
            disabled={loading}
            className="bg-primary rounded-lg items-center h-16 justify-center"
          >
            <Text className="text-lg font-semibold text-white">
              {loading ? "Criando..." : "Criar serviço"}
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
