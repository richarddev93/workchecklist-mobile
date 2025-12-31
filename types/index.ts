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


