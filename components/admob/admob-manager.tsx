import React, { useEffect } from "react";
import { Platform, View, ViewStyle } from "react-native";
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  MobileAds,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

// Configure Ad Units
const HOME_BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: "ca-app-pub-xxx/yyy",
      android: "ca-app-pub-1785031579807096/8245483491",
    });

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: "ca-app-pub-xxx/yyy",
      android: "ca-app-pub-xxx/yyy",
    });

const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: "ca-app-pub-xxx/yyy",
      android: "ca-app-pub-xxx/yyy",
    });

const AdMobManager = ({ style }: { style?: ViewStyle }) => {
  useEffect(() => {
    // Initialize MobileAds
    MobileAds()
      .initialize()
      .then((adapterStatuses) => {
        // Initialization complete
        console.log("AdMob Initialization complete", adapterStatuses);
      });
  }, []);

  // Banner Ad Component
  const BannerAdComponent = () => (
    <BannerAd
      unitId={HOME_BANNER_AD_UNIT_ID as string}
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

  // Interstitial Ad Management
  const loadInterstitial = () => {
    const interstitial = InterstitialAd.createForAdRequest(
      INTERSTITIAL_AD_UNIT_ID as string,
      {
        requestNonPersonalizedAdsOnly: true,
      },
    );

    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show();
    });

    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      // Ad closed, load a new one
      interstitial.load();
    });

    // Begin loading
    interstitial.load();
  };

  // Rewarded Ad Management
  const loadRewardedAd = () => {
    const rewarded = RewardedAd.createForAdRequest(
      REWARDED_AD_UNIT_ID as string,
      {
        requestNonPersonalizedAdsOnly: true,
      },
    );

    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewarded.show();
    });

    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log("User earned reward of ", reward);
      // Handle user reward
    });

    // Begin loading
    rewarded.load();
  };

  return (
    <View style={style}>
      <BannerAdComponent />
    </View>
  );
};

export default AdMobManager;
