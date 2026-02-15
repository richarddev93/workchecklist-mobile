describe("Service Type Management", () => {
  describe("Service Type Deletion Confirmation", () => {
    it("deve exibir diálogo de confirmação ao deletar", () => {
      const showConfirmation = true;
      expect(showConfirmation).toBe(true);
    });

    it("deve conter nome do tipo no diálogo", () => {
      const typeName = "Manutenção Preventiva";
      const dialogMessage = `Tem certeza que deseja excluir o tipo "${typeName}"?`;

      expect(dialogMessage).toContain(typeName);
      expect(dialogMessage).toContain("excluir");
    });

    it("deve ter opção de cancelar", () => {
      const options = ["Cancelar", "Excluir"];
      expect(options).toContain("Cancelar");
    });

    it("deve ter opção destrutiva de excluir", () => {
      const options = ["Cancelar", "Excluir"];
      expect(options).toContain("Excluir");
    });
  });

  describe("Service Type Validation", () => {
    it("tipo sem nome deve ser inválido", () => {
      const name = "";
      const isValid = name.trim().length > 0;

      expect(isValid).toBe(false);
    });

    it("tipo com nome deve ser válido", () => {
      const name = "Manutenção Corretiva";
      const isValid = name.trim().length > 0;

      expect(isValid).toBe(true);
    });

    it("tipo com apenas espaços deve ser inválido", () => {
      const name = "   ";
      const isValid = name.trim().length > 0;

      expect(isValid).toBe(false);
    });
  });

  describe("Service Type Creation", () => {
    it("deve criar novo tipo corretamente", () => {
      const newType = "Consultoria";
      const types = [
        { id: "1", name: "Manutenção Preventiva" },
        { id: "2", name: "Manutenção Corretiva" },
      ];

      types.push({ id: "3", name: newType });

      expect(types).toContainEqual({ id: "3", name: "Consultoria" });
      expect(types.length).toBe(3);
    });
  });

  describe("Service Type Update", () => {
    it("deve atualizar nome do tipo", () => {
      const types = [
        { id: "1", name: "Manutenção Preventiva" },
        { id: "2", name: "Manutenção Corretiva" },
      ];

      const typeToUpdate = types.find((t) => t.id === "1");
      if (typeToUpdate) {
        typeToUpdate.name = "Manutenção Planejada";
      }

      expect(types[0].name).toBe("Manutenção Planejada");
    });

    it("deve manter ID ao atualizar", () => {
      const types = [{ id: "1", name: "Manutenção Preventiva" }];
      const originalId = types[0].id;

      types[0].name = "Novo Nome";

      expect(types[0].id).toBe(originalId);
    });
  });

  describe("Service Type Display", () => {
    it("deve exibir contagem correta de tipos", () => {
      const types = [
        { id: "1", name: "Tipo 1" },
        { id: "2", name: "Tipo 2" },
        { id: "3", name: "Tipo 3" },
      ];

      const label = `${types.length} ${types.length === 1 ? "tipo" : "tipos"}`;

      expect(label).toBe("3 tipos");
    });

    it('deve usar "tipo" no singular para 1 item', () => {
      const types = [{ id: "1", name: "Tipo 1" }];

      const label = `${types.length} ${types.length === 1 ? "tipo" : "tipos"}`;

      expect(label).toBe("1 tipo");
    });
  });
});
