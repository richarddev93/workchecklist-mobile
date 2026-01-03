import { ServiceReport } from "@/core/services/views/ServiceReport.view";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";

export default function Report(){
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <ServiceReport
        serviceId={id}
        onBack={()=> router.back()}
        
         />
    )
}