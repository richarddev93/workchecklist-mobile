import {
    CompanyRepository,
    createCompanyRepository,
} from "@/core/config/repository/companyRepository";
import { createExpoDbAdapter } from "@/core/config/storage/adapters/expo-adapter";
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

const defaultServiceTypes: ServiceType[] = [
  {
    id: "type-1",
    name: "Manutenção preventiva",
    slug: "manutencao-preventiva",
  },
  {
    id: "type-2",
    name: "Manutenção de área verde",
    slug: "manutencao-area-verde",
  },
  { id: "type-3", name: "Elétrica", slug: "eletrica" },
  { id: "type-4", name: "Hidráulica", slug: "hidraulica" },
  { id: "type-5", name: "Suporte técnico", slug: "suporte-tecnico" },
];

const defaultServiceTemplates: ServiceTemplateWithStringItems[] = [
  {
    id: "tmpl-1",
    name: "Ar-condicionado",
    service_type: "Manutenção preventiva",
    items: [
      "Desligamento do equipamento",
      "Inspeção visual geral",
      "Limpeza dos filtros",
      "Higienização da evaporadora",
      "Verificação de dreno",
      "Conferência de conexões elétricas",
      "Teste de funcionamento",
      "Verificação de ruídos anormais",
      "Orientações ao cliente",
    ],
  },
  {
    id: "tmpl-2",
    name: "Jardinagem",
    service_type: "Manutenção de área verde",
    items: [
      "Corte de grama",
      "Poda de plantas e arbustos",
      "Remoção de folhas secas",
      "Limpeza do terreno",
      "Verificação de pragas visíveis",
      "Organização do espaço",
      "Recolhimento de resíduos",
      "Orientações ao cliente",
    ],
  },
  {
    id: "tmpl-3",
    name: "Instalação elétrica",
    service_type: "Elétrica",
    items: [
      "Desligamento da rede elétrica",
      "Verificação do ponto de instalação",
      "Conferência de cabos e conexões",
      "Instalação / substituição do componente",
      "Fixação adequada",
      "Teste de funcionamento",
      "Verificação de segurança",
      "Liberação da rede elétrica",
      "Orientações ao cliente",
    ],
  },
];

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

const slugifyLocal = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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
    ...defaultServiceTypes,
  ]);

  const [templates, setTemplates] = useState<ServiceTemplateWithStringItems[]>([
    ...defaultServiceTemplates,
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

      // Seed defaults if empty
      await ensureDefaults();

      if (mounted) {
        setDb(dbInstance);
        if (company) setCompanyInfo(company);
        await getAllServiceType();
        await getAllServiceTemplate();
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

  const ensureDefaults = async () => {
    // Seed service types if empty
    const types = await serviceTypeRepositoryRef.current?.getAll();
    if (!types || types.length === 0) {
      for (const t of defaultServiceTypes) {
        await serviceTypeRepositoryRef.current?.save({
          name: t.name,
          slug: slugifyLocal(t.name),
        });
      }
    }

    // Seed templates if empty
    const templatesDb = await serviceTemplateRepositoryRef.current?.getAll();
    if (!templatesDb || templatesDb.length === 0) {
      for (const tmpl of defaultServiceTemplates) {
        await serviceTemplateRepositoryRef.current?.save({
          name: tmpl.name,
          service_type: tmpl.service_type,
          items: JSON.stringify(tmpl.items, null, 2),
        });
      }
    }
  };

  const resetAllData = async () => {
    if (!db) return;

    await db.exec("DELETE FROM service;");
    await db.exec("DELETE FROM service_template;");
    await db.exec("DELETE FROM service_type;");

    await ensureDefaults();
    await getAllServiceType();
    await getAllServiceTemplate();
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
    setTemplates(converteditems ?? []);
  };

  const addTemplate = async (data: Omit<ServiceTemplate, "id">) => {
    console.log(data);
    await serviceTemplateRepositoryRef.current?.save(data);
    getAllServiceTemplate();
  };

  const updateTemplate = async (id: string, data: Partial<ServiceTemplate>) => {
    const res = await serviceTemplateRepositoryRef.current?.edit({
      id,
      ...data,
    });
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
        resetAllData,
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
