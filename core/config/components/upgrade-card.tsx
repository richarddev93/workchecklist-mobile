import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface UpgradeCardProps {
  onHandler?: () => void;
}
export function UpgradeCard({ onHandler }: UpgradeCardProps) {
  return (
    <View className="bg-primary rounded-xl p-4 mb-5">
      <View className="flex-row items-center gap-2 mb-1">
        <Ionicons name="ribbon-outline" size={18} color="white" />
        <Text className="text-white font-semibold">Upgrade para Premium</Text>
      </View>
      <Text className="text-white/90 text-sm mb-3">
        Desbloqueie recursos ilimitados e remova anúncios
      </Text>
      <TouchableOpacity
        onPress={onHandler}
        className="bg-white self-start px-4 py-2 rounded-lg"
      >
        <Text className="text-primary font-medium">Ver Planos</Text>
      </TouchableOpacity>
    </View>
  );
}
