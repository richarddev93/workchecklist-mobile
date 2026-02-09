import { getRemoteConfigValue } from "@/lib/remoteConfig";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import pkg from "../package.json";

export function AppUpdateWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [updateUrl, setUpdateUrl] = useState("");

  useEffect(() => {
    const enabled = getRemoteConfigValue("app_update_warning_enabled");
    const targetVersion = getRemoteConfigValue("app_update_target_version");
    const url = getRemoteConfigValue("app_update_url");

    setIsEnabled(Boolean(enabled));
    setUpdateUrl(String(url || ""));

    if (enabled) {
      const hasUpdate = shouldShowUpdateWarning(
        String(targetVersion || ""),
        pkg.version ?? "0.0.0",
      );
      setShowWarning(hasUpdate);
    }
  }, []);

  const shouldShowUpdateWarning = (
    target: string,
    current: string,
  ): boolean => {
    const normalizedTarget = target.trim();
    if (!normalizedTarget) return false;

    return compareVersions(current, normalizedTarget) === -1;
  };

  const compareVersions = (current: string, target: string): number => {
    const currentParts = current.split(".").map((v) => Number(v));
    const targetParts = target.split(".").map((v) => Number(v));
    const length = Math.max(currentParts.length, targetParts.length);

    for (let i = 0; i < length; i += 1) {
      const currentVal = Number.isFinite(currentParts[i]) ? currentParts[i] : 0;
      const targetVal = Number.isFinite(targetParts[i]) ? targetParts[i] : 0;

      if (currentVal < targetVal) return -1;
      if (currentVal > targetVal) return 1;
    }

    return 0;
  };

  const handleUpdatePress = () => {
    // Open app store or play store
    const fallbackUrl =
      "https://play.google.com/store/apps/details?id=com.yourapp";
    Linking.openURL(updateUrl || fallbackUrl);
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
