import Container from "@/components/container";
import StatCard from "@/components/state-card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { useRouter } from "expo-router";
import {
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Wrench,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { DashboardResume } from "../components/resume-dashboard";

export function DashboardServiceView({ services }: any) {
  const router = useRouter();

  const FirstBlockComponent = () => (
    <View className="flex flex-row gap-3">
      <StatCard
        title="Total de serviços"
        value={services.totalServices}
        color={"#2563eb"}
        icon={Wrench}
        onPress={() => router.navigate("/services")}
      />

      <StatCard
        title="Em andamento"
        value={services.inProgressServices}
        color="#f59e0b"
        icon={Clock}
        onPress={() => router.navigate("/services")}
      />
    </View>
  );

  const SecondBlockComponent = () => (
    <View className="flex flex-row  gap-3">
      <StatCard
        title="Concluídos"
        value={services.completedServices}
        icon={CheckCircle}
        color="#10b981"
      />
      <StatCard
        title="Relatórios"
        value={services.completedServices}
        icon={FileText}
        color="#2563eb"
        onPress={() => router.navigate("/reports")}
      />
    </View>
  );

  const CreateServiceButton = () => (
    <Button
      onPress={() => router.navigate("/add-service")}
      className="bg-primary rounded-lg items-center h-16 justify-center flex-row gap-2"
    >
      <Plus size={24} color={"white"} strokeWidth={2} />
      <Text className="text-xl text-white">Criar checklist de serviço</Text>
    </Button>
  );

  return (
    <Container>
      <View className="min-h-screen bg-surface pb-20">
        <Header title="Dashboard" subtitle="Visão geral dos serviços" />
        <View className="p-4 gap-2">
          <FirstBlockComponent />
          <CreateServiceButton />
          <SecondBlockComponent />
          <DashboardResume
            currentValue={services.completedServices}
            totalValue={services.totalServices ?? 0}
          />
        </View>
      </View>
    </Container>
  );
}
