import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Linking, Pressable, Text, View } from "react-native";
import "../global.css";

import { AppUpdateWarning } from "@/components/app-update-warning";
import { OnboardingCarousel } from "@/components/onboarding-carousel";
import { SplashScreen } from "@/components/splash-screen";
import { ConfigProvider } from "@/context/ConfigContext";
import { createExpoDbAdapter } from "@/core/config/storage/adapters/expo-adapter";
import { initDatabase } from "@/core/config/storage/database-config";
import { ServiceProvider } from "@/core/services/context/ServiceContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FeedbackProvider } from "@/hooks/useFeedbackModal";
import { useOnboarding } from "@/hooks/useOnboarding";
import {
  getAllRemoteConfig,
  getRemoteConfigValue,
  initRemoteConfig,
} from "@/lib/remoteConfig";
import { useEffect, useState } from "react";
import ToastManager from "toastify-react-native";
import pkg from "../package.json";

export const unstable_settings = {
  anchor: "(tabs)",
};

const shouldForceUpdate = (target: string, current: string): boolean => {
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

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const [ready, setReady] = useState(false);
  const [updateRequired, setUpdateRequired] = useState(false);
  const [updateUrl, setUpdateUrl] = useState("");
  const [updateCheckDone, setUpdateCheckDone] = useState(false);
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
      // console.log("Database adapter created, initializing...");
      await initDatabase(db);
      // console.log("Database initialized");
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

  useEffect(() => {
    (async () => {
      try {
        await initRemoteConfig();

        if (__DEV__) {
          const all = getAllRemoteConfig();
          // console.log("[remoteConfig] Active config", all);
        }

        const targetVersion = getRemoteConfigValue("app_update_target_version");
        const url = getRemoteConfigValue("app_update_url");

        setUpdateUrl(String(url || ""));

        const mustUpdate =
          shouldForceUpdate(
            String(targetVersion || ""),
            pkg.version ?? "0.0.0",
          ) || false;

        setUpdateRequired(mustUpdate);
      } finally {
        setUpdateCheckDone(true);
      }
    })();
  }, []);

  if (!ready || onboardingLoading || !updateCheckDone) {
    return <SplashScreen />;
  }

  if (updateRequired) {
    return (
      <ThemeProvider value={DefaultTheme}>
        <View className="flex-1 items-center justify-center bg-white px-6">
          <View className="items-center gap-3">
            <Text className="text-2xl font-bold text-gray-900 text-center">
              Atualização necessária
            </Text>
            <Text className="text-gray-600 text-center">
              Para continuar, atualize o aplicativo para a versão mais recente.
            </Text>
          </View>

          <View className="mt-6 w-full">
            <Pressable
              onPress={() => {
                const fallbackUrl =
                  "https://play.google.com/store/apps/details?id=com.yourapp";
                Linking.openURL(updateUrl || fallbackUrl);
              }}
              className="bg-primary rounded-xl py-3 items-center"
            >
              <Text className="text-white font-semibold">Atualizar</Text>
            </Pressable>
          </View>
        </View>
      </ThemeProvider>
    );
  }

  // Show onboarding carousel if it's the first time
  if (showOnboarding) {
    return <OnboardingCarousel onComplete={completeOnboarding} />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <ConfigProvider>
        <ServiceProvider>
          <FeedbackProvider>
            <View className={"flex-1"}>
              <AppUpdateWarning />
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
          </FeedbackProvider>
        </ServiceProvider>
      </ConfigProvider>
      <ToastManager />
    </ThemeProvider>
  );
}
