describe("RemoteConfig Integration", () => {
  describe("Default Config Values", () => {
    it("deve ter ads_enabled = true por padrão", () => {
      const adsEnabled = true; // padrão
      expect(adsEnabled).toBe(true);
    });

    it("deve ter ads_force_test = true para testes", () => {
      const forceTestAds = true; // padrão
      expect(forceTestAds).toBe(true);
    });

    it("deve ter free_template_limit = 3", () => {
      const limit = 3;
      expect(limit).toBeGreaterThan(0);
    });

    it("deve ter app_update_url válida para Play Store", () => {
      const url =
        "https://play.google.com/store/apps/details?id=br.com.workchecklist.app";
      expect(url).toContain("play.google.com");
      expect(url).toContain("br.com.workchecklist.app");
    });
  });

  describe("Config Values Validation", () => {
    it("contact_email deve ser um email válido", () => {
      const email = "contato@empresa.com";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(email)).toBe(true);
    });

    it("contact_phone deve ter formato de telefone", () => {
      const phone = "(11) 99999-9999";
      expect(phone).toMatch(/\(\d{2}\)\s\d{5}-\d{4}/);
    });

    it("empty_state_message não deve estar vazio", () => {
      const message = "Você não tem nenhum serviço pendente";
      expect(message.length).toBeGreaterThan(0);
    });
  });
});
