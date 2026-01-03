import { DashboardServiceView } from "@/core/services/views/DashboardService.view";

export default function HomeScreen() {
  // const { services, isOffline } = useServices();

  const servicesData = [
    {
      status: "in-progress",
    },
    {
      status: "completed",
    },
    {
      status: "in-progress",
    },
  ];

  const totalServices = servicesData.length;
  const inProgressServices = servicesData.filter(
    (s) => s.status === "in-progress"
  ).length;
  const completedServices = servicesData.filter(
    (s) => s.status === "completed"
  ).length;

  const services = {
    data: servicesData,
    totalServices,
    inProgressServices,
    completedServices
  };

  return <DashboardServiceView services={services} />;
}
