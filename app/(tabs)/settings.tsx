

import SettingsView from "@/core/config/views/Settings.view";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function settings() {
  const router = useRouter();

  const backToHome = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SettingsView />
  );
}

