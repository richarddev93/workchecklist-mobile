import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";

import { OnboardingCarousel } from "@/components/onboarding-carousel";
import { ConfigProvider } from "@/context/ConfigContext";
import { createExpoDbAdapter } from "@/core/config/storage/adapters/expo-adapter";
import { initDatabase } from "@/core/config/storage/database-config";
import { ServiceProvider } from "@/core/services/context/ServiceContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useEffect, useState } from "react";
import ToastManager from "toastify-react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const [ready, setReady] = useState(false);
  const {
    showOnboarding,
    loading: onboardingLoading,
    completeOnboarding,
  } = useOnboarding();
  //caso seja necessario criar o thema dark
  // adicionar no view className={colorScheme !== "dark" ? "dark flex-1" : "flex-1"}
  const startDatabase = async (isMounted: () => boolean) => {
    try {
      const db = await createExpoDbAdapter();
      console.log("Database adapter created, initializing...");
      await initDatabase(db);
      console.log("Database initialized");
      if (isMounted()) setReady(true);
    } catch (error) {
      console.error("Error initializing database:", error);
      if (isMounted()) setReady(true); // Set ready anyway to avoid blocking the app
    }
  };
  useEffect(() => {
    let mounted = true;
    startDatabase(() => mounted);

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready || onboardingLoading) {
    return null; // Return null until database and onboarding status are ready
  }

  // Show onboarding carousel if it's the first time
  if (showOnboarding) {
    return <OnboardingCarousel onComplete={completeOnboarding} />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <ConfigProvider>
        <ServiceProvider>
          <View className={"flex-1"}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="(tabs)"
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
              <Stack.Screen
                name="services/[id]"
                options={{ headerShown: false }}
              />
            </Stack>

            <PortalHost />
            <StatusBar style="dark" backgroundColor="#ffffff" />
          </View>
        </ServiceProvider>
      </ConfigProvider>
      <ToastManager />
    </ThemeProvider>
  );
}
