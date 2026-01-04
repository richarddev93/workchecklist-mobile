import { useConfig } from "@/context/ConfigContext";
import { CompanyInfo } from "@/types";

export function useConfigViewModel() {
  //usar o contexto de config aqui para buscar os daods da empresa
  const {
    templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany
  } = useConfig();


   const updateCompany = async (data: Partial<CompanyInfo>) => {
    await saveCompany(data);
  };
  return {
      templates,
    serviceTypes,
    companyInfo,
    deleteTemplate,
    deleteServiceType,
    updateCompanyInfo,
    saveCompany
  };
}
