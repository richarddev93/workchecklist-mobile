import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Text } from "@/components/ui/text";
import { useConfigViewModel } from "@/core/config/viewmodels/useConfigVM";
import { useServiceViewModel } from "@/core/services/viewmodels/useServiceVM";
import { Service } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      // Converter para formato ISO (YYYY-MM-DD) para o banco de dados
      const isoDate = selectedDate.toISOString().split("T")[0];
      // Exibir em formato legível (DD/MM/YYYY) para o usuário
      const displayDate = selectedDate.toLocaleDateString("pt-BR");

      // Armazenar a data ISO para envio, mas exibir formatado
      handleInputChange("serviceDate", isoDate);
    }
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

      const serviceData: Omit<Service, "id" | "created_at" | "updated_at"> = {
        client_name: formData.clientName.trim(),
        service_type: formData.serviceType,
        service_date: formData.serviceDate,
        location: formData.location.trim(),
        observations: formData.observations.trim(),
        template_id: templateData?.id ? String(templateData.id) : "",
        status: "pending",
        progress: 0,
      };

      // console.log("Creating service with data:", serviceData);
      await addService(serviceData);

      // Navegar somente após sucesso confirmado
      router.push("/services");
    } catch (error) {
      console.error("Error creating service:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao criar serviço",
        text2: "Tente novamente",
        position: "top",
        visibilityTime: 3000,
      });
      // Não navega em caso de erro – permanece no formulário
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

          {/* Template de checklist */}
          <View className="mb-4">
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
              <View className="absolute z-50 w-full mt-2 max-h-48 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                <ScrollView nestedScrollEnabled>
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
                </ScrollView>
              </View>
            )}
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
              <View className="absolute z-50 w-full mt-2 max-h-48 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                <ScrollView nestedScrollEnabled>
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
                </ScrollView>
              </View>
            )}
          </View>

          {/* Data do serviço */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Data do serviço <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white justify-center"
            >
              <Text
                className={
                  formData.serviceDate ? "text-gray-900" : "text-gray-400"
                }
              >
                {formData.serviceDate
                  ? new Date(formData.serviceDate).toLocaleDateString("pt-BR")
                  : "Selecione a data"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={
                  formData.serviceDate
                    ? new Date(formData.serviceDate)
                    : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}

            {Platform.OS === "ios" && showDatePicker && (
              <View className="flex-row justify-end gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  <Text className="text-gray-900 font-medium">Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
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
