import { ServiceTemplate } from "@/types";
import { SQLiteRunResult } from "expo-sqlite";
import { DatabaseAdapter } from "../storage/database.interface";

export type ServiceTemplateRepository = {
  getAll(): Promise<ServiceTemplate[] | null>;
  save(data: Partial<ServiceTemplate>): Promise<void>;
  delete(id: string): Promise<SQLiteRunResult>;
  edit(data: Partial<ServiceTemplate>): Promise<SQLiteRunResult | undefined>;
};

export const createServiceTemplateRepository = (
  db: DatabaseAdapter,
): ServiceTemplateRepository => ({
  async getAll() {
    return await db.getAll<ServiceTemplate>("SELECT * FROM service_template");
  },

  async save(data: Partial<ServiceTemplate>) {
    await db.run(
      `INSERT OR REPLACE INTO service_template (
   name, service_type, items
  ) VALUES (?, ?, ?)`,
      [data.name, data.service_type ?? "", data.items ?? ""],
    );
  },
  async edit(data: Partial<ServiceTemplate>) {
    return await db.run(
      `UPDATE service_template SET 
          name = ?,
          items = ?,
          service_type = ?
          WHERE id = ?`,
      [data.name, data.items ?? "", data.service_type ?? "", data.id],
    );
  },
  async delete(id) {
    return await db.run(`DELETE FROM service_template WHERE id = ?`, [id]);
  },
});
