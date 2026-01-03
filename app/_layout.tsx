import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";

import { ConfigProvider } from "@/context/ConfigContext";
import { ServiceProvider } from "@/core/services/context/ServiceContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  //caso seja necessario criar o thema dark
  // adicionar no view className={colorScheme !== "dark" ? "dark flex-1" : "flex-1"}

  return (
    <ThemeProvider value={DefaultTheme}>
      <ConfigProvider>
        <ServiceProvider>
          <View className={"flex-1"}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>

            <PortalHost />
            <StatusBar style="auto" />
          </View>
        </ServiceProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}
