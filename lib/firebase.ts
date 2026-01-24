import analytics from "@react-native-firebase/analytics";
import app from "@react-native-firebase/app";
import crashlytics from "@react-native-firebase/crashlytics";
import remoteConfig, {
  FirebaseRemoteConfigTypes,
} from "@react-native-firebase/remote-config";

// Instâncias centralizadas (apenas mobile)
let firebaseAnalytics = null;
let firebaseCrashlytics = null;
let firebaseRemoteConfig: FirebaseRemoteConfigTypes.Module | null = null;

try {
  firebaseAnalytics = analytics();
  firebaseCrashlytics = crashlytics();
  firebaseRemoteConfig = remoteConfig();
} catch (err) {
  console.warn("[firebase] Native modules not available", err);
}

export {
  firebaseAnalytics, app as firebaseApp, firebaseCrashlytics,
  firebaseRemoteConfig
};

