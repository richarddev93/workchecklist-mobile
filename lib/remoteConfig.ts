import { getApp } from "@react-native-firebase/app";
import {
  fetchAndActivate,
  getAll,
  getRemoteConfig,
  getValue,
  setConfigSettings,
  setDefaults,
} from "@react-native-firebase/remote-config";

export interface RemoteConfigSchema {
  free_template_limit: number;
  show_premium_badge: boolean;
  feedback_enabled: boolean;
  feedback_trigger_services: number;
  app_update_warning_enabled: boolean;
  app_update_target_version: string;
  app_update_url: string;
  copy_empty_state_enabled: boolean;
  empty_state_message: string;
  empty_state_description: string;
  default_service_templates_json: string;
  contact_email: string;
  contact_phone: string;
  [key: string]: string | number | boolean;
}

const DEFAULT_CONFIG: RemoteConfigSchema = {
  free_template_limit: 3,
  show_premium_badge: false,
  feedback_enabled: true,
  feedback_trigger_services: 3,
  app_update_warning_enabled: false,
  app_update_target_version: "",
  app_update_url: "https://play.google.com/store/apps/details?id=com.yourapp",
  copy_empty_state_enabled: true,
  empty_state_message: "Você não tem nenhum serviço pendente",
  empty_state_description: "Vamos começar um novo",
  contact_email: "contato@empresa.com",
  contact_phone: "(11) 99999-9999",
  default_service_templates_json: JSON.stringify(
    [
      {
        name: "Ar-condicionado",
        service_type: "Manutenção preventiva",
        items: [
          "Desligamento do equipamento",
          "Inspeção visual geral",
          "Limpeza dos filtros",
          "Higienização da evaporadora",
          "Verificação de dreno",
          "Conferência de conexões elétricas",
          "Teste de funcionamento",
          "Verificação de ruídos anormais",
          "Orientações ao cliente",
        ],
      },
      {
        name: "Jardinagem",
        service_type: "Manutenção de área verde",
        items: [
          "Corte de grama",
          "Poda de plantas e arbustos",
          "Remoção de folhas secas",
          "Limpeza do terreno",
          "Verificação de pragas visíveis",
          "Organização do espaço",
          "Recolhimento de resíduos",
          "Orientações ao cliente",
        ],
      },
      {
        name: "Instalação elétrica",
        service_type: "Elétrica",
        items: [
          "Desligamento da rede elétrica",
          "Verificação do ponto de instalação",
          "Conferência de cabos e conexões",
          "Instalação / substituição do componente",
          "Fixação adequada",
          "Teste de funcionamento",
          "Verificação de segurança",
          "Liberação da rede elétrica",
          "Orientações ao cliente",
        ],
      },
    ],
    null,
    2,
  ),
};

export async function initRemoteConfig(): Promise<void> {
  try {
    const rc = getRemoteConfig(getApp());

    await setConfigSettings(rc, {
      minimumFetchIntervalMillis: 30000,
    });

    await setDefaults(rc, DEFAULT_CONFIG);

    const fetchedRemotely = await fetchAndActivate(rc);

    if (fetchedRemotely) {
      // console.log("[remoteConfig] ✓ Configs retrieved from backend");
    } else {
      // console.log("[remoteConfig] ✓ Using local configs");
    }
  } catch (err) {
    console.warn("[remoteConfig] Failed to initialize", err);
  }
}

export function getRemoteConfigValue<K extends keyof RemoteConfigSchema>(
  key: K,
): RemoteConfigSchema[K] {
  try {
    const rc = getRemoteConfig(getApp());
    const value = getValue(rc, key as string);
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
    const rc = getRemoteConfig(getApp());
    const parameters = getAll(rc);
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
