import { getFallbackBannerAdUnitId } from "@/lib/ads";
import { getRemoteConfigValue } from "@/lib/remoteConfig";
import React, { useEffect, useMemo, useState } from "react";
import { View, ViewStyle } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  MobileAds,
  TestIds,
} from "react-native-google-mobile-ads";

// const getInterstitialAdUnitId = (useTestAds: boolean) =>
//   useTestAds
//     ? TestIds.INTERSTITIAL
//     : (Platform.select({
//         ios: "ca-app-pub-xxx/yyy",
//         android: "ca-app-pub-xxx/yyy",
//       }) ?? TestIds.INTERSTITIAL);

// const getRewardedAdUnitId = (useTestAds: boolean) =>
//   useTestAds
//     ? TestIds.REWARDED
//     : (Platform.select({
//         ios: "ca-app-pub-xxx/yyy",
//         android: "ca-app-pub-xxx/yyy",
//       }) ?? TestIds.REWARDED);

const AdMobManager = ({
  style,
  unitId,
}: {
  style?: ViewStyle;
  unitId?: string;
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [forceTestAds, setForceTestAds] = useState(false);

  useEffect(() => {
    setAdsEnabled(Boolean(getRemoteConfigValue("ads_enabled")));
    setForceTestAds(Boolean(getRemoteConfigValue("ads_force_test")));
  }, []);

  useEffect(() => {
    if (!adsEnabled) return;

    MobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log("AdMob Initialization complete", adapterStatuses);
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error("AdMob Initialization failed", error);
        setIsInitialized(false);
      });
  }, [adsEnabled]);

  const shouldUseTestAds = useMemo(
    () => Boolean(__DEV__ || forceTestAds),
    [forceTestAds],
  );

  const bannerUnitId = useMemo(() => {
    if (shouldUseTestAds) {
      return TestIds.BANNER;
    }

    return unitId ?? getFallbackBannerAdUnitId();
  }, [shouldUseTestAds, unitId]);

  // const interstitialUnitId = useMemo(
  //   () => getInterstitialAdUnitId(shouldUseTestAds),
  //   [shouldUseTestAds],
  // );

  // const rewardedUnitId = useMemo(
  //   () => getRewardedAdUnitId(shouldUseTestAds),
  //   [shouldUseTestAds],
  // );

  // Banner Ad Component
  const BannerAdComponent = () => (
    <BannerAd
      unitId={bannerUnitId as string}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdLoaded={() => {
        console.log("Banner ad loaded");
      }}
      onAdFailedToLoad={(error) => {
        console.error("Banner ad failed to load", error);
      }}
    />
  );

  // const loadInterstitial = () => {
  //   const interstitial = InterstitialAd.createForAdRequest(
  //     interstitialUnitId as string,
  //     {
  //       requestNonPersonalizedAdsOnly: true,
  //     },
  //   );
  //
  //   interstitial.addAdEventListener(AdEventType.LOADED, () => {
  //     interstitial.show();
  //   });
  //
  //   interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  //     interstitial.load();
  //   });
  //
  //   interstitial.load();
  // };

  // const loadRewardedAd = () => {
  //   const rewarded = RewardedAd.createForAdRequest(
  //     rewardedUnitId as string,
  //     {
  //       requestNonPersonalizedAdsOnly: true,
  //     },
  //   );
  //
  //   rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
  //     rewarded.show();
  //   });
  //
  //   rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
  //     console.log("User earned reward of ", reward);
  //   });
  //
  //   rewarded.load();
  // };

  if (!adsEnabled || !isInitialized) {
    return null;
  }

  return (
    <View style={style}>
      <BannerAdComponent />
    </View>
  );
};

export default AdMobManager;
