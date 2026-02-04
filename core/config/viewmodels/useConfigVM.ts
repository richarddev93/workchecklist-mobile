import { useConfig } from "@/context/ConfigContext";
import { getRemoteConfigValue } from "@/lib/remoteConfig";
import { slugify } from "@/lib/utils";
import { CompanyInfo, ServiceType } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Toast } from "toastify-react-native";

export const useConfigViewModel = () => {
  const {
    templates,
    addTemplate,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany,
    addServiceType,
    updateServiceType,
    updateTemplate,
    resetAllData,
  } = useConfig();

  const [onEdit, setOnEdit] = useState(true);
  const [showNewType, setShowNewType] = useState(false);
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState<string | null>(null);

  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [freeTemplateLimit, setFreeTemplateLimit] = useState(1);

  const [newTemplate, setNewTemplate] = useState<{
    name: string;
    service_type: string;
    items: string[];
  }>({
    name: "",
    service_type: "",
    items: [""],
  });

  // Load remote config on mount
  useEffect(() => {
    (async () => {
      const limit = await getRemoteConfigValue("free_template_limit");
      const normalized = typeof limit === "number" ? Math.max(1, limit) : 1;
      setFreeTemplateLimit(normalized);
    })();
  }, []);

  const handleUpdateServiceType = (id: string, name: string) => {
    try {
      updateServiceType({ id, name, slug: slugify(newType.trim()) });
      setEditingType(null);
    } catch (error) {
      // console.log("Error on type update");
    } finally {
      setEditingType(null);
    }
  };

  const handleDeleteServiceType = (id: string) => {
    try {
      deleteServiceType(id);
      if (editingType === id) {
        setEditingType(null);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const saveCompanyCustom = (data: CompanyInfo) => {
    saveCompany(data);
    setOnEdit(true);
    Toast.show({
      type: "success",
      text1: "Salvo com sucesso!",
      text2: "Dados da Empresa configurados",
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      onPress: () => {
        // console.log("Toast pressed");
      },
      onShow: () => {
        // console.log("Toast shown");
      },
      onHide: () => {
        // console.log("Toast hidden");
      },
    });
  };

  const handleOnEdit = () => {
    // console.log(`handle on Edit`, onEdit);
    setOnEdit(false);
  };

  const saveServiceType = () => {
    try {
      if (!newType.trim()) return;

      const serviceTypeData: ServiceType = {
        id: Date.now().toString(),
        name: newType.trim(),
        slug: slugify(newType.trim()),
      };

      setNewType("");
      setShowNewType(false);
      addServiceType(serviceTypeData);
    } catch (error) {
      // console.log("error");
      // console.log(error);
    }
  };

  const pickLogo = async () => {
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
  };

  const cleanLogo = () => {
    updateCompanyInfo({ logo: undefined });
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name.trim()) return;

    try {
      addTemplate({
        ...newTemplate,
        items:
          newTemplate.items.length > 0
            ? JSON.stringify(newTemplate.items, null, 2)
            : "[]",
      });

      setShowNewTemplate(false);
      setNewTemplate({
        name: "",
        service_type: "",
        items: [""],
      });
    } catch (error) {
      console.error("Error", error);
      ShowError("Erro ao salvar o template! Tente Novamente");
    }
  };

  const handleUpdateTemplate = (id: string, name: string, items: string[]) => {
    try {
      const current = templates.find((t) => t.id === id);
      updateTemplate(id, {
        name,
        items: JSON.stringify(items, null, 2),
        service_type: current?.service_type ?? "",
      });
    } catch (error) {
      console.error("Error updating template", error);
      ShowError("Erro ao atualizar o template! Tente Novamente");
    } finally {
      setEditingTemplate(null);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    try {
      deleteTemplate(id);
    } catch (error) {
      console.error(error);
    }
  };

  const ShowError = (message = "Erro desconhecido") => {
    Toast.show({
      type: "error",
      text1: message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const templatesHandle = {
    showNewTemplate,
    setShowNewTemplate,
    handleAddTemplate,
    handleDeleteTemplate,
    handleUpdateTemplate,
    editingTemplate,
    setEditingTemplate,
    newTemplate,
    setNewTemplate,
    freeTemplateLimit,
  };

  return {
    newType,
    showNewType,
    editingType,
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    disableSave: onEdit,

    setNewType,
    handleDeleteServiceType,
    handleUpdateServiceType,
    setShowNewType,
    setEditingType,
    saveCompany: saveCompanyCustom,
    handleOnEdit,
    pickLogo,
    cleanLogo,
    saveServiceType,
    templatesHandle,
    resetAllData,
  };
};
