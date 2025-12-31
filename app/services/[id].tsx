import { ServiceChecklistView } from "@/services/views/ServiceChecklist.view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";

export default function ServoceDetail() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  //const service = useServiceById(id); // hook SQLite


  const backToHome = useCallback(() => {
    router.back();
  }, [router]);

  const servicesData = [
    {
      id: "1",
      clientName: "João Silva",
      serviceType: "Manutenção preventiva",
      status: "in-progress",
      statusLabel: "Em andamento",
      date: "23/12/2024",
      address: "Rua das Flores, 123",
      progress: {
        completed: 2,
        total: 5,
      },
    },
    {
      id: "2",
      clientName: "Maria Oliveira",
      serviceType: "Instalação elétrica",
      status: "pending",
      statusLabel: "Pendente",
      date: "22/12/2024",
      address: "Av. Paulista, 987",
      progress: {
        completed: 0,
        total: 4,
      },
    },
    {
      id: "3",
      clientName: "Carlos Pereira",
      serviceType: "Reparo hidráulico",
      status: "completed",
      statusLabel: "Concluído",
      date: "21/12/2024",
      address: "Rua das Acácias, 45",
      progress: {
        completed: 3,
        total: 3,
      },
    },
    {
      id: "4",
      clientName: "Ana Souza",
      serviceType: "Vistoria técnica",
      status: "in-progress",
      statusLabel: "Em andamento",
      date: "20/12/2024",
      address: "Rua Central, 456",
      progress: {
        completed: 1,
        total: 5,
      },
    },
  ];

  const service = servicesData.find(i=> i.id==id)
 /* return (
    <ServiceDetailView service={service as any ?? servicesData[0]} onBackHandler={backToHome}  completedItems={10} totalItems={20} onOpenChecklist={()=> true} onOpenReport={()=> true}/>
  );*/
  console.log(id)

  return (    <ServiceChecklistView serviceId={id} onBack={backToHome}/>
  )
}
