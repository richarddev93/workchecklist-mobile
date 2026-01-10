import { CompanyRepository, createCompanyRepository } from "@/core/config/repository/companyRepository";
import { createExpoDbAdapter } from "@/core/config/storage/adapters/expo-adapter";
import { randomUUID } from "expo-crypto";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { DatabaseAdapter } from "@/core/config/storage/database";
import { CompanyInfo } from "@/types";

export interface Template {
  id: string;
  name: string;
  items: string[];
}

export interface ServiceType {
  id: string;
  name: string;
}

interface ConfigContextData {
  // Company
  companyInfo: CompanyInfo;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => void;

  // Templates
  templates: Template[];
  addTemplate: (data: Omit<Template, "id">) => void;
  updateTemplate: (id: string, data: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;

  // Service Types
  serviceTypes: ServiceType[];
  addServiceType: (data: Omit<ServiceType, "id">) => void;
  updateServiceType: (id: string, data: Partial<ServiceType>) => void;
  deleteServiceType: (id: string) => void;
  saveCompany:( data: Partial<CompanyInfo>)=> void
}

const ConfigContext = createContext<ConfigContextData | undefined>(undefined);


export function ConfigProvider({ children }: { children: ReactNode }) {

const [db, setDb] = useState<DatabaseAdapter | null>(null);
const repositoryRef = useRef<CompanyRepository | null>(null);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "WorkChecklist",
    phone: "(11) 99999-9999",
    email: "contato@empresa.com",
    address: "São Paulo - SC",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const dbInstance = await createExpoDbAdapter();
      repositoryRef.current = createCompanyRepository(dbInstance);
      const company = await  repositoryRef.current?.getCompany();

      if (mounted) {
        setDb(dbInstance);
        if(company) setCompanyInfo(company);
        setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  function updateCompanyInfo(data: Partial<CompanyInfo>) {
    setCompanyInfo((prev) => ({ ...prev, ...data }));
  }

  /* ---------- Templates ---------- */
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: randomUUID(),
      name: "Manutenção Preventiva",
      items: [
        "Verificação inicial do equipamento",
        "Teste de funcionamento",
        "Limpeza e manutenção",
        "Verificação de segurança",
        "Testes finais",
      ],
    },
  ]);

  function addTemplate(data: Omit<Template, "id">) {
    setTemplates((prev) => [...prev, { id: randomUUID(), ...data }]);
  }

  function updateTemplate(id: string, data: Partial<Template>) {
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.id === id ? { ...tpl, ...data } : tpl))
    );
  }

  function deleteTemplate(id: string) {
    setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
  }

  /* ---------- Service Types ---------- */
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([
    { id: randomUUID(), name: "Manutenção preventiva" },
    { id: randomUUID(), name: "Instalação" },
    { id: randomUUID(), name: "Reparo" },
  ]);

  function addServiceType(data: Omit<ServiceType, "id">) {
    setServiceTypes((prev) => [...prev, { id: randomUUID(), ...data }]);
  }

  function updateServiceType(id: string, data: Partial<ServiceType>) {
    setServiceTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  }

  function deleteServiceType(id: string) {
    setServiceTypes((prev) => prev.filter((t) => t.id !== id));
  }
   const saveCompany = async (data: Partial<CompanyInfo>) => {
    await repositoryRef.current?.saveCompany(data);
    updateCompanyInfo(data); // 🔥 aqui propaga
  }

  return (
    <ConfigContext.Provider
      value={{
        companyInfo,
        updateCompanyInfo,
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        serviceTypes,
        addServiceType,
        updateServiceType,
        deleteServiceType,
        saveCompany
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
}
