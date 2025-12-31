import { ServiceChecklistView } from "@/services/views/ServiceChecklist.view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";

export default function ServiceChecklist() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const backToHome = useCallback(() => {
    router.back();
  }, [router]);



  return (
    <ServiceChecklistView serviceId={id} onBack={backToHome}/>
  );
}
