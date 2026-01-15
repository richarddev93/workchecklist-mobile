export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  note?: string;
  photos?: string[];
}

export type ServiceStatus = 'pending' | 'in-progress' | 'completed';

export interface Service {
  id: string;
  clientName: string;
  serviceType: string;
  status: ServiceStatus| any;
  statusLabel?: string;
  date:string;
  address: string;
  progress?:any
  checklist: ChecklistItem[];
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

export interface ServiceType {
  id: string;
  name: string;
  slug?:string;
}

export interface ConfigContextData {
  // Company
  companyInfo: CompanyInfo;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => void;

  // Templates
  templates: ChecklistTemplate[];
  addTemplate: (data: Omit<ChecklistTemplate, 'id'>) => void;
  updateTemplate: (id: string, data: Partial<Omit<ChecklistTemplate, 'id'>>) => void;
  deleteTemplate: (id: string) => void;

  // Service Types
  serviceTypes: ServiceType[];
  addServiceType: (data: Omit<ServiceType, 'id'>) => void;
  updateServiceType: (id: string, data: Partial<Omit<ServiceType, 'id'>>) => void;
  deleteServiceType: (id: string) => void;
}

