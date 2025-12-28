/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#2563EB"; // blue-600
const tintColorDark = "#60A5FA"; // blue-400

export const Colors = {
  light: {
    // Texto
    text: "#111827", // gray-900
    textMuted: "#6B7280", // gray-500

    // Backgrounds
    background: "#FFFFFF",
    surface: "#F9FAFB", // gray-50
    card: "#FFFFFF",

    // Bordas / divisores
    border: "#E5E7EB", // gray-200
    divider: "#E5E7EB",

    // Ações
    primary: tintColorLight,
    primaryForeground: "#FFFFFF",

    secondary: "#E5E7EB",
    secondaryForeground: "#111827",

    // Estados
    success: "#16A34A", // green-600
    warning: "#D97706", // amber-600
    destructive: "#DC2626", // red-600

    // Ícones
    icon: "#6B7280",
    iconMuted: "#9CA3AF",

    // Tabs
    tabIconDefault: "#9CA3AF",
    tabIconSelected: tintColorLight,
  },

  dark: {
    text: "#F9FAFB",
    textMuted: "#9CA3AF",

    background: "#0F172A", // slate-900
    surface: "#020617", // slate-950
    card: "#020617",

    border: "#1E293B", // slate-800
    divider: "#1E293B",

    primary: tintColorDark,
    primaryForeground: "#020617",

    secondary: "#1E293B",
    secondaryForeground: "#F9FAFB",

    success: "#22C55E",
    warning: "#FBBF24",
    destructive: "#EF4444",

    icon: "#CBD5E1",
    iconMuted: "#64748B",

    tabIconDefault: "#64748B",
    tabIconSelected: tintColorDark,
  },
};
// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//     border: '#E5E7EB'
//
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//     border: '#27272A',
//
//   },
// };

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
