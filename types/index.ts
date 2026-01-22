export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  note?: string;
  photos?: string[];
}

export type ServiceStatus = "pending" | "in-progress" | "completed";

export interface Service {
  id: string;
  client_name: string;
  service_type: string;
  service_date: string;
  location?: string;
  observations?: string;
  template_id?: string;
  status: ServiceStatus;
  progress?: number;
  checklist_data?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyInfo {
  name: string;
  logo?: string; // uri/base64
  phone?: string;
  email?: string;
  address?: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  items: string[];
}
export interface ServiceTemplate {
  id: string;
  name: string;
  service_type: string;
  items: string;
}

export interface ServiceType {
  id: string;
  name: string;
  slug?: string;
}

export interface ConfigContextData {
  // Company
  companyInfo: CompanyInfo;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => void;

  // Templates
  templates: ChecklistTemplate[];
  addTemplate: (data: Omit<ChecklistTemplate, "id">) => void;
  updateTemplate: (
    id: string,
    data: Partial<Omit<ChecklistTemplate, "id">>,
  ) => void;
  deleteTemplate: (id: string) => void;

  // Service Types
  serviceTypes: ServiceType[];
  addServiceType: (data: Omit<ServiceType, "id">) => void;
  updateServiceType: (
    id: string,
    data: Partial<Omit<ServiceType, "id">>,
  ) => void;
  deleteServiceType: (id: string) => void;
}

export type SettingsTab = "templates" | "types" | "company";

export type TemplateTemplate = {
  id: string;
  name: string;
  items: string[];
};
