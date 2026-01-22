import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} className="flex-1 bg-white">
      {children}
    </SafeAreaView>
  );
}
