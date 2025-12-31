import Container from "@/components/container";
import { ServiceCard } from "@/components/service-card";
import { Header } from "@/components/ui/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

interface ServicesTemplateProps {
  services: any[];
  onBackHandler: () => void;
}

interface ServicesTemplateProps {
  services: any[];
  onBackHandler: () => void;
}
type TabValue = "all" | "pending" | "in-progress" | "completed";

export function ServicesTemplate({
  services,
  onBackHandler,
}: ServicesTemplateProps) {
  const [value, setValue] = useState("account");

  const tabBarHeight = useBottomTabBarHeight();
  const [tab, setTab] = useState<TabValue>("all");

  const handleTabChange = (value: string) => {
    setTab(value as TabValue);
  };

  const filteredServices =
    tab === "all" ? services : services.filter((s) => s.status === tab);

  //   return (
  //     <Container>
  //       <Header title="Serviços" onBackHandler={onBackHandler} />

  //       <View className="flex-1 px-4">

  //         {/* LISTA REAL */}
  //         <FlatList
  //           style={{ flex: 1 }}
  //           data={filteredServices}
  //           keyExtractor={(item) => item.id}
  //           renderItem={({ item }) => <ServiceCard service={item} />}
  //           showsVerticalScrollIndicator={false}
  //           contentContainerStyle={{
  //             paddingBottom: tabBarHeight + 16,
  //           }}
  //         />
  //       </View>
  //     </Container>
  //   );
  // }

  return (
    <Container>
      <Header title="Servicos" onBackHandler={onBackHandler} noBorder />
      <View className="flex pb-4 bg-white">
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
                const isSelected =  tab === t.value
                return (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className={cn(
                      "flex flex-1  rounded-full px-4 py-2 h-10 border border-border",
                      tab === t.value ? "!bg-primary !border-tab-icon-selected:" : "bg-gray-100"
                    )}
                  >
                    <Text className={cn("text-lg",
                      isSelected ? "!text-white" : "text-text" )}>
                      {t.label}
                    </Text>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </ScrollView>
      </View>
      <FlatList
        className=" px-4 "
        data={filteredServices}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ServiceCard service={item} firstItem={index == 0} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: tabBarHeight + 60, // ESSENCIAL
        }}
      />
    </Container>
  );
}
