import { Text } from "@/components/ui/text";
import { Image, View } from "react-native";

export function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="items-center gap-8">
        <Image
          source={require("@/assets/images/Logo-horizontal.png")}
          className="w-64 h-24"
          resizeMode="contain"
        />

        <Text className="text-gray-600 text-sm text-center">
          Carregando seu assistente profissional...
        </Text>
      </View>
    </View>
  );
}
