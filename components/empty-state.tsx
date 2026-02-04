import { getRemoteConfigValue } from "@/lib/remoteConfig";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Toast } from "toastify-react-native";

interface EmptyStateProps {
  message: string;
  description?: string;
  debugInfo?: string;
}

export function EmptyState({
  message,
  description,
  debugInfo,
}: EmptyStateProps) {
  const [copyEnabled, setCopyEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      const enabled = await getRemoteConfigValue("copy_empty_state_enabled");
      setCopyEnabled(enabled);
    })();
  }, []);

  const handleCopyDebugInfo = async () => {
    if (!debugInfo || !copyEnabled) return;

    await Clipboard.setStringAsync(debugInfo);
    Toast.show({
      type: "success",
      text1: "Copiado!",
      text2: "Informações copiadas para a área de transferência",
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="text-gray-500 text-lg text-center mb-2">{message}</Text>
      {description && (
        <Text className="text-gray-400 text-sm text-center mb-4">
          {description}
        </Text>
      )}
      {copyEnabled && debugInfo && (
        <Pressable
          onPress={handleCopyDebugInfo}
          className="mt-2 px-4 py-2 bg-gray-100 rounded-lg"
        >
          <Text className="text-gray-600 text-xs">
            Copiar informações de debug
          </Text>
        </Pressable>
      )}
    </View>
  );
}
