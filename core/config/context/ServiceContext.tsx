import { Service } from "@/types";
import React, { createContext, useContext, useState } from "react";

interface ServiceContextData {
  services: Service[];
  getServiceById: (id: string) => Service | undefined;
  updateService: (id: string, partial: Partial<Service>) => void;
}

const ServiceContext = createContext<ServiceContextData>(
  {} as ServiceContextData,
);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const servicesData: Service[] = [
    {
      id: "1",
      clientName: "João Silva",
      serviceType: "Manutenção preventiva",
      status: "in-progress",
      date: "2024-12-23",
      address: "Rua das Flores, 123",
      checklist: [
        {
          id: "1-1",
          title: "Verificar filtros",
          completed: true,
        },
        {
          id: "1-2",
          title: "Lubrificar componentes",
          completed: true,
        },
        {
          id: "1-3",
          title: "Testar funcionamento",
          completed: false,
        },
        {
          id: "1-4",
          title: "Registrar fotos",
          completed: false,
        },
        {
          id: "1-5",
          title: "Relatório final",
          completed: false,
        },
      ],
    },

    {
      id: "2",
      clientName: "Maria Oliveira",
      serviceType: "Instalação elétrica",
      status: "pending",
      date: "2024-12-22",
      address: "Av. Paulista, 987",
      checklist: [
        {
          id: "2-1",
          title: "Desligar energia",
          completed: false,
        },
        {
          id: "2-2",
          title: "Instalar disjuntores",
          completed: false,
        },
        {
          id: "2-3",
          title: "Passar fiação",
          completed: false,
        },
        {
          id: "2-4",
          title: "Testar circuito",
          completed: false,
        },
      ],
    },

    {
      id: "3",
      clientName: "Carlos Pereira",
      serviceType: "Reparo hidráulico",
      status: "completed",
      date: "2024-12-21",
      address: "Rua das Acácias, 45",
      checklist: [
        {
          id: "3-1",
          title: "Identificar vazamento",
          completed: true,
        },
        {
          id: "3-2",
          title: "Trocar tubulação",
          completed: true,
        },
        {
          id: "3-3",
          title: "Testar pressão",
          completed: true,
        },
      ],
    },

    {
      id: "4",
      clientName: "Ana Souza",
      serviceType: "Vistoria técnica",
      status: "in-progress",
      date: "2024-12-20",
      address: "Rua Central, 456",
      checklist: [],
    },
  ];

  const [services, setServices] = useState<Service[]>(servicesData);

  function getServiceById(id: string) {
    return services.find((s) => s.id === id);
  }

  function updateService(id: string, partial: Partial<Service>) {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, ...partial } : service,
      ),
    );
  }

  return (
    <ServiceContext.Provider
      value={{ services, getServiceById, updateService }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  return useContext(ServiceContext);
}
