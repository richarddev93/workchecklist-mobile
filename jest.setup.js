import "@testing-library/jest-native/extend-expect";

jest.mock("@react-native-firebase/app", () => ({
  getApp: jest.fn(),
}));

jest.mock("@react-native-firebase/remote-config", () => ({
  getRemoteConfig: jest.fn(),
  getValue: jest.fn(),
  setDefaults: jest.fn(),
  setConfigSettings: jest.fn(),
  fetchAndActivate: jest.fn(),
  getAll: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@react-navigation/bottom-tabs", () => ({
  useBottomTabBarHeight: jest.fn(() => 60),
}));

jest.mock("react-native-google-mobile-ads", () => ({
  MobileAds: jest.fn(() => ({
    initialize: jest.fn(() => Promise.resolve({})),
  })),
  BannerAd: jest.fn(() => null),
  TestIds: {
    BANNER: "ca-app-pub-3940256099942544/6300978111",
    INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
    REWARDED: "ca-app-pub-3940256099942544/5224354917",
  },
  BannerAdSize: {
    BANNER: "BANNER",
  },
}));

global.fetch = jest.fn();
