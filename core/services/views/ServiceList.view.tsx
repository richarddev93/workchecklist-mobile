import Container from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { Header } from "@/components/ui/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { ServiceCard } from "@/core/services/components/service-card";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    View,
} from "react-native";

interface ServiceListViewProps {
  services: any[];
  onBackHandler: () => void;
  loading?: boolean;
}

type TabValue = "all" | "pending" | "in-progress" | "completed";

export function ServiceListView({
  services,
  onBackHandler,
  loading = false,
}: ServiceListViewProps) {
  const tabBarHeight = useBottomTabBarHeight();
  const [tab, setTab] = useState<TabValue>("all");
  const router = useRouter();

  const handleTabChange = (value: string) => {
    setTab(value as TabValue);
  };

  const filteredServices =
    tab === "all" ? services : services.filter((s) => s.status === tab);

  const navigationToServiceDetail = useCallback(
    (serviceId: string) => {
      router.push({
        pathname: "/services/[id]",
        params: { id: serviceId },
      });
    },
    [router],
  );

  const openNewServiceForm = () => {
    router.push("/add-service");
  };

  if (loading) {
    return (
      <Container>
        <Header
          title="Serviços"
          subtitle="Acompanhe todos os serviços"
          noBorder
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        title="Serviços"
        subtitle="Acompanhe todos os serviços"
        noBorder
      />
      <View className="flex pb-4 bg-white border-b border-gray-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
        >
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="flex-row gap-2  bg-transparent">
              {[
                { value: "all", label: "Todos" },
                { value: "pending", label: "Pendentes" },
                { value: "in-progress", label: "Em andamento" },
                { value: "completed", label: "Concluídos" },
              ].map((t) => {
                const isSelected = tab === t.value;
                return (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className={cn(
                      "flex flex-1  rounded-full px-4 py-2 h-10 border border-border",
                      tab === t.value
                        ? "!bg-primary !border-tab-icon-selected"
                        : "bg-gray-100",
                    )}
                  >
                    <Text
                      className={cn(
                        "text-md",
                        isSelected ? "!text-white" : "text-text",
                      )}
                    >
                      {t.label}
                    </Text>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </ScrollView>
      </View>
      {filteredServices.length === 0 ? (
        <EmptyState
          message="Nenhum serviço encontrado"
          description={
            tab === "all"
              ? "Comece adicionando um novo serviço"
              : `Nenhum serviço ${
                  tab === "pending"
                    ? "pendente"
                    : tab === "in-progress"
                      ? "em andamento"
                      : "concluído"
                }`
          }
          debugInfo={`Tab: ${tab}, Total services: ${services.length}, Filtered: ${filteredServices.length}`}
        />
      ) : (
        <FlatList
          className=" px-4 "
          data={filteredServices}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ServiceCard
              service={item}
              firstItem={index == 0}
              onPress={() => navigationToServiceDetail(item.id)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 4,
            paddingBottom: tabBarHeight + 60,
          }}
        />
      )}
      <Pressable
        onPress={openNewServiceForm}
        className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
        ]}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </Container>
  );
}
