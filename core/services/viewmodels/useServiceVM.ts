import { useServices } from "@/core/services/context/ServiceContext";
import { analyticsEvents } from "@/lib/analytics";
import { Service } from "@/types";
import { useState } from "react";
import { Toast } from "toastify-react-native";

export const useServiceViewModel = () => {
  const {
    services,
    addService,
    updateService,
    deleteService,
    getServiceById,
    loading,
  } = useServices();

  const [editingService, setEditingService] = useState<string | null>(null);

  const handleAddService = async (
    data: Omit<Service, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      await addService(data);

      analyticsEvents.serviceCreated({
        serviceType: data.service_type,
        hasTemplate: Boolean(data.template_id),
      });

      Toast.show({
        type: "success",
        text1: "Serviço criado com sucesso!",
        position: "top",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error adding service:", error);
      const isOffline =
        typeof globalThis !== "undefined" &&
        (globalThis as any).navigator?.onLine === false;
      if (isOffline) {
        analyticsEvents.offlineUsed({ screen: "new_service" });
      }
      Toast.show({
        type: "error",
        text1: "Erro ao criar serviço",
        text2: "Tente novamente",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  const handleUpdateService = async (id: string, data: Partial<Service>) => {
    try {
      await updateService(id, data);
      Toast.show({
        type: "success",
        text1: "Serviço atualizado com sucesso!",
        position: "top",
        visibilityTime: 3000,
      });
      setEditingService(null);
    } catch (error) {
      console.error("Error updating service:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar serviço",
        text2: "Tente novamente",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService(id);
      Toast.show({
        type: "success",
        text1: "Serviço deletado com sucesso!",
        position: "top",
        visibilityTime: 3000,
      });
      if (editingService === id) {
        setEditingService(null);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao deletar serviço",
        text2: "Tente novamente",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  return {
    services,
    loading,
    addService: handleAddService,
    updateService: handleUpdateService,
    deleteService: handleDeleteService,
    getServiceById,
    editingService,
    setEditingService,
  };
};
