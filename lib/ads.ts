import { getRemoteConfigValue } from "@/lib/remoteConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AdEventType,
  InterstitialAd,
  MobileAds,
  TestIds,
} from "react-native-google-mobile-ads";

export type BannerAdKey =
  | "services_banner"
  | "reports_banner"
  | "config_banner"
  | "home_banner";

export type InterstitialAdKey =
  | "interticial_banner_service_created"
  | "interticial_banner_to_report_share"
  | "interticial_banner_to_service_finalize";

const FALLBACK_BANNER_ID = String(
  process.env.fallback_banner ?? process.env.EXPO_PUBLIC_FALLBACK_BANNER ?? "",
).trim();
const FALLBACK_INTERSTITIAL_ID = String(
  process.env.fallback_interstitial ??
    process.env.EXPO_PUBLIC_FALLBACK_INTERSTITIAL ??
    "",
).trim();

const INTERSTITIAL_COUNTER_KEY = "ad_interstitial_counter";

let mobileAdsInitialized = false;
let mobileAdsInitializing: Promise<void> | null = null;

async function ensureMobileAdsInitialized(): Promise<void> {
  if (!mobileAdsInitializing) {
    mobileAdsInitializing = MobileAds()
      .initialize()
      .then((adapterStatuses) => {
        mobileAdsInitialized = true;
        const mainAdapter = adapterStatuses?.find(
          (a: any) => a.name === "com.google.android.gms.ads.MobileAds",
        );
        if (mainAdapter?.state === 1) {
          console.log("[AdMob] ✓ Initialized successfully");
        } else {
          console.warn(
            "[AdMob] ⚠ Partial initialization - some adapters failed",
          );
        }
      })
      .catch((error) => {
        console.error("[AdMob] ✗ Initialization failed", error);
      })
      .finally(() => {
        mobileAdsInitializing = null;
      });
  }
  await mobileAdsInitializing;
}

export function getBannerAdUnitId(key: BannerAdKey): string {
  const remoteValue = String(getRemoteConfigValue(key) ?? "").trim();
  return remoteValue || FALLBACK_BANNER_ID;
}

export function getFallbackBannerAdUnitId(): string {
  return FALLBACK_BANNER_ID;
}

export function getInterstitialAdUnitId(key: InterstitialAdKey): string {
  const remoteValue = String(getRemoteConfigValue(key) ?? "").trim();
  return remoteValue || FALLBACK_INTERSTITIAL_ID;
}

async function shouldShowInterstitial(): Promise<boolean> {
  const interval = Number(getRemoteConfigValue("interstitial_interval") ?? 0);

  if (!Number.isFinite(interval) || interval <= 1) {
    return true;
  }

  const raw = await AsyncStorage.getItem(INTERSTITIAL_COUNTER_KEY);
  const current = raw ? parseInt(raw, 10) : 0;
  const next = current + 1;
  const shouldShow = next % interval === 0;
  await AsyncStorage.setItem(INTERSTITIAL_COUNTER_KEY, String(next % interval));
  return shouldShow;
}

export async function showInterstitialForKey(
  key: InterstitialAdKey,
): Promise<void> {
  const adsEnabled = Boolean(getRemoteConfigValue("ads_enabled"));
  if (!adsEnabled) return;

  const eligible = await shouldShowInterstitial();
  if (!eligible) return;

  const useTestAds = Boolean(__DEV__ || getRemoteConfigValue("ads_force_test"));
  const unitId = getInterstitialAdUnitId(key);
  const adUnitId = useTestAds ? TestIds.INTERSTITIAL : unitId;

  if (!adUnitId) return;

  await ensureMobileAdsInitialized();

  await new Promise<void>((resolve) => {
    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const cleanup = () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
      resolve();
    };

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      cleanup,
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => {
        cleanup();
      },
    );

    interstitial.load();
  });
}
