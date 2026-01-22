import { DashboardServiceView } from "@/core/services/views/DashboardService.view";
import { useServices } from "@/core/services/context/ServiceContext";
import { useMemo } from "react";

export default function HomeScreen() {
  const { services } = useServices();

  const servicesData = useMemo(() => {
    const total = services?.length || 0;
    const inProgress = services?.filter(s => s.status === "in-progress").length || 0;
    const completed = services?.filter(s => s.status === "completed").length || 0;

    return {
      data: services || [],
      totalServices: total,
      inProgressServices: inProgress,
      completedServices: completed,
    };
  }, [services]);

  return <DashboardServiceView services={servicesData} />;
}
