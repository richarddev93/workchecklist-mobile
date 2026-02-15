import { getAllRemoteConfig, getRemoteConfigValue } from "@/lib/remoteConfig";

describe("RemoteConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRemoteConfigValue", () => {
    it("deve retornar valor boolean corretamente", () => {
      const result = getRemoteConfigValue("ads_enabled");
      expect(typeof result).toBe("boolean");
    });

    it("deve retornar valor number corretamente", () => {
      const result = getRemoteConfigValue("free_template_limit");
      expect(typeof result).toBe("number");
    });

    it("deve retornar valor string corretamente", () => {
      const result = getRemoteConfigValue("contact_email");
      expect(typeof result).toBe("string");
    });

    it("deve retornar valor padrão se houver erro", () => {
      const result = getRemoteConfigValue("app_update_url");
      expect(result).toContain("play.google.com");
    });
  });

  describe("getAllRemoteConfig", () => {
    it("deve retornar objeto com todas as configurações", () => {
      const result = getAllRemoteConfig();

      expect(result).toHaveProperty("ads_enabled");
      expect(result).toHaveProperty("ads_force_test");
      expect(result).toHaveProperty("free_template_limit");
      expect(result).toHaveProperty("contact_email");
    });

    it("deve conter as chaves esperadas", () => {
      const result = getAllRemoteConfig();
      const expectedKeys = [
        "free_template_limit",
        "show_premium_badge",
        "feedback_enabled",
        "feedback_trigger_services",
        "ads_enabled",
        "ads_force_test",
        "app_update_warning_enabled",
        "app_update_target_version",
        "app_update_url",
      ];

      expectedKeys.forEach((key) => {
        expect(result).toHaveProperty(key);
      });
    });
  });
});
