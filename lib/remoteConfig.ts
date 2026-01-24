import { getRemoteConfig, RemoteConfig } from "firebase/remote-config";
import { firebaseApp } from "./firebase";

// Type-safe remote config schema
export interface RemoteConfigSchema {
  free_template_limit: number;
  show_premium_badge: boolean;
  feedback_enabled: boolean;
  feedback_trigger_services: number;
  app_update_warning_enabled: boolean;
  copy_empty_state_enabled: boolean;
}

// Default values (fallback if remote config fails or not initialized)
const DEFAULT_CONFIG: RemoteConfigSchema = {
  free_template_limit: 1,
  show_premium_badge: false,
  feedback_enabled: true,
  feedback_trigger_services: 3,
  app_update_warning_enabled: false,
  copy_empty_state_enabled: true,
};

let remoteConfigInstance: RemoteConfig | null = null;
let remoteConfigReady: Promise<RemoteConfig | null> | null = null;

async function getRemoteConfigSafe(): Promise<RemoteConfig | null> {
  if (remoteConfigInstance) return remoteConfigInstance;
  if (!remoteConfigReady) {
    remoteConfigReady = (async () => {
      try {
        const rc = getRemoteConfig(firebaseApp);
        // Set cache duration (in milliseconds). 0 = always fetch fresh (dev), production use higher values
        rc.settings.minimumFetchIntervalMillis = 60000; // 1 minute (adjust for production)
        rc.settings.fetchTimeoutMillis = 5000; // 5 second timeout

        // Fetch and activate remote config
        await rc.fetch();
        rc.activate();
        remoteConfigInstance = rc;
        console.log("[remoteConfig] ✓ initialized");
        return rc;
      } catch (err) {
        console.warn("[remoteConfig] Failed to initialize", err);
        return null;
      }
    })();
  }
  return remoteConfigReady;
}

// Get individual config value with fallback to defaults
export async function getRemoteConfigValue<K extends keyof RemoteConfigSchema>(
  key: K,
): Promise<RemoteConfigSchema[K]> {
  const rc = await getRemoteConfigSafe();
  if (!rc) return DEFAULT_CONFIG[key];

  try {
    const value = rc.getValue(key);
    if (!value.asString()) return DEFAULT_CONFIG[key];

    // Parse based on type (Firebase returns strings)
    const defaultVal = DEFAULT_CONFIG[key];
    const stringVal = value.asString();

    if (typeof defaultVal === "boolean") {
      return stringVal.toLowerCase() === ("true" as RemoteConfigSchema[K]);
    }
    if (typeof defaultVal === "number") {
      return Number(stringVal) as RemoteConfigSchema[K];
    }
    return stringVal as RemoteConfigSchema[K];
  } catch (err) {
    console.warn(`[remoteConfig] Failed to get ${key}`, err);
    return DEFAULT_CONFIG[key];
  }
}

// Get all config at once
export async function getAllRemoteConfig(): Promise<RemoteConfigSchema> {
  const keys: (keyof RemoteConfigSchema)[] = [
    "free_template_limit",
    "show_premium_badge",
    "feedback_enabled",
    "feedback_trigger_services",
    "app_update_warning_enabled",
    "copy_empty_state_enabled",
  ];

  const config: Partial<RemoteConfigSchema> = {};
  for (const key of keys) {
    config[key] = await getRemoteConfigValue(key);
  }
  return config as RemoteConfigSchema;
}

// Initialize on app start (optional, but recommended)
export async function initRemoteConfig(): Promise<void> {
  await getRemoteConfigSafe();
}
