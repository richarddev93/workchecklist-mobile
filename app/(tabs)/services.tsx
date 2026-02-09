import { useServiceViewModel } from "@/core/services/viewmodels/useServiceVM";
import { ServiceListView } from "@/core/services/views/ServiceList.view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

export default function Services() {
  const router = useRouter();
  const { services, loading } = useServiceViewModel();
  const { filter } = useLocalSearchParams<{ filter?: string }>();

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

      // Parse checklist data to count progress
      let completedCount = 0;
      let totalCount = 0;

      if (service.checklist_data) {
        try {
          const checklist = JSON.parse(service.checklist_data);
          if (Array.isArray(checklist)) {
            totalCount = checklist.length;
            completedCount = checklist.filter(
              (item: any) => item.completed,
            ).length;
          }
        } catch (e) {
          console.error(
            "Error parsing checklist_data for service:",
            service.id,
            e,
          );
        }
      }

      return {
        id: service.id,
        clientName: service.client_name,
        serviceType: service.service_type,
        status: service.status || "pending",
        statusLabel: statusLabels[service.status] || "Pendente",
        date: service.service_date,
        address: service.location || "",
        progress: {
          completed: completedCount,
          total: totalCount,
        },
      };
    });
  }, [services]);

  return (
    <ServiceListView
      services={formattedServices}
      onBackHandler={backToHome}
      loading={loading}
      initialTab={(filter as any) || "all"}
    />
  );
}
