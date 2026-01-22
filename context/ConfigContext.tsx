import {
  CompanyRepository,
  createCompanyRepository,
} from "@/core/config/repository/companyRepository";
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

import {
  createServiceTemplateRepository,
  ServiceTemplateRepository,
} from "@/core/config/repository/serviceTemplateRepository";
import {
  createServiceTypeRepository,
  ServiceTypeRepository,
} from "@/core/config/repository/serviceTypeRepository";
import { DatabaseAdapter } from "@/core/config/storage/database.interface";
import { CompanyInfo, ServiceTemplate } from "@/types";

export interface Template {
  id: string;
  name: string;
  service_type: string;
  items: string[];
}

export interface ServiceType {
  id: string;
  name: string;
  slug?: string;
}

type ServiceTemplateWithStringItems = Omit<ServiceTemplate, "items"> & {
  items: string[];
};

interface ConfigContextData {
  // Company
  companyInfo: CompanyInfo;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => void;

  // Templates
  templates: Template[];
  addTemplate: (data: Omit<ServiceTemplate, "id">) => void;
  updateTemplate: (id: string, data: Partial<ServiceTemplate>) => void;
  deleteTemplate: (id: string) => void;

  // Service Types
  serviceTypes: ServiceType[];
  addServiceType: (data: Omit<ServiceType, "id">) => void;
  updateServiceType: (data: Partial<ServiceType>) => void;
  deleteServiceType: (id: string) => void;
  saveCompany: (data: Partial<CompanyInfo>) => void;
}

const ConfigContext = createContext<ConfigContextData | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<DatabaseAdapter | null>(null);
  const repositoryRef = useRef<CompanyRepository | null>(null);
  const serviceTypeRepositoryRef = useRef<ServiceTypeRepository | null>(null);
  const serviceTemplateRepositoryRef = useRef<ServiceTemplateRepository | null>(
    null,
  );

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "WorkChecklist",
    phone: "(11) 99999-9999",
    email: "contato@empresa.com",
    address: "São Paulo - SC",
  });
  const [loading, setLoading] = useState(true);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([
    { id: randomUUID(), name: "Manutenção preventiva" },
    { id: randomUUID(), name: "Instalação" },
    { id: randomUUID(), name: "Reparo" },
  ]);

  const [templates, setTemplates] = useState<ServiceTemplateWithStringItems[]>([
    {
      id: randomUUID(),
      name: "Manutenção Preventiva",
      service_type: "Manutenção",
      items: [
        "Verificação inicial do equipamento",
        "Teste de funcionamento",
        "Limpeza e manutenção",
        "Verificação de segurança",
        "Testes finais",
      ],
    },
  ]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const dbInstance = await createExpoDbAdapter();
      repositoryRef.current = createCompanyRepository(dbInstance);
      serviceTypeRepositoryRef.current =
        createServiceTypeRepository(dbInstance);
      serviceTemplateRepositoryRef.current =
        createServiceTemplateRepository(dbInstance);
      const company = await repositoryRef.current?.getCompany();
      getAllServiceType();

      getAllServiceTemplate();

      if (mounted) {
        setDb(dbInstance);
        if (company) setCompanyInfo(company);
        setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const saveCompany = async (data: Partial<CompanyInfo>) => {
    await repositoryRef.current?.saveCompany(data);
    updateCompanyInfo(data);
  };

  const updateCompanyInfo = (data: Partial<CompanyInfo>) => {
    setCompanyInfo((prev) => ({ ...prev, ...data }));
  };

  const getAllServiceTemplate = async () => {
    const serviceTemplatesRes =
      await serviceTemplateRepositoryRef.current?.getAll();

    const converteditems = serviceTemplatesRes?.map((tmp) => ({
      ...tmp,
      items: tmp.items ? JSON.parse(tmp.items) : [],
    }));
    console.log("GET ALL Template", converteditems);
    setTemplates(converteditems ?? []);
  };

  const addTemplate = async (data: Omit<ServiceTemplate, "id">) => {
    console.log(data);
    await serviceTemplateRepositoryRef.current?.save(data);
    getAllServiceTemplate();
  };

  const updateTemplate = async (id: string, data: Partial<ServiceTemplate>) => {
    const res = await serviceTypeRepositoryRef.current?.edit(data);
    getAllServiceTemplate();
    return res;
  };

  const deleteTemplate = async (id: string) => {
    const serviceTypeRes =
      await serviceTemplateRepositoryRef.current?.delete(id);
    getAllServiceTemplate();
  };

  const addServiceType = async (data: Omit<ServiceType, "id">) => {
    await serviceTypeRepositoryRef.current?.save(data);
    getAllServiceType();
  };

  const updateServiceType = async (data: Partial<ServiceType>) => {
    const res = await serviceTypeRepositoryRef.current?.edit(data);
    getAllServiceType();
    return res;
  };

  const getAllServiceType = async () => {
    const serviceTypesRes = await serviceTypeRepositoryRef.current?.getAll();
    setServiceTypes(serviceTypesRes ?? []);
  };

  const deleteServiceType = async (id: string) => {
    const serviceTypeRes = await serviceTypeRepositoryRef.current?.delete(id);
    getAllServiceType();
  };

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
        saveCompany,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
};
