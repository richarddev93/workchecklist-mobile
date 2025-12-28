import { Text, View } from "react-native";

interface DashboardResumeProps {
  currentValue: number;
  totalValue: number;
}
export function DashboardResume({
  currentValue,
  totalValue,
}: DashboardResumeProps) {
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <Text className="text-gray-900 mb-3">Resumo rápido</Text>
      <View className="space-y-2">
        <View className="flex justify-between items-center">
          <Text className="text-gray-600">Taxa de conclusão</Text>
          <Text className="text-gray-900">
            {totalValue > 0 ? Math.round((currentValue / totalValue) * 100) : 0}
            %
          </Text>
        </View>
        <View className="w-full bg-gray-200 rounded-full h-2">
          <View
            className="bg-[#10b981] h-2 rounded-full"
            style={{
              width: `${
                totalValue > 0 ? (currentValue / totalValue) * 100 : 0
              }%`,
            }}
          />
        </View>
      </View>
    </View>
  );
}
