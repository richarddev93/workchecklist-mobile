import { useConfig } from "@/context/ConfigContext";
import { slugify } from "@/lib/utils";
import { CompanyInfo, ServiceType } from "@/types";
import { useState } from "react";
import { Toast } from "toastify-react-native";

export function useConfigViewModel() {
  //usar o contexto de config aqui para buscar os daods da empresa
  const {
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany,
    addServiceType,
  } = useConfig();

  const [onEdit, setOnEdit] = useState(true);
    const [showNewType, setShowNewType] = useState(false);
    const [newType, setNewType] = useState("");
    const [editingType, setEditingType] = useState<string | null>(null);
  

  
    function handleUpdate(id: string, name: string) {
      // setServiceTypes((prev) =>
      //   prev.map((item) => (item.id === id ? { ...item, name } : item))
      // );
      setEditingType(null);
    }
  
    function handleDelete(id: string) {
      // setServiceTypes((prev) => prev.filter((item) => item.id !== id));
  
      if (editingType === id) {
        setEditingType(null);
      }
    }

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

  return {
    newType,
    setNewType,
    handleUpdate,
    handleDelete,
    showNewType,
    setShowNewType,
    setEditingType,
    editingType,
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany: saveCompanyCustom,
    disableSave: onEdit,
    handleOnEdit,
    saveServiceType
  };
}
