import { getRemoteConfigValue } from "@/lib/remoteConfig";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface UpgradeCardProps {
  onHandler?: () => void;
}
export function UpgradeCard({ onHandler }: UpgradeCardProps) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    (async () => {
      const badge = await getRemoteConfigValue("show_premium_badge");
      setShowBadge(badge);
    })();
  }, []);

  return (
    <View className="bg-primary rounded-xl p-4 mb-5">
      <View className="flex-row items-center gap-2 mb-1">
        <Ionicons name="ribbon-outline" size={18} color="white" />
        <Text className="text-white font-semibold">Upgrade para Premium</Text>
        {showBadge && (
          <View className="bg-yellow-400 px-2 py-0.5 rounded-full">
            <Text className="text-xs font-bold text-gray-900">NOVO</Text>
          </View>
        )}
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
