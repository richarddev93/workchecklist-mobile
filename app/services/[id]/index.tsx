import { ServiceChecklistView } from "@/core/services/views/ServiceChecklist.view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";

export default function ServiceDetail() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  //const service = useServiceById(id); // hook SQLite

  const backToHome = useCallback(() => {
    router.back();
  }, [router]);

  return <ServiceChecklistView serviceId={id} onBack={backToHome} />;
}
