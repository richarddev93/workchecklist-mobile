import { getRemoteConfigValue } from "@/lib/remoteConfig";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";

export function AppUpdateWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const enabled = await getRemoteConfigValue("app_update_warning_enabled");
      setIsEnabled(enabled);

      if (enabled) {
        // Check if there's an update available
        // This is a simple implementation - in production you might want to check version from a backend
        const hasUpdate = await checkForUpdates();
        setShowWarning(hasUpdate);
      }
    })();
  }, []);

  const checkForUpdates = async (): Promise<boolean> => {
    // TODO: Implement actual version checking logic
    // For now, return false
    // You could check against a backend API or use expo-updates
    return false;
  };

  const handleUpdatePress = () => {
    // Open app store or play store
    const storeUrl =
      // Replace with your actual app store URLs
      "https://play.google.com/store/apps/details?id=com.yourapp";
    Linking.openURL(storeUrl);
  };

  if (!isEnabled || !showWarning) {
    return null;
  }

  return (
    <View className="bg-orange-500 px-4 py-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2 flex-1">
        <Ionicons name="warning" size={20} color="white" />
        <View className="flex-1">
          <Text className="text-white font-semibold text-sm">
            Atualização disponível
          </Text>
          <Text className="text-white/90 text-xs">
            Uma nova versão está disponível
          </Text>
        </View>
      </View>

      <Pressable
        onPress={handleUpdatePress}
        className="bg-white px-3 py-1.5 rounded-lg"
      >
        <Text className="text-orange-500 font-semibold text-xs">Atualizar</Text>
      </Pressable>
    </View>
  );
}
