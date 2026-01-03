import { useServices } from "@/core/services/context/ServiceContext";
import { ReportsView } from "@/core/services/views/Reports.view";
import { router } from "expo-router";
import { useCallback } from "react";

export default function Reports() {
  const { services } = useServices();

    const completedServices = services.filter(
    (s) => s.status === 'completed'
  );

  const navigationToServiceReport = useCallback(
    (serviceId: string) => {
      router.push({
        pathname: "/services/[id]/report",
        params: { id: serviceId },
      });
    },
    [router]
  );
  return (
    <ReportsView  completedServices={completedServices} onBack={()=> console.log} onNavigate={navigationToServiceReport}/>
  );
}
