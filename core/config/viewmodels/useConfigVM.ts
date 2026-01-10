import { useConfig } from "@/context/ConfigContext";
import { CompanyInfo } from "@/types";
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
  } = useConfig();

  const saveCompanyCustom = (data: CompanyInfo) => {
    saveCompany(data);
    Toast.show({
      type: "success",
      text1: "Salvo com sucesso!",
      text2: "Dados da Empresa configurados",
      position: "center",
      visibilityTime: 4000,
      autoHide: true,
      onPress: () => console.log("Toast pressed"),
      onShow: () => console.log("Toast shown"),
      onHide: () => console.log("Toast hidden"),
    });
  };
  return {
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany: saveCompanyCustom,
  };
}
