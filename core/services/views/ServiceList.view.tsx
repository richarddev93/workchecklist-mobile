import AdMobManager from "@/components/admob/admob-manager";
import Container from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { Header } from "@/components/ui/header";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { ServiceCard } from "@/core/services/components/service-card";
import { getBannerAdUnitId } from "@/lib/ads";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  initialTab?: TabValue;
}

type TabValue = "all" | "pending" | "in-progress" | "completed";
type SortValue = "date_desc" | "date_asc" | "name_asc";

const DEFAULT_EMPTY_STATE_MESSAGE = "Você não tem nenhum serviço pendente";
const DEFAULT_EMPTY_STATE_DESCRIPTION = "Vamos começar um novo";

export function ServiceListView({
  services,
  onBackHandler,
  loading = false,
  initialTab = "all",
}: ServiceListViewProps) {
  const tabBarHeight = useBottomTabBarHeight();
  const [tab, setTab] = useState<TabValue>(initialTab);
  const [sortBy, setSortBy] = useState<SortValue>("date_desc");
  const router = useRouter();

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (value: string) => {
    setTab(value as TabValue);
  };

  const handleSortChange = (option: any) => {
    const nextValue =
      typeof option === "string" ? option : (option?.value ?? "date_desc");
    setSortBy(nextValue as SortValue);
  };

  const filteredServices =
    tab === "all" ? services : services.filter((s) => s.status === tab);

  const parseServiceDate = (value: string | undefined) => {
    if (!value) return 0;

    // dd/MM/yyyy
    if (value.includes("/")) {
      const [day, month, year] = value.split("/").map(Number);
      if (day && month && year) {
        return new Date(year, month - 1, day).getTime();
      }
    }

    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const sortedServices = useMemo(() => {
    const list = [...filteredServices];

    switch (sortBy) {
      case "date_asc":
        return list.sort(
          (a, b) => parseServiceDate(a.date) - parseServiceDate(b.date),
        );
      case "name_asc":
        return list.sort((a, b) =>
          String(a.clientName || "").localeCompare(String(b.clientName || "")),
        );
      case "date_desc":
      default:
        return list.sort(
          (a, b) => parseServiceDate(b.date) - parseServiceDate(a.date),
        );
    }
  }, [filteredServices, sortBy]);

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
    <View className="flex-1">
      <Container>
        <Header
          title="Serviços"
          subtitle="Acompanhe todos os serviços"
          noBorder
        />
        <View className="flex bg-white border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            <View className="flex-row items-center gap-2">
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

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="rounded-full px-4 py-2 h-10 border border-border bg-gray-100">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="filter" size={16} color="#6b7280" />
                    <SelectValue placeholder="Ordenar" className="text-md" />
                  </View>
                </SelectTrigger>
                <SelectContent className="w-56 bg-white">
                  <SelectGroup>
                    <SelectItem label="Mais recentes" value="date_desc">
                      Mais recentes
                    </SelectItem>
                    <SelectItem label="Mais antigas" value="date_asc">
                      Mais antigas
                    </SelectItem>
                    <SelectItem label="Nome do cliente" value="name_asc">
                      Nome do cliente
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
          </ScrollView>
        </View>
        {sortedServices.length === 0 ? (
          <EmptyState
            message={
              tab === "all" || tab === "pending"
                ? DEFAULT_EMPTY_STATE_MESSAGE
                : "Nenhum serviço encontrado"
            }
            description={
              tab === "all" || tab === "pending"
                ? DEFAULT_EMPTY_STATE_DESCRIPTION
                : `Nenhum serviço ${
                    tab === "pending"
                      ? "pendente"
                      : tab === "in-progress"
                        ? "em andamento"
                        : "concluído"
                  }`
            }
            debugInfo={`Tab: ${tab}, Total services: ${services.length}, Filtered: ${sortedServices.length}`}
          />
        ) : (
          <FlatList
            className=" px-4 "
            data={sortedServices}
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
      <View className="bg-white justify-center items-center">
        <AdMobManager unitId={getBannerAdUnitId("services_banner")} />
      </View>
    </View>
  );
}
