import remoteConfig from "@react-native-firebase/remote-config";

export interface RemoteConfigSchema {
  free_template_limit: number;
  show_premium_badge: boolean;
  feedback_enabled: boolean;
  feedback_trigger_services: number;
  app_update_warning_enabled: boolean;
  copy_empty_state_enabled: boolean;
  [key: string]: string | number | boolean;
}

const DEFAULT_CONFIG: RemoteConfigSchema = {
  free_template_limit: 3,
  show_premium_badge: false,
  feedback_enabled: true,
  feedback_trigger_services: 3,
  app_update_warning_enabled: false,
  copy_empty_state_enabled: true,
};

export async function initRemoteConfig(): Promise<void> {
  try {
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 30000,
    });

    await remoteConfig().setDefaults(DEFAULT_CONFIG);

    const fetchedRemotely = await remoteConfig().fetchAndActivate();

    if (fetchedRemotely) {
      console.log("[remoteConfig] ✓ Configs retrieved from backend");
    } else {
      console.log("[remoteConfig] ✓ Using local configs");
    }
  } catch (err) {
    console.warn("[remoteConfig] Failed to initialize", err);
  }
}

export function getRemoteConfigValue<K extends keyof RemoteConfigSchema>(
  key: K,
): RemoteConfigSchema[K] {
  try {
    const value = remoteConfig().getValue(key as string);
    const defaultVal = DEFAULT_CONFIG[key];

    if (typeof defaultVal === "boolean") {
      return value.asBoolean() as RemoteConfigSchema[K];
    }
    if (typeof defaultVal === "number") {
      return value.asNumber() as RemoteConfigSchema[K];
    }
    return value.asString() as RemoteConfigSchema[K];
  } catch (err) {
    console.warn(`[remoteConfig] Failed to get ${key}`, err);
    return DEFAULT_CONFIG[key];
  }
}

export function getAllRemoteConfig(): RemoteConfigSchema {
  try {
    const parameters = remoteConfig().getAll();
    const config: Partial<RemoteConfigSchema> = {};

    Object.entries(parameters).forEach(([key, entry]) => {
      if (key in DEFAULT_CONFIG) {
        const defaultVal = DEFAULT_CONFIG[key as keyof RemoteConfigSchema];

        if (typeof defaultVal === "boolean") {
          config[key as keyof RemoteConfigSchema] = entry.asBoolean() as any;
        } else if (typeof defaultVal === "number") {
          config[key as keyof RemoteConfigSchema] = entry.asNumber() as any;
        } else {
          config[key as keyof RemoteConfigSchema] = entry.asString() as any;
        }
      }
    });

    return { ...DEFAULT_CONFIG, ...config } as RemoteConfigSchema;
  } catch (err) {
    console.warn("[remoteConfig] Failed to get all configs", err);
    return DEFAULT_CONFIG;
  }
}
