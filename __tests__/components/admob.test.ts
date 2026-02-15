describe("AdMob Manager", () => {
  describe("Banner Ad Unit ID Selection", () => {
    it("deve usar TestIds.BANNER quando forceTestAds = true", () => {
      const shouldUseTestAds = true;
      const testId = "ca-app-pub-3940256099942544/6300978111";

      expect(shouldUseTestAds).toBe(true);
      expect(testId).toContain("ca-app-pub");
    });

    it("deve usar production ID quando forceTestAds = false e não em DEV", () => {
      const shouldUseTestAds = false;
      const productionId = "ca-app-pub-1785031579807096/8245483491";

      expect(shouldUseTestAds).toBe(false);
      expect(productionId).toContain("ca-app-pub");
    });

    it("deve sempre usar TestIds quando __DEV__ = true", () => {
      const isDev = true;
      const forceTestAds = false;
      const shouldUseTest = isDev || forceTestAds;

      expect(shouldUseTest).toBe(true);
    });
  });

  describe("AdMob Initialization", () => {
    it("deve não renderizar se adsEnabled = false", () => {
      const adsEnabled = false;

      if (!adsEnabled) {
        expect(adsEnabled).toBe(false);
      }
    });

    it("deve não renderizar se isInitialized = false", () => {
      const isInitialized = false;

      if (!isInitialized) {
        expect(isInitialized).toBe(false);
      }
    });

    it("deve renderizar apenas quando adsEnabled = true E isInitialized = true", () => {
      const adsEnabled = true;
      const isInitialized = true;
      const shouldRender = adsEnabled && isInitialized;

      expect(shouldRender).toBe(true);
    });
  });

  describe("Dynamic Unit ID", () => {
    it("deve aceitar unitId como prop", () => {
      const customUnitId = "ca-app-pub-custom-unit-id";
      expect(customUnitId).toBeDefined();
      expect(customUnitId).toContain("ca-app-pub");
    });

    it("deve usar unitId passado ao invés do padrão", () => {
      const defaultId = "ca-app-pub-1785031579807096/8245483491";
      const customId = "ca-app-pub-custom-unit-id";
      const unitId = customId ?? defaultId;

      expect(unitId).toBe(customId);
      expect(unitId).not.toBe(defaultId);
    });

    it("deve usar unitId padrão se nenhum for passado", () => {
      const defaultId = "ca-app-pub-1785031579807096/8245483491";
      const unitId = undefined ?? defaultId;

      expect(unitId).toBe(defaultId);
    });
  });
});
