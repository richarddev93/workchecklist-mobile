import { useServiceViewModel } from "@/core/services/viewmodels/useServiceVM";
import { ServiceListView } from "@/core/services/views/ServiceList.view";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

export default function Services() {
  const router = useRouter();
  const { services, loading } = useServiceViewModel();

  const backToHome = useCallback(() => {
    router.back();
  }, [router]);

  // Transform services from database format to view format
  const formattedServices = useMemo(() => {
    return (services || []).map((service) => {
      const statusLabels: Record<string, string> = {
        pending: "Pendente",
        "in-progress": "Em andamento",
        completed: "Concluído",
      };

      return {
        id: service.id,
        clientName: service.client_name,
        serviceType: service.service_type,
        status: service.status || "pending",
        statusLabel: statusLabels[service.status] || "Pendente",
        date: service.service_date,
        address: service.location || "",
        progress: {
          completed: 0,
          total: 0,
        },
      };
    });
  }, [services]);

  return (
    <ServiceListView
      services={formattedServices}
      onBackHandler={backToHome}
      loading={loading}
    />
  );
}
