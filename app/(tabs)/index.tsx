import Container from "@/components/container";
import StatCard from "@/components/state-card";
import {Button} from "@/components/ui/button";
import {FontAwesome5} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Text, View} from "react-native";

export default function HomeScreen() {
    // const { services, isOffline } = useServices();

    const services = [
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

    const totalServices = services.length;
    const inProgressServices = services.filter(
        (s) => s.status === "in-progress"
    ).length;
    const completedServices = services.filter(
        (s) => s.status === "completed"
    ).length;
    const router = useRouter();

    return (
        <Container>
            <View className="min-h-screen bg-surface pb-20">
                <View className="bg-white border-b border-gray-200 px-4 py-4">
                    <View className="flex justify-between">
                        <Text className="text-gray-900 text-3xl font-bold">
                            WorkChecklist
                        </Text>
                    </View>
                </View>

                <View className="p-4 gap-2">
                    <View className="flex flex-row gap-3">
                        <StatCard
                            title="Total de serviços"
                            value={totalServices}
                            color={'#2563eb'}
                            iconName="handyman"
                            onPress={() => router.navigate("/services")}
                        />

                        <StatCard
                            title="Em andamento"
                            value={inProgressServices}
                            color="#f59e0b"
                            iconName="autorenew"
                            onPress={() => router.navigate("/services")}
                        />
                    </View>

                    <Button
                        onPress={() => router.navigate("/services")}
                        className=" bg-[#2563eb] rounded-lg items-center h-16 justify-center"
                    >
                        <FontAwesome5 name="plus" size={20} color={"white"}/>
                        <Text className="text-xl text-white">Criar novo serviço</Text>
                    </Button>

                    <View className="flex flex-row  gap-3">

                        <StatCard
                            title="Concluídos"
                            value={completedServices}
                            iconName={"check-circle"}
                            color="#10b981"
                        />
                        <StatCard
                            title="Relatórios"
                            value={completedServices}
                            iconName={"description"}
                            color="#2563eb"
                            onPress={() => router.navigate("/reports")}
                        />
                    </View>

                    {/* Resumo rápido */}
                    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <Text className="text-gray-900 mb-3">Resumo rápido</Text>
                        <View className="space-y-2">
                            <View className="flex justify-between items-center">
                                <Text className="text-gray-600">Taxa de conclusão</Text>
                                <Text className="text-gray-900">
                                    {totalServices > 0
                                        ? Math.round((completedServices / totalServices) * 100)
                                        : 0}
                                    %
                                </Text>
                            </View>
                            <View className="w-full bg-gray-200 rounded-full h-2">
                                <View
                                    className="bg-[#10b981] h-2 rounded-full"
                                    style={{
                                        width: `${
                                            totalServices > 0
                                                ? (completedServices / totalServices) * 100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Container>
    );
}
