import { useConfig } from "@/context/ConfigContext";
import { slugify } from "@/lib/utils";
import { CompanyInfo, ServiceType } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Toast } from "toastify-react-native";

// const INITIAL_TEMPLATES_TEMPLATE: TemplateTemplate[] = [
//   {
//     id: "1",
//     name: "Manutenção Preventiva",
//     items: ["Verificar níveis de óleo", "Apertar conexões", "Limpeza geral"],
//   },
//   {
//     id: "2",
//     name: "Instalação",
//     items: ["Conferir equipamentos", "Fixação no local", "Teste final"],
//   },
// ];
export const useConfigViewModel = () => {
  const {
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany,
    addServiceType,
    updateServiceType,
  } = useConfig();

  const [onEdit, setOnEdit] = useState(true);
  const [showNewType, setShowNewType] = useState(false);
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState<string | null>(null);

  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const [newTemplate, setNewTemplate] = useState<{
    name: string;
    items: string[];
  }>({
    name: "",
    items: [""],
  });

  const handleUpdateServiceType = (id: string, name: string) => {
    try {
      updateServiceType({ id, name, slug: slugify(newType.trim()) });
      setEditingType(null);
    } catch (error) {
      console.log("Error on type update");
    } finally {
      setEditingType(null);
    }
  };

  const handleDeleteServiceType = (id: string) => {
    // setServiceTypes((prev) => prev.filter((item) => item.id !== id));
    console.log("deletando", id, editingType)
    try {
      deleteServiceType(id);
      if (editingType === id) {
        setEditingType(null);
      }
    } catch (error) {
      console.log(error);
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
      onPress: () => console.log("Toast pressed"),
      onShow: () => console.log("Toast shown"),
      onHide: () => console.log("Toast hidden"),
    });
  };

  const handleOnEdit = () => {
    console.log(`handle on Edit`, onEdit);
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
      console.log("error");
      console.log(error);
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

    // setTemplatesTemplate((prev) => [
    //   ...prev,
    //   {
    //     id: String(Date.now()),
    //     name: newTemplate.name.trim(),
    //     items: newTemplate.items.filter(Boolean),
    //   },
    // ]);

    setNewTemplate({ name: "", items: [""] });
    setShowNewTemplate(false);
  };

  const handleUpdateTemplate = (id: string, name: string, items: string[]) => {
    // setTemplatesTemplate((prev) =>
    //   prev.map((t) => (t.id === id ? { ...t, name, items } : t))
    // );
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    // setTemplatesTemplate((prev) => prev.filter((t) => t.id !== id));

    if (editingTemplate === id) {
      setEditingTemplate(null);
    }
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
  };
};
