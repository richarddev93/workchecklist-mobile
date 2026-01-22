import Container from "@/components/container";
import StatCard from "@/components/state-card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
        iconName="handyman"
        onPress={() => router.navigate("/services")}
      />

      <StatCard
        title="Em andamento"
        value={services.inProgressServices}
        color="#f59e0b"
        iconName="autorenew"
        onPress={() => router.navigate("/services")}
      />
    </View>
  );

  const SecondBlockComponent = () => (
    <View className="flex flex-row  gap-3">
      <StatCard
        title="Concluídos"
        value={services.completedServices}
        iconName={"check-circle"}
        color="#10b981"
      />
      <StatCard
        title="Relatórios"
        value={services.completedServices}
        iconName={"description"}
        color="#2563eb"
        onPress={() => router.navigate("/reports")}
      />
    </View>
  );

  const CreateServiceButton = () => (
    <Button
      onPress={() => router.navigate("/add-service")}
      className="bg-secondary rounded-lg items-center h-16 justify-center"
    >
      <FontAwesome5 name="plus" size={20} color={"white"} />
      <Text className="text-xl text-white">Criar um novo serviço</Text>
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
