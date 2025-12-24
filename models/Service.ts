export interface Service {
  id: string;
  clientName: string;
  serviceType: string;
  date: string;
  location: string;
  notes?: string;
  status: 'in_progress' | 'completed';
}
